(() => {
  const slideFiles = Array.from({length:10}, (_, i) => `assets/slide-${String(i+1).padStart(2,'0')}.jpg`);
  const slideTitles = ['Sampul & pembuka','Jika HIMAKSI tiada','Jejak sejarah','Mereka juga memulai','Yang kita bangun','Nilai atau kebiasaan?','Tiga tahun ke depan','Surat untuk masa depan','Saya masih berproses','Bagian cerita kita'];
  const viewer = document.getElementById('viewer');
  const viewerImage = document.getElementById('viewerImage');
  const viewerCounter = document.getElementById('viewerCounter');
  const viewerTitle = document.getElementById('viewerTitle');
  const viewerProgress = document.getElementById('viewerProgress');
  const viewerDots = document.getElementById('viewerDots');
  let current = 0;
  let previousFocus = null;

  slideTitles.forEach((title, i) => {
    const dot = document.createElement('button');
    dot.type = 'button'; dot.setAttribute('aria-label', `Buka slide ${i+1}: ${title}`);
    dot.addEventListener('click', () => showSlide(i));
    viewerDots.appendChild(dot);
  });
  const dots = [...viewerDots.querySelectorAll('button')];

  function showSlide(index) {
    current = Math.max(0, Math.min(9, index));
    viewerImage.src = slideFiles[current];
    viewerImage.alt = `Slide ${current+1}: ${slideTitles[current]}`;
    viewerCounter.textContent = `${String(current+1).padStart(2,'0')} / 10`;
    viewerTitle.textContent = slideTitles[current];
    viewerProgress.style.width = `${(current+1)*10}%`;
    dots.forEach((dot, i) => dot.classList.toggle('selected', i === current));
    document.getElementById('viewerPrev').disabled = current === 0;
    document.getElementById('viewerNext').disabled = current === 9;
  }
  function openViewer(index=0) {
    previousFocus = document.activeElement;
    viewer.classList.add('open'); viewer.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden'; showSlide(index);
    document.getElementById('closeViewer').focus();
  }
  function closeViewer() {
    viewer.classList.remove('open'); viewer.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    if (previousFocus && previousFocus.focus) previousFocus.focus();
  }
  document.querySelectorAll('[data-slide]').forEach(el => el.addEventListener('click', () => openViewer(Number(el.dataset.slide)-1)));
  ['startBtn','presentationBtn','closingPresentation'].forEach(id => document.getElementById(id).addEventListener('click', () => openViewer(0)));
  document.getElementById('exploreBtn').addEventListener('click', () => document.getElementById('journey').scrollIntoView({behavior:'smooth'}));
  document.getElementById('closeViewer').addEventListener('click', closeViewer);
  document.getElementById('viewerPrev').addEventListener('click', () => showSlide(current-1));
  document.getElementById('viewerNext').addEventListener('click', () => showSlide(current+1));
  document.addEventListener('keydown', e => {
    if (!viewer.classList.contains('open')) return;
    if (e.key === 'Escape') closeViewer();
    if (e.key === 'ArrowRight' || e.key === 'PageDown') showSlide(current+1);
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') showSlide(current-1);
    if (e.key === 'Home') showSlide(0);
    if (e.key === 'End') showSlide(9);
  });
  let touchX = null;
  viewer.addEventListener('touchstart', e => { touchX = e.changedTouches[0].screenX; }, {passive:true});
  viewer.addEventListener('touchend', e => {
    if (touchX === null) return;
    const delta = e.changedTouches[0].screenX - touchX;
    if (Math.abs(delta) > 55) showSlide(current + (delta < 0 ? 1 : -1));
    touchX = null;
  }, {passive:true});
  const menuBtn = document.getElementById('menuBtn');
  menuBtn.addEventListener('click', () => {
    const nav = document.querySelector('.main-nav');
    nav.classList.toggle('show');
    menuBtn.setAttribute('aria-expanded', nav.classList.contains('show') ? 'true' : 'false');
  });
  document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => document.querySelector('.main-nav').classList.remove('show')));
  const sections = [...document.querySelectorAll('main section[id]')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll('.nav-link').forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    }), {rootMargin:'-30% 0px -60% 0px'});
    sections.forEach(section => observer.observe(section));
  }
})();