(() => {
  const STORAGE_KEY = "abss_truefalse_state_v1";

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!parsed || !Array.isArray(parsed.order) || parsed.order.length !== TRUEFALSE_DATA.length) return null;
      if (typeof parsed.idx !== "number" || parsed.idx < 0 || parsed.idx >= parsed.order.length) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }
  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ order, idx }));
  }

  const saved = loadState();
  let order = saved ? saved.order : TRUEFALSE_DATA.map((_, i) => i);
  let idx = saved ? saved.idx : 0;
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

  function render() {
    const item = TRUEFALSE_DATA[order[idx]];
    counter.textContent = `第 ${idx + 1} 题，共 ${order.length} 题`;
    statement.textContent = item.s;
    result.textContent = "";
    result.className = "result";
    explain.textContent = "";
    answered = false;
    trueBtn.disabled = false;
    falseBtn.disabled = false;
    prevBtn.disabled = idx === 0;
  }

  function answer(choice) {
    if (answered) return;
    answered = true;
    const item = TRUEFALSE_DATA[order[idx]];
    const correct = choice === item.a;
    result.textContent = correct ? "答对了！🎉" : "不太对哦！";
    result.className = "result " + (correct ? "correct-text" : "wrong-text");
    explain.textContent = item.a
      ? (item.explain || "这句话是对的。")
      : (item.explain || "这句话是错的。");
    trueBtn.disabled = true;
    falseBtn.disabled = true;
  }

  trueBtn.addEventListener("click", () => answer(true));
  falseBtn.addEventListener("click", () => answer(false));
  nextBtn.addEventListener("click", () => {
    idx = (idx + 1) % order.length;
    saveState();
    render();
  });
  prevBtn.addEventListener("click", () => {
    if (idx > 0) {
      idx -= 1;
      saveState();
      render();
    }
  });
  shuffleBtn.addEventListener("click", () => {
    order = shuffle(order);
    idx = 0;
    saveState();
    render();
  });

  render();
})();
