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

    // MP3では動画品質は意味がないため表示上は選択可能なままにします。
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

  // 静的サイト単体では動画の取得・変換を実行できないため、
  // 本番ではここを自分の許可済みバックエンドのAPI呼び出しに置き換えます。
  showStatus(
    `${state.format.toUpperCase()} / ${state.format === "mp4" ? quality.value + "p" : "音声"} を選択しました。` +
    " 現在は静的フロントエンドのみです。READMEのAPI接続手順に従ってバックエンドを接続してください。",
    false
  );

  setTimeout(() => {
    downloadButton.disabled = false;
    downloadButton.textContent = "ダウンロード";
  }, 900);
});
