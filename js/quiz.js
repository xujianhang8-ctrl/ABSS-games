(() => {
  const GAME_KEY = "quiz";
  const board = document.getElementById("board");
  const overlay = document.getElementById("modal-overlay");
  const modalPts = document.getElementById("modal-pts");
  const modalQuestion = document.getElementById("modal-question");
  const modalAnswer = document.getElementById("modal-answer");
  const revealBtn = document.getElementById("reveal-btn");
  const awardRow = document.getElementById("award-row");
  const closeBtn = document.getElementById("close-btn");

  function loadUsed() {
    const saved = AbssState.load(GAME_KEY);
    return (saved && Array.isArray(saved.used)) ? saved.used : [];
  }
  function saveUsed(used) {
    AbssState.save(GAME_KEY, { used });
  }

  let used = loadUsed();
  let currentKey = null;

  function cellKey(catIdx, qIdx) {
    return catIdx + "-" + qIdx;
  }

  function renderBoard() {
    board.innerHTML = "";
    QUIZ_DATA.categories.forEach((cat) => {
      const h = document.createElement("div");
      h.className = "cat-header";
      h.textContent = cat.name;
      board.appendChild(h);
    });
    const maxRows = Math.max(...QUIZ_DATA.categories.map((c) => c.questions.length));
    for (let r = 0; r < maxRows; r++) {
      QUIZ_DATA.categories.forEach((cat, catIdx) => {
        const q = cat.questions[r];
        const cell = document.createElement("div");
        if (!q) {
          cell.className = "cell used";
          cell.textContent = "";
          board.appendChild(cell);
          return;
        }
        const key = cellKey(catIdx, r);
        const isUsed = used.includes(key);
        cell.className = "cell" + (isUsed ? " used" : "");
        cell.textContent = isUsed ? "" : q.points;
        if (!isUsed) {
          cell.addEventListener("click", () => openQuestion(catIdx, r));
        }
        board.appendChild(cell);
      });
    }
  }

  function openQuestion(catIdx, qIdx) {
    const cat = QUIZ_DATA.categories[catIdx];
    const q = cat.questions[qIdx];
    currentKey = cellKey(catIdx, qIdx);
    modalPts.textContent = `${cat.name} — ${q.points} 分`;
    modalQuestion.textContent = q.q;
    modalAnswer.textContent = q.a;
    modalAnswer.classList.remove("shown");
    revealBtn.style.display = "inline-block";
    buildAwardRow(q.points);
    overlay.classList.add("open");
  }

  function buildAwardRow(points) {
    awardRow.innerHTML = "";
    const teams = AbssScoreboard.getTeams();
    teams.forEach((t) => {
      const btn = document.createElement("button");
      btn.className = "btn small";
      btn.style.background = t.color;
      btn.textContent = `${t.name} +${points} 分`;
      btn.addEventListener("click", () => {
        AbssScoreboard.addPoints(t.id, points);
        markUsedAndClose();
      });
      awardRow.appendChild(btn);
    });
    const noneBtn = document.createElement("button");
    noneBtn.className = "btn small ghost";
    noneBtn.textContent = "没有队伍答对";
    noneBtn.addEventListener("click", markUsedAndClose);
    awardRow.appendChild(noneBtn);
  }

  function markUsedAndClose() {
    if (currentKey && !used.includes(currentKey)) {
      used.push(currentKey);
      saveUsed(used);
    }
    overlay.classList.remove("open");
    renderBoard();
  }

  revealBtn.addEventListener("click", () => {
    modalAnswer.classList.add("shown");
    revealBtn.style.display = "none";
  });
  closeBtn.addEventListener("click", () => {
    overlay.classList.remove("open");
    renderBoard();
  });

  renderBoard();
  AbssMenu.init({ gameKey: GAME_KEY, gameLabel: "智慧问答大赛" });
})();
