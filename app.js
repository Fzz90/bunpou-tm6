(() => {
  'use strict';

  const slides = [...document.querySelectorAll('.slide')];
  const stage = document.querySelector('.stage');
  const slideButtons = [...document.querySelectorAll('.slide-nav [data-go]')];
  const previousButton = document.querySelector('.previous');
  const nextButton = document.querySelector('.next');
  const announcer = document.querySelector('#slide-announcer');
  const fullscreenButton = document.querySelector('#fullscreen-button');
  const practiceSlide = document.querySelector('#slide-5');
  const practiceAnswers = [...practiceSlide.querySelectorAll('.answer-value')];
  const practiceStatus = document.querySelector('#practice-status');
  const mobile = window.matchMedia('(max-width: 900px)');
  let currentSlide = 0;
  let practiceAnswersShown = false;
  let transitionTimer;
  let toastTimer;

  function fitStage() {
    stage.style.setProperty('--deck-scale', stage.clientWidth / 1440);
  }

  function readHash() {
    const match = location.hash.match(/^#slide-([1-6])$/);
    return match ? Number(match[1]) - 1 : 0;
  }

  function goToSlide(index, { updateHash = true, focus = false, animate = true } = {}) {
    if (!Number.isInteger(index) || index < 0 || index >= slides.length) return;
    const fromSlide = currentSlide;
    const changed = currentSlide !== index;
    const focusIsInSlide = slides.some(slide => slide.contains(document.activeElement));
    if (index === 4 && fromSlide < 4) hidePracticeAnswers({ announce: false });
    currentSlide = index;
    clearTimeout(transitionTimer);
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.hidden = !active;
      slide.inert = !active;
      slide.classList.toggle('active', active);
      slide.classList.remove('entering');
    });
    if (changed && animate) {
      slides[index].classList.add('entering');
      transitionTimer = setTimeout(() => slides[index].classList.remove('entering'), 450);
    }
    slideButtons.forEach((button, i) => {
      button.classList.toggle('current', i === index);
      if (i === index) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    previousButton.disabled = index === 0;
    nextButton.disabled = index === slides.length - 1;
    syncPracticeControls();
    document.querySelector('.skip-link').href = `#slide-${index + 1}`;
    if (updateHash && location.hash !== `#slide-${index + 1}`) {
      // Fragment assignment also works when opened directly through file://.
      // Replace the current entry so browser Back does not visit every slide.
      try { history.replaceState(null, '', `#slide-${index + 1}`); }
      catch { location.hash = `slide-${index + 1}`; }
    }
    if (focus || focusIsInSlide) slides[index].focus({ preventScroll: true });
    if (changed && mobile.matches) window.scrollTo({ top: 0, behavior: 'instant' });
    announcer.textContent = `Slide ${index + 1} dari 6: ${slides[index].dataset.title}`;
  }

  function syncPracticeControls() {
    previousButton.setAttribute('aria-label', currentSlide === 4 && practiceAnswersShown ? 'Sembunyikan jawaban latihan' : 'Slide sebelumnya');
    nextButton.setAttribute('aria-label', currentSlide === 4 && !practiceAnswersShown ? 'Tampilkan jawaban latihan' : 'Slide berikutnya');
    nextButton.title = currentSlide === 4 && !practiceAnswersShown ? 'Tampilkan jawaban' : 'Slide berikutnya';
  }

  function revealPracticeAnswers() {
    if (practiceAnswersShown) return;
    practiceAnswersShown = true;
    practiceSlide.classList.remove('answers-visible');
    practiceAnswers.forEach(answer => { answer.hidden = false; });
    void practiceSlide.offsetWidth;
    practiceSlide.classList.add('answers-visible');
    practiceStatus.textContent = 'Jawaban muncul berurutan. Next sekali lagi untuk lanjut.';
    announcer.textContent = 'Jawaban latihan ditampilkan.';
    syncPracticeControls();
  }

  function hidePracticeAnswers({ announce = true } = {}) {
    practiceAnswersShown = false;
    practiceSlide.classList.remove('answers-visible');
    practiceAnswers.forEach(answer => { answer.hidden = true; });
    practiceStatus.textContent = 'Tekan next untuk menampilkan jawaban.';
    if (announce) announcer.textContent = 'Jawaban latihan disembunyikan.';
    syncPracticeControls();
  }

  function advancePresentation() {
    if (currentSlide === 4 && !practiceAnswersShown) {
      revealPracticeAnswers();
      return;
    }
    goToSlide(currentSlide + 1, { focus: true });
  }

  function retreatPresentation() {
    if (currentSlide === 4 && practiceAnswersShown) {
      hidePracticeAnswers();
      return;
    }
    goToSlide(currentSlide - 1, { focus: true });
  }

  document.querySelectorAll('[data-go]').forEach(button => {
    button.addEventListener('click', () => goToSlide(Number(button.dataset.go), { focus: true }));
  });
  document.querySelector('.brand').addEventListener('click', event => {
    event.preventDefault();
    goToSlide(0, { focus: true });
  });
  previousButton.addEventListener('click', retreatPresentation);
  nextButton.addEventListener('click', advancePresentation);
  window.addEventListener('hashchange', () => goToSlide(readHash(), { updateHash: false }));
  new ResizeObserver(fitStage).observe(stage);

  function toast(message) {
    const element = document.querySelector('#toast');
    clearTimeout(toastTimer);
    element.textContent = message;
    element.hidden = false;
    toastTimer = setTimeout(() => { element.hidden = true; }, 4000);
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else toast('Browser ini belum mendukung layar penuh. Gunakan mode lanskap untuk ruang lebih luas.');
    } catch {
      toast('Layar penuh tidak tersedia di jendela ini. Buka di browser untuk memakai fitur ini.');
    }
  }

  fullscreenButton.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', () => {
    const label = document.fullscreenElement ? 'Keluar layar penuh' : 'Masuk layar penuh';
    fullscreenButton.setAttribute('aria-label', label);
    fullscreenButton.title = `${label} (F)`;
    fitStage();
  });
  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    if (target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(event.key)) {
      event.preventDefault();
      advancePresentation();
    } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) {
      event.preventDefault();
      retreatPresentation();
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      goToSlide(event.key === 'Home' ? 0 : 5, { focus: true });
    } else if (event.key.toLowerCase() === 'f') {
      event.preventDefault();
      toggleFullscreen();
    } else if (event.key === ' ' && !target.closest('button, a, summary')) {
      event.preventDefault();
      if (event.shiftKey) retreatPresentation();
      else advancePresentation();
    }
  });

  let touchStart = null;
  stage.addEventListener('touchstart', event => {
    if (event.touches.length !== 1 || event.target.closest('button, input, textarea, a')) {
      touchStart = null;
      return;
    }
    touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  stage.addEventListener('touchend', event => {
    if (!touchStart || event.changedTouches.length !== 1) return;
    const deltaX = event.changedTouches[0].clientX - touchStart.x;
    const deltaY = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(deltaX) > 75 && Math.abs(deltaX) > Math.abs(deltaY) * 1.8) {
      if (deltaX < 0) advancePresentation();
      else retreatPresentation();
    }
    touchStart = null;
  }, { passive: true });
  stage.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });

  // Print must expose hidden slides to the browser's accessibility/print tree.
  // Visual print layout and restoration remain separate from current slide state.
  window.addEventListener('beforeprint', () => slides.forEach(slide => { slide.inert = false; }));
  window.addEventListener('afterprint', () => slides.forEach((slide, index) => { slide.inert = index !== currentSlide; }));

  hidePracticeAnswers({ announce: false });
  fitStage();
  goToSlide(readHash(), { animate: false });
})();
