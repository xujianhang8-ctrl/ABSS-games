const AbssState = (() => {
  const PREFIX = "abss_state_";
  const GAME_KEYS = ["quiz", "truefalse", "timeline", "wheel"];

  function save(gameKey, data) {
    localStorage.setItem(PREFIX + gameKey, JSON.stringify(data));
  }

  function load(gameKey) {
    try {
      const raw = localStorage.getItem(PREFIX + gameKey);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function clear(gameKey) {
    localStorage.removeItem(PREFIX + gameKey);
  }

  function clearAllProgress() {
    GAME_KEYS.forEach(clear);
  }

  function exportSave() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("abss_")) {
        data[key] = localStorage.getItem(key);
      }
    }
    return data;
  }

  function importSave(data) {
    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith("abss_")) {
        localStorage.setItem(key, value);
      }
    });
  }

  function downloadSave() {
    const data = exportSave();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `abss-buddhism-games-save-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function loadSaveFromFile(file, onDone) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        importSave(data);
        onDone(true);
      } catch (e) {
        onDone(false);
      }
    };
    reader.onerror = () => onDone(false);
    reader.readAsText(file);
  }

  function wipeEverything() {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith("abss_")) {
        localStorage.removeItem(key);
      }
    }
  }

  return {
    GAME_KEYS,
    save,
    load,
    clear,
    clearAllProgress,
    exportSave,
    importSave,
    downloadSave,
    loadSaveFromFile,
    wipeEverything,
  };
})();
