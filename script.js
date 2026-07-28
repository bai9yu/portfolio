const slides = Array.from(document.querySelectorAll(".award-slide"));
const prevButton = document.querySelector(".carousel-btn.prev");
const nextButton = document.querySelector(".carousel-btn.next");
let activeIndex = 0;
let timerId;

function showSlide(index) {
  if (!slides.length) return;
  activeIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === activeIndex);
  });
}

function queueNext() {
  window.clearInterval(timerId);
  timerId = window.setInterval(() => showSlide(activeIndex + 1), 4200);
}

prevButton?.addEventListener("click", () => {
  showSlide(activeIndex - 1);
  queueNext();
});

nextButton?.addEventListener("click", () => {
  showSlide(activeIndex + 1);
  queueNext();
});

showSlide(0);
queueNext();
