// DOM Elements
const views = {
    lobby: document.getElementById('lobby-view'),
    waiting: document.getElementById('waiting-view'),
    match: document.getElementById('match-view'),
    results: document.getElementById('results-view')
};

// Lobby UI Elements
const createNameInput = document.getElementById('create-name-input');
const createRoundsSelect = document.getElementById('create-rounds-select');
const createDiffSelect = document.getElementById('create-diff-select');
const createRoomBtn = document.getElementById('create-room-btn');
const joinNameInput = document.getElementById('join-name-input');
const joinRoomInput = document.getElementById('join-room-input');
const joinBtn = document.getElementById('join-btn');

// Waiting UI Elements
const displayRoomId = document.getElementById('display-room-id');
const copyBtn = document.getElementById('copy-btn');
const cancelWaitBtn = document.getElementById('cancel-wait-btn');

// Match UI Elements
const roundHeaderEl = document.getElementById('round-header');
const problemTitleEl = document.getElementById('problem-title');
const problemDiffEl = document.getElementById('problem-difficulty');
const problemDescEl = document.getElementById('problem-desc');
const problemExamplesEl = document.getElementById('problem-examples');
const runBtn = document.getElementById('run-btn');
const submitBtn = document.getElementById('submit-btn');
const rematchBtn = document.getElementById('rematch-btn');
const countdownEl = document.getElementById('countdown');
const opponentStatusEl = document.getElementById('opponent-status');
const playerScoreEl = document.getElementById('player-score');
const codeEditor = document.getElementById('code-editor');
const consoleEl = document.getElementById('output-console');
const playerNameEl = document.getElementById('player-name');
const opponentNameEl = document.getElementById('opponent-name');
const lineNumbersEl = document.getElementById('line-numbers');

// Results UI Elements
const resultTitle = document.getElementById('result-title');
const finalPlayerScore = document.getElementById('final-player-score');
const finalTime = document.getElementById('final-time');
const finalOpponentStatus = document.getElementById('final-opponent-status');

// State
const socket = io();
let typingTimer;
let timeRemaining = 15 * 60;
let currentScore = 1500;
let matchActive = false;
let myName = '';

// ---- UTILITY FUNCTIONS ----

