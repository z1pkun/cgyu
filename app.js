const state = { format: "mp4" };

const form = document.getElementById("downloadForm");
const urlInput = document.getElementById("url");
const quality = document.getElementById("quality");
const statusBox = document.getElementById("status");
const downloadButton = document.querySelector(".download");

document.querySelectorAll(".format").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".format").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    state.format = button.dataset.format;
    quality.disabled = state.format === "mp3";
  });
});

document.getElementById("pasteBtn").addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text) urlInput.value = text.trim();
    showStatus("リンクを貼り付けました。", false);
  } catch {
    showStatus("ブラウザのクリップボード権限を利用できません。手動で貼り付けてください。", true);
  }
});

function isYouTubeUrl(value) {
  try {
    const u = new URL(value);
    return ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtube-nocookie.com"].includes(u.hostname);
  } catch {
    return false;
  }
}

function showStatus(message, error) {
  statusBox.textContent = message;
  statusBox.classList.remove("hidden");
  statusBox.style.background = error ? "#fff0f0" : "#f3f3f3";
  statusBox.style.color = error ? "#a00000" : "#333";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const url = urlInput.value.trim();

  if (!isYouTubeUrl(url)) {
    showStatus("有効なYouTube URLを入力してください。", true);
    return;
  }

  downloadButton.disabled = true;
  downloadButton.textContent = "処理中…";

  try {
    const apiUrl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:3000/api/download"
      : "https://your-api-domain.com/api/download";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: url,
        format: state.format,
        quality: state.format === "mp4" ? quality.value : null
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "ダウンロードに失敗しました");
    }

    const data = await response.json();
    showStatus("ダウンロードが完了しました！", false);

    if (data.downloadUrl) {
      const link = document.createElement("a");
      link.href = data.downloadUrl;
      link.download = data.filename || `video.${state.format === "mp4" ? "mp4" : "mp3"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

  } catch (error) {
    showStatus(error.message || "エラーが発生しました", true);
  } finally {
    downloadButton.disabled = false;
    downloadButton.textContent = "ダウンロード";
  }
});
