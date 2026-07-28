const resumeToggle = document.querySelector("[data-resume-toggle]");
const resumePanel = document.querySelector("[data-resume-panel]");
const resumeClose = document.querySelector("[data-resume-close]");

function setResumePanel(open) {
  if (!resumePanel) return;
  resumePanel.classList.toggle("open", open);
  resumePanel.setAttribute("aria-hidden", String(!open));
  if (resumeToggle) {
    resumeToggle.textContent = open ? "收起科研简历" : "预览科研简历";
  }
}

resumeToggle?.addEventListener("click", () => {
  setResumePanel(!resumePanel?.classList.contains("open"));
});

resumeClose?.addEventListener("click", () => setResumePanel(false));

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setResumePanel(false);
  }
});
