const AbssScoreboard = (() => {
  const STORAGE_KEY = "abss_teams_v1";
  const DEFAULT_TEAMS = [
    { id: "t1", name: "莲花队", score: 0, color: "#e8912d" },
    { id: "t2", name: "菩提队", score: 0, color: "#4caf6b" },
  ];

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(DEFAULT_TEAMS);
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) return structuredClone(DEFAULT_TEAMS);
      return parsed;
    } catch (e) {
      return structuredClone(DEFAULT_TEAMS);
    }
  }

  function save(teams) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
  }

  function getTeams() {
    return load();
  }

  function addPoints(teamId, delta) {
    const teams = load();
    const t = teams.find((x) => x.id === teamId);
    if (t) {
      t.score = Math.max(0, t.score + delta);
      save(teams);
    }
    renderAll();
    return teams;
  }

  function addTeam(name, color) {
    const teams = load();
    const id = "t" + (Date.now() % 100000);
    teams.push({ id, name: name || "新队伍", score: 0, color: color || randomColor() });
    save(teams);
    renderAll();
  }

  function removeTeam(teamId) {
    let teams = load();
    if (teams.length <= 1) return;
    teams = teams.filter((t) => t.id !== teamId);
    save(teams);
    renderAll();
  }

  function renameTeam(teamId, name) {
    const teams = load();
    const t = teams.find((x) => x.id === teamId);
    if (t) t.name = name;
    save(teams);
    renderAll();
  }

  function resetScores() {
    const teams = load();
    teams.forEach((t) => (t.score = 0));
    save(teams);
    renderAll();
  }

  function randomColor() {
    const palette = ["#e8912d", "#4caf6b", "#5b8def", "#c9527a", "#8b5fbf", "#e0b23c"];
    return palette[Math.floor(Math.random() * palette.length)];
  }

  function ensureBar() {
    let bar = document.getElementById("scoreboard-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "scoreboard-bar";
      document.body.appendChild(bar);
    }
    return bar;
  }

  function renderAll() {
    const bar = document.getElementById("scoreboard-bar");
    if (bar) renderBar(bar);
  }

  function renderBar(container) {
    const teams = load();
    container.innerHTML = "";
    teams.forEach((t) => {
      const el = document.createElement("div");
      el.className = "sb-team";
      el.innerHTML = `
        <span class="sb-dot" style="background:${t.color}"></span>
        <span class="sb-name">${escapeHtml(t.name)}</span>
        <button class="sb-adj" data-id="${t.id}" data-delta="-1" title="减一分">−</button>
        <span class="sb-score">${t.score}</span>
        <button class="sb-adj" data-id="${t.id}" data-delta="1" title="加一分">+</button>
      `;
      container.appendChild(el);
    });
    const manageLink = document.createElement("a");
    manageLink.href = "scoreboard.html";
    manageLink.className = "btn small ghost sb-manage";
    manageLink.style.color = "#fff8ec";
    manageLink.style.borderColor = "#fff8ec";
    manageLink.textContent = "管理队伍";
    container.appendChild(manageLink);

    container.querySelectorAll(".sb-adj").forEach((btn) => {
      btn.addEventListener("click", () => {
        addPoints(btn.dataset.id, parseInt(btn.dataset.delta, 10));
      });
    });
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function init() {
    const bar = ensureBar();
    renderBar(bar);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  return { getTeams, addPoints, addTeam, removeTeam, renameTeam, resetScores, renderAll };
})();
