const AbssMenu = (() => {
  function init(opts) {
    const { gameKey, gameLabel } = opts || {};

    const btn = document.createElement("button");
    btn.className = "menu-btn";
    btn.title = "Menu";
    btn.textContent = "☰";
    document.body.appendChild(btn);

    const overlay = document.createElement("div");
    overlay.className = "menu-overlay";
    overlay.innerHTML = `
      <div class="menu-panel">
        <h2>${gameLabel ? escapeHtml(gameLabel) : "Menu"}</h2>
        <div class="menu-btn-list">
          <button class="btn ghost" data-action="resume">▶ Resume</button>
          ${gameKey ? '<button class="btn" data-action="restart">🔄 Restart This Game</button>' : ""}
          <button class="btn secondary" data-action="hub">🏠 Game Hub</button>
          <button class="btn secondary" data-action="scoreboard">🏆 Scoreboard</button>
          <hr />
          <button class="btn ghost" data-action="export">⬇ Save to File</button>
          <button class="btn ghost" data-action="import">⬆ Load From File</button>
          <hr />
          <button class="btn" style="background:var(--red-no)" data-action="wipe">🗑 Reset Everything</button>
        </div>
        <div class="menu-note">Progress and team scores are saved automatically in this browser.</div>
        <input type="file" id="menu-import-input" accept="application/json" style="display:none" />
      </div>
    `;
    document.body.appendChild(overlay);

    const fileInput = overlay.querySelector("#menu-import-input");

    function open() {
      overlay.classList.add("open");
    }
    function close() {
      overlay.classList.remove("open");
    }

    btn.addEventListener("click", open);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });

    overlay.querySelectorAll("button[data-action]").forEach((b) => {
      b.addEventListener("click", () => {
        const action = b.dataset.action;
        if (action === "resume") {
          close();
        } else if (action === "restart") {
          if (confirm("Restart this game? Your progress on this game will be cleared.")) {
            AbssState.clear(gameKey);
            location.reload();
          }
        } else if (action === "hub") {
          location.href = "index.html";
        } else if (action === "scoreboard") {
          location.href = "scoreboard.html";
        } else if (action === "export") {
          AbssState.downloadSave();
        } else if (action === "import") {
          fileInput.click();
        } else if (action === "wipe") {
          if (confirm("Reset EVERYTHING — all team scores and progress in every game? This cannot be undone.")) {
            AbssState.wipeEverything();
            location.href = "index.html";
          }
        }
      });
    });

    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (!file) return;
      AbssState.loadSaveFromFile(file, (success) => {
        if (success) {
          alert("Save loaded! The page will now reload.");
          location.reload();
        } else {
          alert("Sorry, that file could not be read as a save file.");
        }
        fileInput.value = "";
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  return { init };
})();
