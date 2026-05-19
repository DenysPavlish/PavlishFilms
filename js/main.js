// Функція обробки успішного входу користувача
function updateLoginButton() {
  try {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      const loginBtnText = document.querySelector('.btn-login span');
      if (loginBtnText) {
        loginBtnText.textContent = 'Вхід успішний';
      }
      const loginBtn = document.querySelector('.btn-login');
      if (loginBtn) {
        loginBtn.onclick = null; 
        loginBtn.style.cursor = 'default';
      }
    }
  } catch (e) {
    console.error("Помилка авторизації:", e);
  }
}

// Запускаємо перевірку миттєво при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
  updateLoginButton();
});

// Нова функція для кнопки модалки
function handleLogin() {
  sessionStorage.setItem('isLoggedIn', 'true');
  closeModal('loginModal');
  showToast('Ласкаво просимо! 🎬', 'success');
  updateLoginButton();
}
// ===== МОБІЛЬНЕ МЕНЮ =====
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ===== АКТИВНІ ПОСИЛАННЯ =====
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .sidebar-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}
setActiveNav();

// ===== МОДАЛЬНІ ВІКНА =====
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) { modal.classList.add('active'); document.body.style.overflow = 'hidden'; }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; }
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) { overlay.classList.remove('active'); document.body.style.overflow = ''; }
  });
});

// ===== СПОВІЩЕННЯ =====
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  toast.innerHTML = `<span class="toast-icon">${icons[type] || '✅'}</span><span class="toast-text">${message}</span>`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3200);
}

// ===== ТРЕЙЛЕР =====
function getTrailerPath(btn) {
  if (btn.dataset.trailer) return btn.dataset.trailer;
  const isSubpage = window.location.pathname.includes('/pages/');
  return isSubpage
    ? '../diiavol-nosit-prada-2-oficiinii-ukrayinski_OiMnDcTt.mp4'
    : './diiavol-nosit-prada-2-oficiinii-ukrayinski_OiMnDcTt.mp4';
}

function openTrailer(videoPath) {
  const modal = document.getElementById('trailerModal');
  const video = document.getElementById('trailerFrame');
  if (!modal || !video) return;
  video.src = videoPath;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  video.onloadedmetadata = () => video.play().catch(() => {});
}

function closeTrailer() {
  const modal = document.getElementById('trailerModal');
  const video = document.getElementById('trailerFrame');
  if (video) { video.pause(); video.src = ''; }
  if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
}

// Один глобальний обробник для ВСІХ кнопок трейлера
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-trailer, [data-trailer]');
  if (!btn) return;
  e.preventDefault();
  e.stopPropagation();
  openTrailer(getTrailerPath(btn));
});

// Закриття по кліку на фон
document.addEventListener('click', (e) => {
  const modal = document.getElementById('trailerModal');
  if (e.target === modal) closeTrailer();
});

// ===== ПОШУК ФІЛЬМІВ (живий фільтр) =====
const searchInput = document.querySelector('.nav-search input');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    document.querySelectorAll('.movie-card').forEach(card => {
      const title = card.querySelector('.movie-title')?.textContent.toLowerCase() || '';
      const genre = card.querySelector('.movie-genre')?.textContent.toLowerCase() || '';
      card.style.display = (!query || title.includes(query) || genre.includes(query)) ? '' : 'none';
    });
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const q = searchInput.value.trim();
      const visible = [...document.querySelectorAll('.movie-card')].filter(c => c.style.display !== 'none');
      if (q && visible.length === 0) showToast(`За запитом "${q}" нічого не знайдено`, 'info');
    }
  });
}

// ===== ВКЛАДКИ ДАТ =====
document.querySelectorAll('.date-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.date-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    showToast(`Розклад на ${tab.querySelector('.date-day')?.textContent} ${tab.querySelector('.date-weekday')?.textContent}`, 'info');
  });
});

// ===== ЧАСОВІ СЛОТИ =====
document.querySelectorAll('.time-slot:not(.sold-out)').forEach(slot => {
  slot.addEventListener('click', () => {
    const time = slot.textContent.trim();
    const row = slot.closest('tr');
    const movie = row?.querySelector('.schedule-movie-name')?.textContent || 'Фільм';
    openModal('buyModal');
    const t = document.getElementById('buyMovieTitle');
    const ti = document.getElementById('buyTime');
    if (t) t.textContent = movie;
    if (ti) ti.textContent = time;
  });
});

// ===== КАРТА МІСЦЬ =====
let selectedSeats = [];

