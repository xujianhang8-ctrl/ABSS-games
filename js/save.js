const AbssSave = (() => {
  const KEYS = {
    teams: "abss_teams_v1",
    quiz: "abss_quiz_used_v1",
    truefalse: "abss_truefalse_state_v1",
    timeline: "abss_timeline_state_v1",
    wheel: "abss_wheel_segments_v1",
  };

  function collect() {
    const data = { savedAt: new Date().toISOString() };
    Object.entries(KEYS).forEach(([name, storageKey]) => {
      const raw = localStorage.getItem(storageKey);
      if (raw === null) return;
      try {
        data[name] = JSON.parse(raw);
      } catch (e) {
        data[name] = raw;
      }
    });
    return data;
  }

  function exportToFile() {
    const data = collect();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");
    const a = document.createElement("a");
    a.href = url;
    a.download = `佛学课堂存档-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function importFromFile(file, onDone) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data || typeof data !== "object") throw new Error("invalid save file");
        Object.keys(KEYS).forEach((name) => {
          if (data[name] === undefined) return;
          const storageKey = KEYS[name];
          const value = typeof data[name] === "string" ? data[name] : JSON.stringify(data[name]);
          localStorage.setItem(storageKey, value);
        });
        onDone(null);
      } catch (e) {
        onDone(e);
      }
    };
    reader.onerror = () => onDone(reader.error || new Error("file read error"));
    reader.readAsText(file);
  }

  function resetAll() {
    Object.values(KEYS).forEach((storageKey) => localStorage.removeItem(storageKey));
  }

  function resetOne(name) {
    if (KEYS[name]) localStorage.removeItem(KEYS[name]);
  }

  return { KEYS, collect, exportToFile, importFromFile, resetAll, resetOne };
})();
