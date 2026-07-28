const resumeToggle = document.querySelector("[data-resume-toggle]");
const resumePanel = document.querySelector("[data-resume-panel]");
const resumeClose = document.querySelector("[data-resume-close]");

function setResumePanel(open) {
  if (!resumePanel) return;
  resumePanel.classList.toggle("open", open);
  resumePanel.setAttribute("aria-hidden", String(!open));
  if (resumeToggle) {
    resumeToggle.textContent = open ? "收起科研简历" : "在线查看科研简历";
  }
}

resumeToggle?.addEventListener("click", () => {
  setResumePanel(!resumePanel?.classList.contains("open"));
});

resumeClose?.addEventListener("click", () => setResumePanel(false));

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setResumePanel(false);
});

const slides = Array.from(document.querySelectorAll(".award-slide"));
const prevButton = document.querySelector(".carousel-btn.prev");
const nextButton = document.querySelector(".carousel-btn.next");
const dotsContainer = document.querySelector(".carousel-dots");
let activeSlide = 0;
let slideTimer;

function showSlide(index) {
  if (!slides.length) return;
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === activeSlide);
  });
  dotsContainer?.querySelectorAll("button").forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === activeSlide);
  });
}

function restartSlides() {
  window.clearInterval(slideTimer);
  slideTimer = window.setInterval(() => showSlide(activeSlide + 1), 4500);
}

if (slides.length && dotsContainer) {
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `查看第 ${index + 1} 张奖状`);
    dot.addEventListener("click", () => {
      showSlide(index);
      restartSlides();
    });
    dotsContainer.appendChild(dot);
  });
}

prevButton?.addEventListener("click", () => {
  showSlide(activeSlide - 1);
  restartSlides();
});

nextButton?.addEventListener("click", () => {
  showSlide(activeSlide + 1);
  restartSlides();
});

showSlide(0);
if (slides.length) restartSlides();
