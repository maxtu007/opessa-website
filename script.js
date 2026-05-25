/* ============================================================
   OPESSA — SCRIPT
   ============================================================ */

(function () {

  // ── NAV SCROLL ───────────────────────────────────────────────
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });


  // ── MOBILE MENU ──────────────────────────────────────────────
  const menuBtn    = document.getElementById('menuBtn');
  const menuClose  = document.getElementById('menuClose');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function openMenu() {
    mobileMenu.classList.add('open');
    menuBtn.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    menuBtn.classList.remove('open');
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);
  mobileLinks.forEach(l => l.addEventListener('click', closeMenu));


  // ── FADE-IN SECTIONS ─────────────────────────────────────────
  const fadeSections = document.querySelectorAll('.fade-section');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.07 });

  fadeSections.forEach(el => sectionObserver.observe(el));


  // ── PROCESS VIDEOS: play only when visible ───────────────────
  const processVideos = document.querySelectorAll('.process-video-wrap video');

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.play().catch(() => {});
      } else {
        entry.target.pause();
      }
    });
  }, { threshold: 0.25 });

  processVideos.forEach(v => videoObserver.observe(v));


  // ── SELECT: style when a value is chosen ─────────────────────
  const interestSelect = document.getElementById('interest');
  if (interestSelect) {
    interestSelect.addEventListener('change', () => {
      interestSelect.classList.toggle('has-value', interestSelect.value !== '');
    });
  }


  // ── CONTACT FORM ─────────────────────────────────────────────
  const form      = document.getElementById('contactForm');
  const formNote  = document.getElementById('formNote');
  const submitBtn = form ? form.querySelector('.btn-submit') : null;

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name  = form.querySelector('#name').value.trim();
      const email = form.querySelector('#email').value.trim();

      if (!name || !email) {
        formNote.textContent = 'Please enter your name and email.';
        formNote.style.color = '#cc2b2b';
        return;
      }

      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      formNote.textContent = '';

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      })
        .then(() => {
          submitBtn.textContent = 'Sent';
          formNote.textContent = "Thanks — we'll be in touch shortly.";
          formNote.style.color = '#5a5a5a';
          form.reset();
          if (interestSelect) interestSelect.classList.remove('has-value');
        })
        .catch(() => {
          submitBtn.textContent = 'Send Inquiry';
          submitBtn.disabled = false;
          formNote.textContent = 'Something went wrong. Please try again.';
          formNote.style.color = '#cc2b2b';
        });
    });
  }


  // ── HERO AUDIO TOGGLE ────────────────────────────────────────
  // Video must start muted for autoplay. We show "Audio on" by default
  // and unmute on first user interaction (scroll/click/touch).
  const heroVideo    = document.getElementById('heroVideo');
  const heroAudioBtn = document.getElementById('heroAudioBtn');

  if (heroVideo && heroAudioBtn) {
    const iconMuted  = heroAudioBtn.querySelector('.icon-muted');
    const iconSound  = heroAudioBtn.querySelector('.icon-sound');
    const audioLabel = heroAudioBtn.querySelector('.audio-label');

    // Start button in "Audio on" state
    iconMuted.style.display = 'none';
    iconSound.style.display = '';
    audioLabel.textContent  = 'Audio on';

    let userChoseMuted = false;

    // Unmute on first interaction, unless user already clicked the button to mute
    function onFirstInteraction() {
      if (!userChoseMuted) heroVideo.muted = false;
    }
    document.addEventListener('scroll',     onFirstInteraction, { once: true, passive: true });
    document.addEventListener('click',      onFirstInteraction, { once: true });
    document.addEventListener('touchstart', onFirstInteraction, { once: true, passive: true });

    heroAudioBtn.addEventListener('click', () => {
      heroVideo.muted    = !heroVideo.muted;
      userChoseMuted     = heroVideo.muted;
      if (heroVideo.muted) {
        iconMuted.style.display = '';
        iconSound.style.display = 'none';
        audioLabel.textContent  = 'Tap for audio';
      } else {
        iconMuted.style.display = 'none';
        iconSound.style.display = '';
        audioLabel.textContent  = 'Audio on';
      }
    });

    // Fallback: hide panel if video fails entirely
    heroVideo.addEventListener('error', () => {
      const panel = heroVideo.closest('.hero-video-panel');
      if (panel) panel.style.display = 'none';
    });
  }

  // ── PROCESS VIDEO AUDIO TOGGLES ──────────────────────────────
  document.querySelectorAll('.process-audio-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const video = btn.closest('.process-video-wrap').querySelector('video');
      if (!video) return;
      video.muted = !video.muted;
      btn.querySelector('.icon-muted').style.display = video.muted ? '' : 'none';
      btn.querySelector('.icon-sound').style.display  = video.muted ? 'none' : '';
    });
  });

})();
