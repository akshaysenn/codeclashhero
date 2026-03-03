const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Landing page at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'codeclash.html'));
});

// Lobby / game app
app.get('/lobby', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve static files (CSS, JS, socket assets, etc.)
app.use(express.static(__dirname));

// (requires moved to top)

let questionsDB = {};
try {
    questionsDB = JSON.parse(fs.readFileSync(path.join(__dirname, 'questions.json'), 'utf8'));
} catch (e) {
    console.error("Could not load questions.json", e);
}

// Room Data
// Format: { roomId: { players: [{id, name, score, totalScore}], totalRounds: 3, currentRound: 0, questions: [], matchActive: false, timeRemaining: 900 } }
const rooms = {};

// Helper: Get random questions
function getRandomQuestions(difficulty, count) {
    const pool = questionsDB[difficulty] || questionsDB['Easy'];
    if (!pool || pool.length === 0) return null;

    // Shuffle and pick
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Create Room
    socket.on('createRoom', ({ name, roomId, rounds, difficulty }) => {
        let parsedRounds = parseInt(rounds) || 1;

        const qList = getRandomQuestions(difficulty, parsedRounds);
        if (!qList) {
            socket.emit('errorMsg', 'Server Error: Question Database not found or failed to load on Render.');
            return;
        }

        rooms[roomId] = {
            players: [{ id: socket.id, name, score: 0, totalScore: 0, state: 'Waiting...' }],
            totalRounds: parsedRounds,
            currentRound: 0,
            questions: qList,
            difficulty: difficulty,
            matchActive: false,
            timeRemaining: 900 // 15 mins
        };
        socket.join(roomId);
        socket.roomId = roomId; // store on socket instance
        socket.emit('roomCreated', roomId);
    });

    // Join Room
    socket.on('joinRoom', ({ name, roomId }) => {
        if (!rooms[roomId]) {
            socket.emit('errorMsg', 'Room not found.');
            return;
        }

        if (rooms[roomId].players.length >= 2) {
            socket.emit('errorMsg', 'Room is full.');
            return;
        }

        rooms[roomId].players.push({ id: socket.id, name, score: 0, totalScore: 0, state: 'Reading problem...' });
        socket.join(roomId);
        socket.roomId = roomId;

        // Start Next Round Flow
        startNextRound(roomId);
    });

    // Status Update (Typing, Running, etc)
    socket.on('statusUpdate', (state) => {
        const roomId = socket.roomId;
        if (!roomId || !rooms[roomId]) return;

        // Broadcast to OPONNENT only
        socket.to(roomId).emit('opponentStatus', state);
    });

    // Score Penalty
    socket.on('penalty', (newScore) => {
        const roomId = socket.roomId;
        if (!roomId || !rooms[roomId]) return;

        // Update score in state and broadcast
        const player = rooms[roomId].players.find(p => p.id === socket.id);
        if (player) player.score = newScore;
        socket.to(roomId).emit('opponentScore', newScore);
    });

    // Submit Success (Victory for Round)
    socket.on('submitSuccess', ({ score }) => {
        const roomId = socket.roomId;
        if (!roomId || !rooms[roomId] || !rooms[roomId].matchActive) return;

        rooms[roomId].matchActive = false;
        clearInterval(rooms[roomId].timerInterval);

        // Update Points: the winner gets their score, the loser gets 0 for this round
        const me = rooms[roomId].players.find(p => p.id === socket.id);
        const opp = rooms[roomId].players.find(p => p.id !== socket.id);

        if (me) me.totalScore += score;
        if (opp) opp.totalScore += 0; // Opponent did not finish, 0 points

        // If this was the last round
        const isLastRound = rooms[roomId].currentRound >= rooms[roomId].totalRounds - 1;

        if (isLastRound) {
            // MATCH OVER
            const meWon = me && opp ? me.totalScore >= opp.totalScore : true;

            io.to(roomId).emit('matchEnded', {
                outcome: meWon ? 'Match Victory!' : 'Match Defeat...',
                finalScores: { [me.id]: me.totalScore, [opp.id]: opp.totalScore },
                winnerId: meWon ? me.id : (opp ? opp.id : null)
            });
        } else {
            // ROUND OVER
            io.to(roomId).emit('roundEnded', {
                winnerName: me.name,
                roundScore: score,
                nextRoundStartsIn: 5
            });

            // Advance Round
            rooms[roomId].currentRound++;

            // Auto start next round in 5 seconds
            setTimeout(() => {
                startNextRound(roomId);
            }, 5000);
        }
    });

    // Server Side Python Execution
    socket.on('evaluateCode', ({ userCode }) => {
        const roomId = socket.roomId;
        if (!roomId || !rooms[roomId] || !rooms[roomId].matchActive) return;

        const qIndex = rooms[roomId].currentRound;
        const question = rooms[roomId].questions[qIndex];
        if (!question) return;

        // 1. Write temp python file combining user code + our validations
        const pyContent = userCode + "\n\n" + question.validation;
        const tempName = path.join(__dirname, `code_${socket.id}.py`);

        fs.writeFile(tempName, pyContent, (err) => {
            if (err) {
                return socket.emit('evaluationResult', { success: false, error: 'Server Error writing file.' });
            }

            // 2. Execute it via Child Process securely
            // Timeout to prevent infinite loops giving it 2 seconds max
            exec(`python "${tempName}"`, { timeout: 2000 }, (error, stdout, stderr) => {
                // 3. Cleanup temp file
                fs.unlink(tempName, () => { });

                if (error || stderr) {
                    const failMsg = (stderr || error.message).trim();
                    socket.emit('evaluationResult', { success: false, error: failMsg });
                } else if (stdout.includes('Passed')) {
                    socket.emit('evaluationResult', { success: true, stdout: stdout.trim() });
                } else {
                    socket.emit('evaluationResult', { success: false, error: 'Test cases failed or no output.' });
                }
            });
        });
    });

    // Handle Disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        const roomId = socket.roomId;

        if (roomId && rooms[roomId]) {
            socket.to(roomId).emit('opponentDisconnected');
            // Clean up room if empty
            rooms[roomId].players = rooms[roomId].players.filter(p => p.id !== socket.id);
            if (rooms[roomId].players.length === 0) {
                delete rooms[roomId];
            }
        }
    });
});

