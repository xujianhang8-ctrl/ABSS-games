(() => {
  let order = TRUEFALSE_DATA.map((_, i) => i);
  let idx = 0;
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
    counter.textContent = `Statement ${idx + 1} of ${order.length}`;
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
    result.textContent = correct ? "Correct! 🎉" : "Not quite!";
    result.className = "result " + (correct ? "correct-text" : "wrong-text");
    explain.textContent = item.a
      ? (item.explain || "That statement is TRUE.")
      : (item.explain || "That statement is FALSE.");
    trueBtn.disabled = true;
    falseBtn.disabled = true;
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
    render();
  });

  render();
})();
