/* SKM POPUP */
(() => {
  const POPUP_DELAY = 15 * 1000;
  const POPUP_DURATION = 30 * 1000;
  const REMINDER_INTERVAL = 24 * 60 * 60 * 1000;
  const SKM_URL = "https://skm.go.id/share/instansi/09844566-8b51-40be-95c9-85912bffd732/2";
  const STORAGE_KEY = "skm_popup_last_clicked";

  let showTimer = null, closeTimer = null, countdownTimer = null;

  function sudahKlikDalam24Jam() {
    const lastClicked = Number(localStorage.getItem(STORAGE_KEY));
    return !!lastClicked && !Number.isNaN(lastClicked) &&
      Date.now() - lastClicked < REMINDER_INTERVAL;
  }

  function buatPopup() {
    if (document.getElementById("skm-popup")) return;
    const popup = document.createElement("div");
    popup.id = "skm-popup";
    popup.className = "skm-popup";
    popup.setAttribute("role","dialog");
    popup.setAttribute("aria-modal","true");
    popup.setAttribute("aria-labelledby","skm-popup-title");
    popup.innerHTML = `
      <div class="skm-popup-card">
        <button type="button" class="skm-popup-close" id="skm-popup-close" aria-label="Tutup">&times;</button>
        <div class="skm-popup-icon" aria-hidden="true">📋</div>
        <h2 class="skm-popup-title" id="skm-popup-title">Bantu Kami Meningkatkan Kualitas Layanan</h2>
        <p class="skm-popup-text">Mohon kesediaan Anda untuk mengisi Survei Kepuasan Masyarakat (SKM) sebagai bahan evaluasi dan peningkatan kualitas layanan Direktorat Teknologi dan Digitalisasi Pembelajaran.</p>
        <a href="${SKM_URL}" target="_blank" rel="noopener noreferrer" class="skm-popup-button" id="skm-popup-button">Isi Survei SKM</a>
        <div class="skm-popup-timer" id="skm-popup-timer">Popup akan tertutup otomatis dalam 30 detik.</div>
      </div>`;
    document.body.appendChild(popup);
    document.getElementById("skm-popup-close").addEventListener("click", tutupPopup);
    document.getElementById("skm-popup-button").addEventListener("click", () => {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
      tutupPopup();
    });
  }

  function tampilkanPopup() {
    if (sudahKlikDalam24Jam()) return;
    buatPopup();
    const popup = document.getElementById("skm-popup");
    const timerText = document.getElementById("skm-popup-timer");
    popup.classList.add("show");
    let sisa = 30;
    countdownTimer = setInterval(() => {
      sisa -= 1;
      if (sisa <= 0) { clearInterval(countdownTimer); countdownTimer = null; return; }
      timerText.textContent = `Popup akan tertutup otomatis dalam ${sisa} detik.`;
    }, 1000);
    closeTimer = setTimeout(tutupPopup, POPUP_DURATION);
  }

  function tutupPopup() {
    const popup = document.getElementById("skm-popup");
    if (showTimer) { clearTimeout(showTimer); showTimer = null; }
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
    if (popup) {
      popup.classList.remove("show");
      setTimeout(() => popup.remove(), 250);
    }
  }

  function mulai() {
    if (sudahKlikDalam24Jam()) return;
    showTimer = setTimeout(tampilkanPopup, POPUP_DELAY);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mulai);
  else mulai();
})();
