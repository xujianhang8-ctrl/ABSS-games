(() => {
  const PAGES = [
    { key: "home", href: "index.html", label: "首页" },
    { key: "quiz", href: "quiz.html", label: "问答" },
    { key: "truefalse", href: "truefalse.html", label: "是非" },
    { key: "timeline", href: "timeline.html", label: "时间轴" },
    { key: "wheel", href: "wheel.html", label: "转盘" },
    { key: "scoreboard", href: "scoreboard.html", label: "计分板" },
  ];

  const RESET_LABELS = {
    quiz: "重置本局问答进度",
    truefalse: "重置是非题进度",
    timeline: "重置时间轴进度",
    wheel: "重置转盘为默认队伍",
  };

  function build() {
    const mount = document.getElementById("site-nav");
    if (!mount) return;
    const current = document.body.dataset.page || "";
    const resetLabel = RESET_LABELS[current];

    const linksHtml = PAGES.map(
      (p) =>
        `<a href="${p.href}"${p.key === current ? ' class="active"' : ""}>${p.label}</a>`
    ).join("");

    const nav = document.createElement("nav");
    nav.className = "site-nav";
    nav.innerHTML = `
      <div class="site-nav-inner">
        <a class="brand" href="index.html">🪷 佛学课堂游戏中心</a>
        <button class="nav-toggle" id="nav-toggle" aria-label="打开菜单">☰</button>
        <div class="nav-links" id="nav-links">${linksHtml}</div>
        <div class="nav-menu">
          <button class="btn small ghost" id="nav-menu-btn">⋮ 更多</button>
          <div class="nav-menu-dropdown" id="nav-menu-dropdown">
            <button id="nav-export">💾 导出存档（下载文件）</button>
            <button id="nav-import">📂 导入存档（选择文件）</button>
            <input type="file" id="nav-import-input" accept="application/json" hidden />
            ${resetLabel ? `<button id="nav-reset-current">♻️ ${resetLabel}</button>` : ""}
            <button id="nav-reset-all" class="danger">⚠️ 重置全部数据</button>
          </div>
        </div>
      </div>
    `;
    mount.appendChild(nav);

    const toggle = nav.querySelector("#nav-toggle");
    const links = nav.querySelector("#nav-links");
    toggle.addEventListener("click", () => links.classList.toggle("open"));

    const menuBtn = nav.querySelector("#nav-menu-btn");
    const dropdown = nav.querySelector("#nav-menu-dropdown");
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target) && e.target !== menuBtn) {
        dropdown.classList.remove("open");
      }
    });

    nav.querySelector("#nav-export").addEventListener("click", () => {
      AbssSave.exportToFile();
      dropdown.classList.remove("open");
    });

    const importInput = nav.querySelector("#nav-import-input");
    nav.querySelector("#nav-import").addEventListener("click", () => importInput.click());
    importInput.addEventListener("change", () => {
      const file = importInput.files[0];
      if (!file) return;
      AbssSave.importFromFile(file, (err) => {
        if (err) {
          alert("导入失败：文件内容不是有效的存档格式。");
        } else {
          alert("导入成功！页面即将刷新。");
          location.reload();
        }
      });
      importInput.value = "";
    });

    const resetCurrentBtn = nav.querySelector("#nav-reset-current");
    if (resetCurrentBtn) {
      resetCurrentBtn.addEventListener("click", () => {
        if (confirm(`确定要${resetLabel}吗？`)) {
          AbssSave.resetOne(current);
          location.reload();
        }
        dropdown.classList.remove("open");
      });
    }

    nav.querySelector("#nav-reset-all").addEventListener("click", () => {
      if (confirm("确定要清除所有队伍分数和全部游戏进度吗？此操作不可撤销。")) {
        AbssSave.resetAll();
        location.reload();
      }
      dropdown.classList.remove("open");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
