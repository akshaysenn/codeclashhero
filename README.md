# ⚔️ CodeClash — Real-time 1v1 Competitive Coding

> Challenge a friend to a live coding duel. Solve the same problems, race the clock, and see who wins.

---

## 🎮 What is CodeClash?

**CodeClash** is a real-time multiplayer competitive coding platform where two players go head-to-head in timed coding rounds. Each player receives the same algorithmic problem and submits their solution. The faster you solve it, the more points you earn. After all rounds, the player with the highest total score wins.

---

## ✨ Features

- ⚡ **Real-time 1v1 matches** powered by Socket.IO
- 🌐 **Multi-language support** — compete in **Python**, **C++**, or **C**
- 🧠 **300+ curated questions** across Easy, Medium, and Hard difficulties (100 per language)
- 🏆 **Dynamic scoring** — solve faster to earn more points per round
- 📋 **Room system** — create a room, share the code, and battle anyone instantly
- 🔢 **Configurable rounds** — play 1, 3, or 5 round matches
- 🖥️ **Server-side code evaluation** — all code runs securely on the server
- 🐳 **Docker-ready** — deploy anywhere in seconds

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express |
| Real-time | Socket.IO |
| Frontend | Vanilla HTML / CSS / JavaScript |
| Code Execution | `python3`, `g++`, `gcc` via `child_process` |
| Deployment | Docker (Alpine Linux) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- Python 3
- `g++` (for C++ evaluation)
- `gcc` (for C evaluation)

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/akshaysenn/codeclashhero.git
cd codeclashhero

# 2. Install dependencies
npm install

# 3. Start the server
npm start
```

Then open **http://localhost:3000** in your browser.

---

## 🐳 Docker Deployment

```bash
# Build the image
docker build -t codeclash .

# Run the container
docker run -p 3000:3000 codeclash
```

---

## 🎯 How to Play

1. **Player 1** opens the app, enters their name, selects a language (Python / C++ / C), sets rounds & difficulty, and clicks **Create Room**.
2. A unique **Room ID** is generated — share it with your opponent.
3. **Player 2** enters their name, pastes the Room ID, and clicks **Join Match**.
4. Once both players are in the waiting room, the match begins automatically.
5. Each round shows the same coding problem to both players.
6. Write your solution in the editor and click **Submit Code**.
7. Points are awarded based on how quickly you solve it. Fastest solver earns the most.
8. After all rounds, the player with the highest total score is declared the **winner**! 🏆

---

## 📂 Project Structure

```
codeclashhero/
├── server.js                 # Node.js backend, Socket.IO game logic, code execution
├── script.js                 # Frontend game logic
├── index.html                # Main app UI (lobby, match, results)
├── codeclash.html            # Landing page
├── style.css                 # Styling and animations
├── Dockerfile                # Docker image config
├── questions.json            # 100 Python questions (Easy/Medium/Hard)
├── questions_cpp.json        # 100 C++ questions
├── questions_c.json          # 100 C questions
├── generate_questions.js     # Script to regenerate Python question DB
├── generate_questions_cpp.js # Script to regenerate C++ question DB
└── generate_questions_c.js   # Script to regenerate C question DB
```

---

## 🔒 Security

- All user code is executed **server-side** in isolated temporary files.
- Execution is limited to a **2-second timeout** (Python) and **3-second timeout** (C / C++) to prevent infinite loops or denial-of-service.
- Temporary source and binary files are deleted immediately after execution.

---

## 🧩 Regenerating the Question Database

If you want to add or modify questions:

```bash
node generate_questions.js      # Regenerates questions.json (Python)
node generate_questions_cpp.js  # Regenerates questions_cpp.json (C++)
node generate_questions_c.js    # Regenerates questions_c.json (C)
```

---

## 📜 License

MIT — free to use, modify, and distribute.

---

<p align="center">Built with ❤️ for competitive coders.</p>
