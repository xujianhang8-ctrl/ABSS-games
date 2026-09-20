(() => {
  const GAME_KEY = "timeline";
  const N = TIMELINE_DATA.length;
  let placed = new Array(N).fill(null); // slot index -> original data index
  let bankOrder = [];
  let checked = false;

  const slotsEl = document.getElementById("slots");
  const bankEl = document.getElementById("bank");
  const checkBtn = document.getElementById("check-btn");
  const resetBtn = document.getElementById("reset-btn");
  const reshuffleBtn = document.getElementById("reshuffle-btn");
  const awardRow = document.getElementById("award-row");

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function persist() {
    AbssState.save(GAME_KEY, { placed, bankOrder, checked });
  }

  function newShuffle() {
    bankOrder = shuffle(TIMELINE_DATA.map((_, i) => i));
    placed = new Array(N).fill(null);
    checked = false;
    awardRow.innerHTML = "";
    render();
  }

  function loadSaved() {
    const saved = AbssState.load(GAME_KEY);
    const valid =
      saved &&
      Array.isArray(saved.placed) &&
      saved.placed.length === N &&
      Array.isArray(saved.bankOrder);
    if (!valid) {
      newShuffle();
      return;
    }
    placed = saved.placed;
    bankOrder = saved.bankOrder;
    checked = !!saved.checked;
    render();
    if (checked) {
      const correctCount = placed.filter((dataIdx, slotIdx) => dataIdx === slotIdx).length;
      buildAwardRow(correctCount);
    }
  }

  function render() {
    slotsEl.innerHTML = "";
    placed.forEach((dataIdx, slotIdx) => {
      const slot = document.createElement("div");
      slot.className = "slot";
      const num = document.createElement("div");
      num.className = "num";
      num.textContent = slotIdx + 1;
      slot.appendChild(num);
      const content = document.createElement("div");
      content.className = "content";
      if (dataIdx !== null) {
        const item = TIMELINE_DATA[dataIdx];
        content.innerHTML = `${item.text}<div class="note">${item.note}</div>`;
        if (checked) {
          slot.classList.add(dataIdx === slotIdx ? "correct" : "incorrect");
          slot.classList.add("revealed");
        } else {
          slot.style.cursor = "pointer";
          slot.addEventListener("click", () => {
            if (checked) return;
            bankOrder.push(dataIdx);
            placed[slotIdx] = null;
            persist();
            render();
          });
        }
      } else {
        content.textContent = "";
      }
      slot.appendChild(content);
      slotsEl.appendChild(slot);
    });

    bankEl.innerHTML = "";
    bankOrder.forEach((dataIdx) => {
      const card = document.createElement("div");
      card.className = "card-item";
      card.textContent = TIMELINE_DATA[dataIdx].text;
      card.addEventListener("click", () => {
        const emptySlot = placed.indexOf(null);
        if (emptySlot === -1) return;
        placed[emptySlot] = dataIdx;
        bankOrder = bankOrder.filter((x) => x !== dataIdx);
        persist();
        render();
      });
      bankEl.appendChild(card);
    });

    checkBtn.disabled = placed.includes(null) || checked;
    persist();
  }

  function check() {
    if (placed.includes(null)) return;
    checked = true;
    const correctCount = placed.filter((dataIdx, slotIdx) => dataIdx === slotIdx).length;
    render();
    buildAwardRow(correctCount);
  }

  function buildAwardRow(correctCount) {
    awardRow.innerHTML = "";
    const label = document.createElement("div");
    label.className = "pill";
    label.textContent = `${correctCount} of ${N} in the correct spot`;
    awardRow.appendChild(label);
    const teams = AbssScoreboard.getTeams();
    teams.forEach((t) => {
      const btn = document.createElement("button");
      btn.className = "btn small";
      btn.style.background = t.color;
      btn.textContent = `Award ${t.name} +${correctCount}`;
      btn.addEventListener("click", () => AbssScoreboard.addPoints(t.id, correctCount));
      awardRow.appendChild(btn);
    });
  }

  checkBtn.addEventListener("click", check);
  resetBtn.addEventListener("click", () => {
    bankOrder = shuffle([...bankOrder, ...placed.filter((x) => x !== null)]);
    placed = new Array(N).fill(null);
    checked = false;
    awardRow.innerHTML = "";
    render();
  });
  reshuffleBtn.addEventListener("click", newShuffle);

  loadSaved();
  AbssMenu.init({ gameKey: GAME_KEY, gameLabel: "Buddha's Life Timeline" });
})();