function switchView(viewName) {
    Object.values(views).forEach(v => v.classList.remove('active'));
    views[viewName].classList.add('active');
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function updateTimerDisplay() {
    if (!countdownEl) return;
    countdownEl.innerText = formatTime(timeRemaining);
    if (timeRemaining <= 60) {
        countdownEl.classList.add('danger');
    } else {
        countdownEl.classList.remove('danger');
    }
}

function updateLineNumbers() {
    if (!lineNumbersEl || !codeEditor) return;
    const lines = codeEditor.value.split('\n').length;
    lineNumbersEl.innerHTML = Array(lines).fill(0).map((_, i) => i + 1).join('<br>');
}

function createConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;
    container.innerHTML = '';
    const colors = ['#00e1ff', '#00ff88', '#ffffff'];
    for (let i = 0; i < 50; i++) {
        const conf = document.createElement('div');
        conf.style.position = 'absolute';
        conf.style.width = '10px';
        conf.style.height = '10px';
        conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        conf.style.left = Math.random() * 100 + '%';
        conf.style.top = '-10px';
        conf.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 2;
        conf.animate([
            { transform: 'translate3d(0,0,0) rotate(0deg)', opacity: 1 },
            { transform: `translate3d(${Math.random() * 100 - 50}px, 100vh, 0) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], { duration: duration * 1000, delay: delay * 1000, easing: 'cubic-bezier(.37,0,.63,1)', fill: 'forwards' });
        container.appendChild(conf);
    }
}

function endMatch(outcome, fScore = currentScore, oppStatus = 'Finished', isRoundOver = false, nextRoundStartsIn = 0) {
    matchActive = false;
    if (!resultTitle) return;

    resultTitle.innerText = outcome;
    resultTitle.style.background = '';
    resultTitle.style.webkitBackgroundClip = '';
    resultTitle.style.backgroundClip = '';
    resultTitle.style.color = 'var(--text-primary)';

    if (outcome.includes('Victory') || outcome.includes('Winner')) {
        resultTitle.style.background = 'linear-gradient(135deg, var(--accent-blue), var(--accent-green))';
        resultTitle.style.webkitBackgroundClip = 'text';
        resultTitle.style.color = 'transparent';
        createConfetti();
    } else if (outcome.includes('Over') && !outcome.includes('Defeat')) {
        resultTitle.style.color = '#ffb700';
    } else {
        resultTitle.style.background = 'linear-gradient(135deg, var(--accent-red), #ff8800)';
        resultTitle.style.webkitBackgroundClip = 'text';
        resultTitle.style.color = 'transparent';
    }

    if (finalPlayerScore) finalPlayerScore.innerText = fScore;
    if (finalOpponentStatus) finalOpponentStatus.innerText = oppStatus;

    if (isRoundOver) {
        if (finalTime) finalTime.innerText = `Next round starts in ${nextRoundStartsIn}s...`;
        let localCd = nextRoundStartsIn;
        const intv = setInterval(() => {
            localCd--;
            if (localCd > 0 && !matchActive) {
                if (finalTime) finalTime.innerText = `Next round starts in ${localCd}s...`;
            } else {
                clearInterval(intv);
            }
        }, 1000);
    } else {
        if (finalTime) finalTime.innerText = formatTime((15 * 60) - timeRemaining);
    }

    setTimeout(() => switchView('results'), 500);
}

function evaluateCode(isSubmit = false) {
    if (!matchActive || !codeEditor) return;
    const btn = isSubmit ? submitBtn : runBtn;
    if (btn) { btn.innerText = 'Evaluating...'; btn.style.opacity = '0.7'; }
    if (runBtn) runBtn.disabled = true;
    if (submitBtn) submitBtn.disabled = true;
    window.lastEvaluationWasSubmit = isSubmit;
    socket.emit('evaluateCode', { userCode: codeEditor.value });
}

// ---- SOCKET.IO EVENTS ----

socket.on('errorMsg', (msg) => {
    alert(msg);
    switchView('lobby');
});

socket.on('roomCreated', (roomId) => {
    if (displayRoomId) displayRoomId.innerText = roomId;
    switchView('waiting');
});

socket.on('roundStart', ({ players, timeRemaining: tr, currentRound, totalRounds, question, language }) => {
    timeRemaining = tr;
    currentScore = 1500;
    matchActive = true;
    updateTimerDisplay();

    if (roundHeaderEl) roundHeaderEl.innerText = `Round ${currentRound}/${totalRounds}`;
    if (problemTitleEl) problemTitleEl.innerText = question.title;

    const editorFilenameEl = document.getElementById('editor-filename');
    if (editorFilenameEl) {
        if (language === 'cpp') editorFilenameEl.innerText = 'main.cpp';
        else if (language === 'c') editorFilenameEl.innerText = 'main.c';
        else editorFilenameEl.innerText = 'main.py';
    }
    if (problemDiffEl) {
        problemDiffEl.innerText = question.difficulty;
        problemDiffEl.className = `difficulty ${question.difficulty.toLowerCase()}`;
    }
    if (problemDescEl) problemDescEl.innerHTML = question.desc;
    if (problemExamplesEl) problemExamplesEl.innerHTML = question.examples;
    if (codeEditor) { codeEditor.value = question.template; updateLineNumbers(); }
    if (consoleEl) consoleEl.style.display = 'none';

    const me = players.find(p => p.id === socket.id);
    const opp = players.find(p => p.id !== socket.id);
    if (me) {
        if (playerNameEl) playerNameEl.innerText = me.name;
        if (playerScoreEl) playerScoreEl.innerText = `${me.score} pts`;
    }
    if (opp) {
        if (opponentNameEl) opponentNameEl.innerText = opp.name;
        if (opponentStatusEl) opponentStatusEl.innerText = opp.state || 'Waiting...';
    }
    switchView('match');
});

socket.on('timeUpdate', (tr) => {
    timeRemaining = tr;
    updateTimerDisplay();
    if (timeRemaining % 3 === 0 && currentScore > 100 && matchActive) {
        currentScore -= 2;
        if (playerScoreEl) playerScoreEl.innerText = `${currentScore} pts`;
    }
});

socket.on('opponentStatus', (state) => {
    if (opponentStatusEl) {
        opponentStatusEl.innerText = state.text;
        opponentStatusEl.style.color = state.color;
    }
});

socket.on('opponentScore', (score) => { /* visual only */ });

socket.on('matchEnded', ({ outcome, finalScores, winnerId }) => {
    const myScore = finalScores[socket.id] || currentScore;
    const oppId = Object.keys(finalScores).find(id => id !== socket.id);
    const oppScore = oppId ? finalScores[oppId] : 0;

    let oppStatus = 'Finished';
    let myOutcome = outcome || 'Match Ended';

    if (winnerId === socket.id) {
        oppStatus = `Defeated (${oppScore} pts)`;
        myOutcome = outcome && outcome.includes('Time Up') ? 'Time Up - Victory!' : 'Match Victory!';
    } else if (winnerId) {
        oppStatus = `Winner! (${oppScore} pts)`;
        myOutcome = outcome && outcome.includes('Time Up') ? 'Time Up - Defeat' : 'Match Defeat...';
    } else {
        oppStatus = `Tie (${oppScore} pts)`;
        myOutcome = outcome && outcome.includes('Time Up') ? 'Time Up - Tie!' : 'Match Tie!';
    }

    endMatch(myOutcome, myScore, oppStatus);
});

socket.on('roundEnded', ({ winnerName, roundScore, nextRoundStartsIn }) => {
    endMatch(`Round Over!`, roundScore, `Winner: ${winnerName}`, true, nextRoundStartsIn);
});

socket.on('opponentDisconnected', () => {
    if (matchActive) endMatch('Victory! (Disconnect)', currentScore, 'Disconnected');
});

socket.on('evaluationResult', (data) => {
    if (runBtn) { runBtn.innerText = 'Run Code'; runBtn.style.opacity = '1'; runBtn.disabled = false; }
    if (submitBtn) { submitBtn.innerText = 'Submit'; submitBtn.style.opacity = '1'; submitBtn.disabled = false; }
    const isSubmit = window.lastEvaluationWasSubmit;
    if (consoleEl) consoleEl.style.display = 'block';

    if (data.success) {
        if (consoleEl) {
            consoleEl.innerText = isSubmit ? "All test cases passed!" : "Sample test cases passed!";
            consoleEl.className = 'output-console success';
        }
        socket.emit('statusUpdate', { text: 'Tests Passed!', color: 'var(--accent-green)' });
        if (isSubmit) {
            socket.emit('submitSuccess', { score: currentScore });

            // 🎉 Confetti celebration burst
            if (typeof confetti === 'function') {
                const duration = 2000;
                const end = Date.now() + duration;
                const colors = ['#00d4ff', '#7fff00', '#ff00c8', '#ffd700', '#ffffff'];

                (function burst() {
                    confetti({
                        particleCount: 60,
                        spread: 70,
                        origin: { x: Math.random() * 0.4 + 0.3, y: 0.5 },
                        colors: colors,
                        zIndex: 9999,
                    });
                    if (Date.now() < end) requestAnimationFrame(burst);
                })();
            }
        }
    } else {
        if (consoleEl) {
            consoleEl.innerText = data.error || "Unknown Error";
            consoleEl.className = 'output-console error';
        }
        const penalty = isSubmit ? 100 : 20;
        currentScore = Math.max(0, currentScore - penalty);
        if (playerScoreEl) playerScoreEl.innerText = `${currentScore} pts`;
        socket.emit('statusUpdate', { text: 'Test Failed', color: 'var(--accent-red)' });
        socket.emit('penalty', currentScore);
        if (countdownEl) {
            countdownEl.classList.add('danger');
            setTimeout(() => { if (timeRemaining > 60) countdownEl.classList.remove('danger'); }, 500);
        }
    }
});

// ---- LOBBY LOGIC ----

let selectedLang = 'python';
const langBtns = document.querySelectorAll('.lang-btn');
langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        langBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedLang = btn.dataset.lang;
    });
});

// Custom rounds toggle
const customRoundsWrapper = document.getElementById('custom-rounds-wrapper');
const customRoundsInput = document.getElementById('custom-rounds-input');
createRoundsSelect.addEventListener('change', () => {
    if (createRoundsSelect.value === 'custom') {
        customRoundsWrapper.style.display = 'block';
        customRoundsInput.focus();
    } else {
        customRoundsWrapper.style.display = 'none';
    }
});

createRoomBtn.addEventListener('click', () => {
    myName = createNameInput.value.trim();
    if (myName === '') {
        createNameInput.style.borderColor = 'var(--accent-red)';
        setTimeout(() => createNameInput.style.borderColor = 'var(--border-color)', 500);
        return;
    }

    let rounds = createRoundsSelect.value;
    if (rounds === 'custom') {
        const custom = parseInt(customRoundsInput.value);
        if (!custom || custom < 1 || custom > 50) {
            customRoundsInput.style.borderColor = 'var(--accent-red)';
            setTimeout(() => customRoundsInput.style.borderColor = 'var(--border-color)', 500);
            customRoundsInput.focus();
            return;
        }
        rounds = String(custom);
    }

    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const difficulty = createDiffSelect.value;
    socket.emit('createRoom', { name: myName, roomId, rounds, difficulty, language: selectedLang });
});

if (copyBtn) copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(displayRoomId.innerText);
    const oldText = copyBtn.innerText;
    copyBtn.innerText = 'Copied!';
    setTimeout(() => copyBtn.innerText = oldText, 2000);
});

if (cancelWaitBtn) cancelWaitBtn.addEventListener('click', () => window.location.reload());

joinBtn.addEventListener('click', () => {
    myName = joinNameInput.value.trim();
    const roomId = joinRoomInput.value.trim();
    if (myName === '' || roomId === '') {
        if (myName === '') joinNameInput.style.borderColor = 'var(--accent-red)';
        if (roomId === '') joinRoomInput.style.borderColor = 'var(--accent-red)';
        setTimeout(() => {
            joinNameInput.style.borderColor = 'var(--border-color)';
            joinRoomInput.style.borderColor = 'var(--border-color)';
        }, 500);
        return;
    }
    socket.emit('joinRoom', { name: myName, roomId });
});

createNameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') createRoomBtn.click(); });
joinRoomInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') joinBtn.click(); });

// ---- EDITOR LOGIC ----

if (codeEditor) {
    // Typing status update
    codeEditor.addEventListener('input', () => {
        updateLineNumbers();
        if (!matchActive) return;
        socket.emit('statusUpdate', { text: 'Typing...', color: 'var(--accent-blue)' });
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
            socket.emit('statusUpdate', { text: 'Thinking...', color: 'var(--text-secondary)' });
        }, 2000);
    });

    codeEditor.addEventListener('scroll', () => {
        if (lineNumbersEl) lineNumbersEl.style.transform = `translateY(-${codeEditor.scrollTop}px)`;
    });

    codeEditor.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.selectionStart;
            const end = this.selectionEnd;
            this.value = this.value.substring(0, start) + "    " + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + 4;
            updateLineNumbers();
        }
    });
}

if (runBtn) runBtn.addEventListener('click', () => evaluateCode(false));
if (submitBtn) submitBtn.addEventListener('click', () => evaluateCode(true));
if (rematchBtn) rematchBtn.addEventListener('click', () => window.location.reload());

// Init
createNameInput.focus();
updateLineNumbers();