function startNextRound(roomId) {
    if (!rooms[roomId]) return;

    rooms[roomId].matchActive = true;
    rooms[roomId].timeRemaining = 900; // Reset 15 mins

    // Reset round scores, but keep totalScores
    rooms[roomId].players.forEach(p => {
        p.score = 1500;
        p.state = 'Reading problem...';
    });

    // Get question for this round
    const qIndex = rooms[roomId].currentRound;
    // Fallback in case we run out of questions
    const question = rooms[roomId].questions[qIndex] || rooms[roomId].questions[0];

    io.to(roomId).emit('roundStart', {
        players: rooms[roomId].players,
        timeRemaining: rooms[roomId].timeRemaining,
        currentRound: qIndex + 1,
        totalRounds: rooms[roomId].totalRounds,
        question: question
    });

    startRoomTimer(roomId);
}

function startRoomTimer(roomId) {
    if (!rooms[roomId]) return;
    clearInterval(rooms[roomId].timerInterval);

    rooms[roomId].timerInterval = setInterval(() => {
        if (!rooms[roomId] || !rooms[roomId].matchActive) {
            clearInterval(timerInterval);
            return;
        }

        rooms[roomId].timeRemaining--;
        io.to(roomId).emit('timeUpdate', rooms[roomId].timeRemaining);

        if (rooms[roomId].timeRemaining <= 0) {
            rooms[roomId].matchActive = false;
            clearInterval(rooms[roomId].timerInterval);

            // In a time up scenario, BOTH failed, BOTH get 0 points for the round
            const me = rooms[roomId].players[0];
            const opp = rooms[roomId].players[1];

            if (me) me.totalScore += 0;
            if (opp) opp.totalScore += 0;

            const isLastRound = rooms[roomId].currentRound >= rooms[roomId].totalRounds - 1;

            if (isLastRound) {
                const meWon = me && opp ? me.totalScore >= opp.totalScore : true;
                io.to(roomId).emit('matchEnded', {
                    outcome: 'Time Up - Match Over!',
                    finalScores: { [me.id]: me.totalScore, [opp.id]: opp.totalScore },
                    winnerId: meWon ? me.id : (opp ? opp.id : null)
                });
            } else {
                io.to(roomId).emit('roundEnded', {
                    winnerName: 'Nobody (Time Up)',
                    roundScore: 0,
                    nextRoundStartsIn: 5
                });

                rooms[roomId].currentRound++;
                setTimeout(() => { startNextRound(roomId); }, 5000);
            }
        }
    }, 1000);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