function initSeatMap() {
  const seatMap = document.getElementById('seatMap');
  if (!seatMap) return;

  const layout = [
    { row: 'A', seats: 8,  taken: [2, 5],       vip: [] },
    { row: 'B', seats: 10, taken: [1, 4, 7],     vip: [] },
    { row: 'C', seats: 10, taken: [3, 6, 8],     vip: [] },
    { row: 'D', seats: 12, taken: [2, 5, 9, 11], vip: [] },
    { row: 'E', seats: 12, taken: [1, 4],         vip: [5, 6, 7, 8] },
    { row: 'F', seats: 12, taken: [10, 11, 12],   vip: [4, 5, 6, 7, 8, 9] },
    { row: 'G', seats: 14, taken: [6, 7],         vip: [5, 6, 7, 8, 9, 10] },
    { row: 'H', seats: 14, taken: [2, 13],        vip: [4, 5, 6, 7, 8, 9, 10, 11] },
  ];

  seatMap.innerHTML = `
    <div class="screen-label">🎬 Екран</div>
    ${layout.map(row => `
      <div class="seat-row">
        <div class="row-label">${row.row}</div>
        ${Array.from({length: row.seats}, (_, i) => i + 1).map(n => {
          const isTaken = row.taken.includes(n);
          const isVip = row.vip.includes(n);
          return `<div class="seat ${isTaken ? 'taken' : isVip ? 'vip' : 'free'}"
                       data-row="${row.row}" data-seat="${n}"
                       title="${row.row}${n}${isVip ? ' (VIP)' : ''}"></div>`;
        }).join('')}
        <div class="row-label"></div>
      </div>
    `).join('')}
    <div class="seat-legend">
      <div class="legend-item"><div class="legend-dot" style="background:var(--bg-card);border-color:#444"></div> Вільне</div>
      <div class="legend-item"><div class="legend-dot" style="background:var(--accent);border-color:var(--accent)"></div> Обране</div>
      <div class="legend-item"><div class="legend-dot" style="background:rgba(245,197,24,0.15);border-color:#f5c518"></div> VIP</div>
      <div class="legend-item"><div class="legend-dot" style="background:#333;border-color:#333"></div> Зайняте</div>
    </div>`;

  seatMap.querySelectorAll('.seat:not(.taken)').forEach(seat => {
    seat.addEventListener('click', () => {
      const id = `${seat.dataset.row}${seat.dataset.seat}`;
      if (seat.classList.contains('selected')) {
        seat.classList.remove('selected');
        selectedSeats = selectedSeats.filter(s => s !== id);
      } else {
        if (selectedSeats.length >= 6) { showToast('Максимум 6 місць за одне замовлення', 'warning'); return; }
        seat.classList.add('selected');
        selectedSeats.push(id);
      }
      updateSeatInfo();
    });
  });
}

function updateSeatInfo() {
  const info = document.getElementById('selectedSeatsInfo');
  const totalEl = document.getElementById('totalPrice');
  if (!info) return;
  if (selectedSeats.length === 0) {
    info.textContent = 'Оберіть місця';
    if (totalEl) totalEl.textContent = '0 грн';
    return;
  }
  info.textContent = `Обрано: ${selectedSeats.join(', ')}`;
  const vipSeats = selectedSeats.filter(s =>
    ['E','F','G','H'].some(r => s.startsWith(r)) &&
    parseInt(s.slice(1)) >= 4 && parseInt(s.slice(1)) <= 11
  ).length;
  const total = (selectedSeats.length - vipSeats) * 120 + vipSeats * 180;
  if (totalEl) totalEl.textContent = `${total} грн`;
}

initSeatMap();

// ===== ВКЛАДКИ МОДАЛКИ =====
document.querySelectorAll('.modal-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    tab.closest('.modal-tabs').querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});


// ===== ПЕРЕВІРКА СТАНУ ПРИ ЗАВАНТАЖЕННІ СТОРІНКИ =====
// Цей код спрацює автоматично на кожній сторінці, де підключено цей скрипт
document.addEventListener('DOMContentLoaded', () => {
  updateLoginButton();
});

// ===== ФОРМИ =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Повідомлення успішно надіслано!', 'success');
    contactForm.reset();
  });
}

const buyForm = document.getElementById('buyForm');
if (buyForm) {
  buyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (selectedSeats.length === 0) { showToast('Будь ласка, оберіть місця', 'error'); return; }
    closeModal('buyModal');
    showToast(`🎬 Квитки заброньовано! Місця: ${selectedSeats.join(', ')}`, 'success');
    document.querySelectorAll('.seat.selected').forEach(s => s.classList.remove('selected'));
    selectedSeats = [];
    updateSeatInfo();
  });
}

// ===== SCROLL АНІМАЦІЇ =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('animate-in'); });
}, { threshold: 0.1 });

document.querySelectorAll('.movie-card, .promo-card, .info-card, .hall-card').forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});

const style = document.createElement('style');
style.textContent = '.animate-in { opacity: 1 !important; animation: fadeIn 0.5s ease forwards; }';
document.head.appendChild(style);

// ===== ЗВОРОТНІЙ ВІДЛІК =====
function updateCountdowns() {
  document.querySelectorAll('[data-deadline]').forEach(el => {
    const diff = new Date(el.dataset.deadline) - new Date();
    if (diff <= 0) { el.textContent = 'Акція завершена'; return; }
    el.textContent = `До кінця акції: ${Math.floor(diff / 86400000)}д ${Math.floor((diff % 86400000) / 3600000)}год`;
  });
}
updateCountdowns();
setInterval(updateCountdowns, 60000);

console.log('🎬 PavlishFilms — Сайт успішно завантажено!');