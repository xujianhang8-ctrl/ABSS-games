(() => {
  const canvas = document.getElementById("wheel-canvas");
  const ctx = canvas.getContext("2d");
  const segmentsInput = document.getElementById("segments-input");
  const spinBtn = document.getElementById("spin-btn");
  const resultBanner = document.getElementById("result-banner");
  const loadTeamsBtn = document.getElementById("load-teams-btn");
  const loadBonusBtn = document.getElementById("load-bonus-btn");
  const applyBtn = document.getElementById("apply-btn");

  const BONUS_PRESET = [
    "+5 Bonus Points",
    "+10 Bonus Points",
    "Lose a Turn",
    "Free Pass",
    "+3 Bonus Points",
    "Double Points Next Question",
    "+5 Bonus Points",
    "Nothing — Try Again Next Round",
  ];

  const COLORS = ["#e8912d", "#7a2e2e", "#4caf6b", "#5b8def", "#c9527a", "#8b5fbf", "#f2c14e", "#3a8a8a"];

  let segments = [];
  let rotation = 0; // current rotation in radians
  let spinning = false;

  function getSegmentsFromInput() {
    return segmentsInput.value
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  function drawWheel() {
    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 6;
    ctx.clearRect(0, 0, size, size);
    const n = segments.length;
    if (n === 0) {
      ctx.fillStyle = "#e8c98a";
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#5a4a3c";
      ctx.font = "bold 18px Trebuchet MS";
      ctx.textAlign = "center";
      ctx.fillText("Add some options →", cx, cy);
      return;
    }
    const anglePer = (Math.PI * 2) / n;
    for (let i = 0; i < n; i++) {
      const start = rotation + i * anglePer;
      const end = start + anglePer;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = "#fff8ec";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + anglePer / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff8ec";
      ctx.font = "bold 15px Trebuchet MS";
      const label = segments[i].length > 22 ? segments[i].slice(0, 20) + "…" : segments[i];
      ctx.fillText(label, radius - 14, 5);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, 26, 0, Math.PI * 2);
    ctx.fillStyle = "#fff8ec";
    ctx.fill();
    ctx.strokeStyle = "#7a2e2e";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  function applySegments() {
    segments = getSegmentsFromInput();
    rotation = 0;
    resultBanner.textContent = "";
    drawWheel();
  }

  function spin() {
    if (spinning || segments.length === 0) return;
    spinning = true;
    resultBanner.textContent = "";
    const n = segments.length;
    const anglePer = (Math.PI * 2) / n;
    const extraSpins = 5 + Math.random() * 3;
    const randomOffset = Math.random() * Math.PI * 2;
    const targetRotation = rotation + extraSpins * Math.PI * 2 + randomOffset;
    const duration = 4200;
    const startRotation = rotation;
    const startTime = performance.now();

    function frame(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      rotation = startRotation + (targetRotation - startRotation) * eased;
      drawWheel();
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        spinning = false;
        announceWinner();
      }
    }
    requestAnimationFrame(frame);
  }

  function announceWinner() {
    const n = segments.length;
    const anglePer = (Math.PI * 2) / n;
    // Pointer is at top (angle = -PI/2 in canvas terms, i.e. -90deg).
    const normalized = ((-Math.PI / 2 - rotation) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    const winnerIdx = Math.floor(normalized / anglePer) % n;
    resultBanner.textContent = "🎉 " + segments[winnerIdx] + " 🎉";
  }

  function persistSegments() {
    AbssState.save("wheel", { text: segmentsInput.value });
  }

  loadTeamsBtn.addEventListener("click", () => {
    const teams = AbssScoreboard.getTeams();
    segmentsInput.value = teams.map((t) => t.name).join("\n");
    applySegments();
    persistSegments();
  });
  loadBonusBtn.addEventListener("click", () => {
    segmentsInput.value = BONUS_PRESET.join("\n");
    applySegments();
    persistSegments();
  });
  applyBtn.addEventListener("click", () => {
    applySegments();
    persistSegments();
  });
  spinBtn.addEventListener("click", spin);

  const savedWheel = AbssState.load("wheel");
  if (savedWheel && typeof savedWheel.text === "string" && savedWheel.text.trim().length > 0) {
    segmentsInput.value = savedWheel.text;
  } else {
    const teams = AbssScoreboard.getTeams();
    segmentsInput.value = teams.map((t) => t.name).join("\n");
  }
  applySegments();

  AbssMenu.init({ gameKey: "wheel", gameLabel: "Spin the Wheel" });
})();
