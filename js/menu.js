const AbssMenu = (() => {
  function init(opts) {
    const { gameKey, gameLabel } = opts || {};

    const btn = document.createElement("button");
    btn.className = "menu-btn";
    btn.title = "菜单";
    btn.textContent = "☰";
    document.body.appendChild(btn);

    const overlay = document.createElement("div");
    overlay.className = "menu-overlay";
    overlay.innerHTML = `
      <div class="menu-panel">
        <h2>${gameLabel ? escapeHtml(gameLabel) : "菜单"}</h2>
        <div class="menu-btn-list">
          <button class="btn ghost" data-action="resume">▶ 继续</button>
          ${gameKey ? '<button class="btn" data-action="restart">🔄 重新开始本游戏</button>' : ""}
          <button class="btn secondary" data-action="hub">🏠 游戏中心</button>
          <button class="btn secondary" data-action="scoreboard">🏆 计分板</button>
          <hr />
          <button class="btn ghost" data-action="export">⬇ 保存到文件</button>
          <button class="btn ghost" data-action="import">⬆ 从文件加载</button>
          <hr />
          <button class="btn" style="background:var(--red-no)" data-action="wipe">🗑 重置全部</button>
        </div>
        <div class="menu-note">进度和队伍分数会自动保存在此浏览器中。</div>
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
          if (confirm("重新开始本游戏？本游戏的进度将被清除。")) {
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
          if (confirm("重置全部——包括所有队伍分数和每个游戏的进度？此操作无法撤销。")) {
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
          alert("存档已加载！页面即将刷新。");
          location.reload();
        } else {
          alert("抱歉，无法读取该存档文件。");
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
