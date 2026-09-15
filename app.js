(() => {
  'use strict';

  const slides = [...document.querySelectorAll('.slide')];
  const stage = document.querySelector('.stage');
  const slideButtons = [...document.querySelectorAll('.slide-nav [data-go]')];
  const previousButton = document.querySelector('.previous');
  const nextButton = document.querySelector('.next');
  const announcer = document.querySelector('#slide-announcer');
  const fullscreenButton = document.querySelector('#fullscreen-button');
  const practiceSlides = [...document.querySelectorAll('.slide.practice')];
  const practiceStates = new Map(practiceSlides.map(slide => [slide, 0]));
  const mobile = window.matchMedia('(max-width: 900px)');
  let currentSlide = 0;
  let transitionTimer;
  let toastTimer;

  function fitStage() {
    stage.style.setProperty('--deck-scale', stage.clientWidth / 1440);
  }

  function readHash() {
    const match = location.hash.match(/^#slide-(\d+)$/);
    if (!match) return 0;
    const index = Number(match[1]) - 1;
    return index >= 0 && index < slides.length ? index : 0;
  }

  function practiceStatus(slide, message) {
    const status = slide.querySelector('.practice-status');
    if (status) status.textContent = message;
  }

  function resetPractice(slide, { announce = false } = {}) {
    practiceStates.set(slide, 0);
    slide.classList.remove('answers-visible', 'meanings-visible');
    slide.querySelectorAll('.answer-value').forEach(answer => { answer.hidden = true; });
    slide.querySelectorAll('.meaning-reveal').forEach(meaning => { meaning.hidden = true; });
    practiceStatus(slide, 'Tekan next untuk menampilkan jawaban.');
    if (announce) announcer.textContent = 'Jawaban dan arti latihan disembunyikan.';
  }

  function revealPracticeAnswers(slide) {
    if (practiceStates.get(slide) !== 0) return;
    practiceStates.set(slide, 1);
    slide.classList.remove('answers-visible');
    slide.querySelectorAll('.answer-value').forEach(answer => { answer.hidden = false; });
    void slide.offsetWidth;
    slide.classList.add('answers-visible');
    practiceStatus(slide, 'Jawaban ditampilkan. Tekan next untuk melihat arti.');
    announcer.textContent = 'Jawaban latihan ditampilkan.';
    syncPracticeControls();
  }

  function revealPracticeMeanings(slide) {
    if (practiceStates.get(slide) !== 1) return;
    practiceStates.set(slide, 2);
    slide.classList.remove('meanings-visible');
    slide.querySelectorAll('.meaning-reveal').forEach(meaning => { meaning.hidden = false; });
    void slide.offsetWidth;
    slide.classList.add('meanings-visible');
    practiceStatus(slide, 'Arti ditampilkan. Tekan next untuk lanjut.');
    announcer.textContent = 'Arti kalimat latihan ditampilkan.';
    syncPracticeControls();
  }

  function hidePracticeStep(slide) {
    const state = practiceStates.get(slide) || 0;
    if (state === 2) {
      practiceStates.set(slide, 1);
      slide.classList.remove('meanings-visible');
      slide.querySelectorAll('.meaning-reveal').forEach(meaning => { meaning.hidden = true; });
      practiceStatus(slide, 'Jawaban ditampilkan. Tekan next untuk melihat arti.');
      announcer.textContent = 'Arti kalimat latihan disembunyikan.';
    } else if (state === 1) {
      resetPractice(slide, { announce: true });
    }
    syncPracticeControls();
  }

  function getCurrentPractice() {
    const slide = slides[currentSlide];
    return slide && slide.classList.contains('practice') ? slide : null;
  }

  function goToSlide(index, { updateHash = true, focus = false, animate = true } = {}) {
    if (!Number.isInteger(index) || index < 0 || index >= slides.length) return;
    const fromSlide = currentSlide;
    const changed = currentSlide !== index;
    const focusIsInSlide = slides.some(slide => slide.contains(document.activeElement));
    if (changed && slides[index].classList.contains('practice') && fromSlide < index) {
      resetPractice(slides[index]);
    }
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
    document.querySelector('.skip-link').href = '#slide-' + (index + 1);
    if (updateHash && location.hash !== '#slide-' + (index + 1)) {
      try { history.replaceState(null, '', '#slide-' + (index + 1)); }
      catch { location.hash = 'slide-' + (index + 1); }
    }
    if (focus || focusIsInSlide) slides[index].focus({ preventScroll: true });
    if (changed && mobile.matches) window.scrollTo({ top: 0, behavior: 'instant' });
    announcer.textContent = 'Slide ' + (index + 1) + ' dari ' + slides.length + ': ' + slides[index].dataset.title;
  }

  function syncPracticeControls() {
    const slide = getCurrentPractice();
    if (!slide) {
      previousButton.setAttribute('aria-label', 'Slide sebelumnya');
      nextButton.setAttribute('aria-label', 'Slide berikutnya');
      nextButton.title = 'Slide berikutnya';
      return;
    }
    const state = practiceStates.get(slide) || 0;
    const previousLabels = ['Slide sebelumnya', 'Sembunyikan jawaban latihan', 'Sembunyikan arti latihan'];
    const nextLabels = ['Tampilkan jawaban latihan', 'Tampilkan arti kalimat', 'Slide berikutnya'];
    previousButton.setAttribute('aria-label', previousLabels[state]);
    nextButton.setAttribute('aria-label', nextLabels[state]);
    nextButton.title = nextLabels[state];
  }

  function advancePresentation() {
    const practice = getCurrentPractice();
    if (practice) {
      const state = practiceStates.get(practice) || 0;
      if (state === 0) {
        revealPracticeAnswers(practice);
        return;
      }
      if (state === 1) {
        revealPracticeMeanings(practice);
        return;
      }
    }
    goToSlide(currentSlide + 1, { focus: true });
  }

  function retreatPresentation() {
    const practice = getCurrentPractice();
    if (practice && (practiceStates.get(practice) || 0) > 0) {
      hidePracticeStep(practice);
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
    fullscreenButton.title = label + ' (F)';
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
      goToSlide(event.key === 'Home' ? 0 : slides.length - 1, { focus: true });
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

  window.addEventListener('beforeprint', () => slides.forEach(slide => { slide.inert = false; }));
  window.addEventListener('afterprint', () => slides.forEach((slide, index) => { slide.inert = index !== currentSlide; }));

  practiceSlides.forEach(slide => resetPractice(slide));
  fitStage();
  goToSlide(readHash(), { animate: false });
})();
