(() => {
  const GAME_KEY = "truefalse";
  const total = TRUEFALSE_DATA.length;

  const saved = AbssState.load(GAME_KEY);
  const validSaved = saved && Array.isArray(saved.order) && saved.order.length === total;

  let order = validSaved ? saved.order : TRUEFALSE_DATA.map((_, i) => i);
  let idx = validSaved ? Math.min(saved.idx || 0, order.length - 1) : 0;
  let answeredPositions = validSaved && Array.isArray(saved.answeredPositions) ? saved.answeredPositions : [];
  let answered = false;

  const counter = document.getElementById("counter");
  const statement = document.getElementById("statement");
  const result = document.getElementById("result");
  const explain = document.getElementById("explain");
  const trueBtn = document.getElementById("true-btn");
  const falseBtn = document.getElementById("false-btn");
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");
  const shuffleBtn = document.getElementById("shuffle-btn");

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function persist() {
    AbssState.save(GAME_KEY, { order, idx, answeredPositions });
  }

  function render() {
    const item = TRUEFALSE_DATA[order[idx]];
    counter.textContent = `Statement ${idx + 1} of ${order.length} — ${answeredPositions.length} answered`;
    statement.textContent = item.s;
    result.textContent = "";
    result.className = "result";
    explain.textContent = "";
    answered = answeredPositions.includes(idx);
    trueBtn.disabled = answered;
    falseBtn.disabled = answered;
    prevBtn.disabled = idx === 0;
    if (answered) {
      const correct = item.a;
      result.textContent = "Already answered";
      result.className = "result";
      explain.textContent = item.a ? (item.explain || "That statement is TRUE.") : (item.explain || "That statement is FALSE.");
    }
    persist();
  }

  function answer(choice) {
    if (answered) return;
    answered = true;
    if (!answeredPositions.includes(idx)) answeredPositions.push(idx);
    const item = TRUEFALSE_DATA[order[idx]];
    const correct = choice === item.a;
    result.textContent = correct ? "Correct! 🎉" : "Not quite!";
    result.className = "result " + (correct ? "correct-text" : "wrong-text");
    explain.textContent = item.a
      ? (item.explain || "That statement is TRUE.")
      : (item.explain || "That statement is FALSE.");
    trueBtn.disabled = true;
    falseBtn.disabled = true;
    persist();
  }

  trueBtn.addEventListener("click", () => answer(true));
  falseBtn.addEventListener("click", () => answer(false));
  nextBtn.addEventListener("click", () => {
    idx = (idx + 1) % order.length;
    render();
  });
  prevBtn.addEventListener("click", () => {
    if (idx > 0) {
      idx -= 1;
      render();
    }
  });
  shuffleBtn.addEventListener("click", () => {
    order = shuffle(order);
    idx = 0;
    answeredPositions = [];
    render();
  });

  render();
  AbssMenu.init({ gameKey: GAME_KEY, gameLabel: "True or False Lightning Round" });
})();
