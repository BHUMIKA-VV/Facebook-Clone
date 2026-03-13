/* =============================================
   FACEBOOK CLONE — app.js
   =============================================
   Features:
   - Login with validation (demo credentials)
   - Sign Up modal with form fields
   - Home feed with sample posts
   - Like / Comment / Share interactions
   - Create post modal
   - Logout functionality
   - Toast notifications
   - Password show/hide toggle
   - Persistent session via sessionStorage
   ============================================= */

// ── DEMO DATA ──────────────────────────────────────────────────────────────
const DEMO_USERS = [
  { email: 'demo@facebook.com', password: 'demo1234', name: 'Demo User', initial: 'D' },
  { email: 'john@example.com',  password: 'password', name: 'John Doe',  initial: 'J' },
];

const AVATAR_COLORS = ['#1877f2','#42b72a','#f5533d','#f7b928','#9c5aff','#00bcd4','#ff6b6b','#4ecdc4'];

const SAMPLE_POSTS = [
  {
    id: 1,
    author: 'Sarah Johnson',
    initial: 'S',
    color: '#f5533d',
    time: '2 hours ago',
    text: '🌅 Beautiful morning! Nothing better than coffee and a sunrise. Grateful for another day. ☕️✨',
    image: null,
    emoji: null,
    likes: 47,
    comments: 12,
    shares: 3,
    liked: false,
    reactions: ['👍','❤️','😮'],
  },
  {
    id: 2,
    author: 'Tech Enthusiasts Group',
    initial: 'T',
    color: '#9c5aff',
    time: '4 hours ago',
    text: 'Big news in AI this week! What are your thoughts on how these developments will shape the future of work? Drop your thoughts below 👇',
    image: null,
    emoji: '🤖',
    likes: 134,
    comments: 89,
    shares: 41,
    liked: false,
    reactions: ['👍','😮','❤️'],
  },
  {
    id: 3,
    author: 'Mike Chen',
    initial: 'M',
    color: '#42b72a',
    time: 'Yesterday at 6:30 PM',
    text: 'Just finished the half marathon! 🏃‍♂️ 13.1 miles in 1:58:22 — a new personal best! All those early mornings were absolutely worth it. Thank you to everyone who cheered me on!',
    image: null,
    emoji: '🏅',
    likes: 218,
    comments: 34,
    shares: 8,
    liked: false,
    reactions: ['❤️','👍','🎉'],
  },
  {
    id: 4,
    author: 'Emma Wilson',
    initial: 'E',
    color: '#f7b928',
    time: 'Yesterday at 2:15 PM',
    text: 'Home-cooked pasta from scratch for the first time — it turned out incredible! 🍝 The fresh noodles made all the difference.',
    image: null,
    emoji: '🍝',
    likes: 93,
    comments: 22,
    shares: 5,
    liked: false,
    reactions: ['😍','👍','😮'],
  },
];

const CONTACTS = [
  { name: 'Alice Brown',    initial: 'A', color: '#f5533d', online: true  },
  { name: 'Bob Martinez',   initial: 'B', color: '#9c5aff', online: true  },
  { name: 'Carol White',    initial: 'C', color: '#42b72a', online: true  },
  { name: 'David Lee',      initial: 'D', color: '#f7b928', online: false },
  { name: 'Eva Rodriguez',  initial: 'E', color: '#00bcd4', online: true  },
  { name: 'Frank Hughes',   initial: 'F', color: '#ff6b6b', online: false },
];

// ── STATE ──────────────────────────────────────────────────────────────────
let currentUser = null;
let posts = [...SAMPLE_POSTS];

// ── DOM REFERENCES ─────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

const loginPage    = $('loginPage');
const homeFeed     = $('homeFeed');
const navbar       = $('navbar');
const siteFooter   = $('siteFooter');
const loginForm    = $('loginForm');
const emailInput   = $('emailInput');
const passwordInput= $('passwordInput');
const emailError   = $('emailError');
const passwordError= $('passwordError');
const loginSpinner = $('loginSpinner');
const signupModal  = $('signupModal');
const signupForm   = $('signupForm');
const postModal    = $('postModal');
const postsContainer = $('postsContainer');
const contactList  = $('contactList');
const toast        = $('toast');

// ── VALIDATION ─────────────────────────────────────────────────────────────
function validateEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || /^\+?[\d\s\-()]{7,}$/.test(val);
}

function clearErrors() {
  emailError.textContent = '';
  passwordError.textContent = '';
  emailInput.classList.remove('error-field');
  passwordInput.classList.remove('error-field');
}

// ── TOAST ──────────────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg, duration = 3000) {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.remove('hidden');
  toastTimer = setTimeout(() => toast.classList.add('hidden'), duration);
}

// ── LOGIN FLOW ─────────────────────────────────────────────────────────────
loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  clearErrors();

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  let valid = true;

  if (!email) {
    emailError.textContent = 'Please enter your email or phone number.';
    emailInput.classList.add('error-field');
    valid = false;
  } else if (!validateEmail(email) && !/^\d+$/.test(email.replace(/[\s\-()]/g, ''))) {
    emailError.textContent = 'Please enter a valid email address or phone number.';
    emailInput.classList.add('error-field');
    valid = false;
  }

  if (!password) {
    passwordError.textContent = 'Please enter your password.';
    passwordInput.classList.add('error-field');
    valid = false;
  } else if (password.length < 6) {
    passwordError.textContent = 'Password must be at least 6 characters.';
    passwordInput.classList.add('error-field');
    valid = false;
  }

  if (!valid) return;

  // Show spinner
  $('loginBtn').querySelector('.btn-text').classList.add('hidden');
  loginSpinner.classList.remove('hidden');
  $('loginBtn').disabled = true;

  // Simulate network delay
  await delay(900);

  // Check credentials
  const found = DEMO_USERS.find(u =>
    u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  $('loginBtn').querySelector('.btn-text').classList.remove('hidden');
  loginSpinner.classList.add('hidden');
  $('loginBtn').disabled = false;

  if (found) {
    loginSuccess(found);
  } else {
    // Accept any valid-format login for demo purposes
    const demoUser = {
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      initial: email[0].toUpperCase(),
      email,
    };
    loginSuccess(demoUser);
  }
});

function loginSuccess(user) {
  currentUser = user;
  sessionStorage.setItem('fbUser', JSON.stringify(user));
  renderFeed();
  loginPage.classList.add('hidden');
  homeFeed.classList.remove('hidden');
  navbar.classList.remove('hidden');
  siteFooter.style.display = 'none';
  showToast(`Welcome back, ${user.name.split(' ')[0]}! 👋`);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── PASSWORD TOGGLE ────────────────────────────────────────────────────────
$('togglePw').addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  $('togglePw').textContent = isPassword ? 'Hide' : 'Show';
});

// ── SIGNUP MODAL ───────────────────────────────────────────────────────────
$('openSignup').addEventListener('click', () => {
  signupModal.classList.remove('hidden');
  populateDOB();
});
$('closeSignup').addEventListener('click', () => signupModal.classList.add('hidden'));
signupModal.addEventListener('click', e => { if (e.target === signupModal) signupModal.classList.add('hidden'); });

function populateDOB() {
  const daySelect = $('dobDay');
  const yearSelect = $('dobYear');
  if (daySelect.options.length > 1) return;
  for (let d = 1; d <= 31; d++) {
    daySelect.add(new Option(d, d));
  }
  const thisYear = new Date().getFullYear();
  for (let y = thisYear; y >= 1905; y--) {
    yearSelect.add(new Option(y, y));
  }
}

signupForm.addEventListener('submit', e => {
  e.preventDefault();
  const fname = $('firstName').value.trim();
  const email = $('signupEmail').value.trim();
  const pwd   = $('signupPassword').value;

  if (!fname) { showToast('Please enter your first name.'); return; }
  if (!email) { showToast('Please enter your email or phone number.'); return; }
  if (pwd.length < 6) { showToast('Password must be at least 6 characters.'); return; }

  const newUser = {
    name: `${fname} ${$('lastName').value.trim()}`.trim(),
    initial: fname[0].toUpperCase(),
    email,
  };
  signupModal.classList.add('hidden');
  loginSuccess(newUser);
});

// ── LOGOUT ─────────────────────────────────────────────────────────────────
$('logoutBtn').addEventListener('click', () => {
  currentUser = null;
  sessionStorage.removeItem('fbUser');
  homeFeed.classList.add('hidden');
  navbar.classList.add('hidden');
  loginPage.classList.remove('hidden');
  siteFooter.style.display = '';
  emailInput.value = '';
  passwordInput.value = '';
  clearErrors();
  showToast('You have been logged out.');
});

// ── RENDER FEED ─────────────────────────────────────────────────────────────
function renderFeed() {
  if (!currentUser) return;

  // Update user UI
  const initial = currentUser.initial || currentUser.name[0].toUpperCase();
  $('navUserInitial').textContent = initial;
  $('sidebarAvatar').textContent = initial;
  $('sidebarName').textContent = currentUser.name;
  $('createAvatar').textContent = initial;
  $('postModalAvatar').textContent = initial;
  $('postModalName').textContent = currentUser.name;

  renderPosts();
  renderContacts();
}

function renderPosts() {
  postsContainer.innerHTML = '';
  posts.forEach(post => {
    postsContainer.appendChild(createPostEl(post));
  });
}

function createPostEl(post) {
  const card = document.createElement('div');
  card.className = 'card post-card';
  card.dataset.id = post.id;

  card.innerHTML = `
    <div class="post-header">
      <div class="post-avatar" style="background:${post.color}">${post.initial}</div>
      <div class="post-meta">
        <div class="post-author">${escHtml(post.author)}</div>
        <div class="post-time">${escHtml(post.time)} · 🌍</div>
      </div>
      <button class="post-menu" title="More options">···</button>
    </div>
    <div class="post-text">${escHtml(post.text)}</div>
    ${post.emoji ? `<div class="post-image-placeholder">${post.emoji}</div>` : ''}
    <div class="post-stats">
      <span class="post-reactions">
        ${post.reactions.map(r => `<span class="reaction-emoji">${r}</span>`).join('')}
        <span style="margin-left:4px">${post.likes}</span>
      </span>
      <span>${post.comments} comments · ${post.shares} shares</span>
    </div>
    <div class="post-actions">
      <button class="post-action-btn like-btn ${post.liked ? 'liked' : ''}" data-id="${post.id}">
        ${post.liked ? '👍' : '👍'} <span>${post.liked ? 'Like' : 'Like'}</span>
      </button>
      <button class="post-action-btn comment-btn" data-id="${post.id}">
        💬 <span>Comment</span>
      </button>
      <button class="post-action-btn share-btn" data-id="${post.id}">
        ↗️ <span>Share</span>
      </button>
    </div>
  `;

  // Like
  card.querySelector('.like-btn').addEventListener('click', () => {
    const p = posts.find(x => x.id === post.id);
    p.liked = !p.liked;
    p.likes += p.liked ? 1 : -1;
    renderPosts();
    if (p.liked) showToast('You liked this post 👍');
  });

  // Comment
  card.querySelector('.comment-btn').addEventListener('click', () => {
    showToast('Comments coming soon 💬');
  });

  // Share
  card.querySelector('.share-btn').addEventListener('click', () => {
    showToast('Post shared! ↗️');
    const p = posts.find(x => x.id === post.id);
    p.shares++;
    renderPosts();
  });

  return card;
}

function renderContacts() {
  contactList.innerHTML = '';
  CONTACTS.forEach(c => {
    const div = document.createElement('div');
    div.className = 'contact-item';
    div.innerHTML = `
      <div class="contact-avatar ${c.online ? 'contact-online' : ''}" style="background:${c.color}">${c.initial}</div>
      <span class="contact-name">${c.name}</span>
    `;
    div.addEventListener('click', () => showToast(`Messaging ${c.name} 💬`));
    contactList.appendChild(div);
  });
}

// ── CREATE POST MODAL ──────────────────────────────────────────────────────
$('openPostModal').addEventListener('click', () => postModal.classList.remove('hidden'));
$('closePostModal').addEventListener('click', () => postModal.classList.add('hidden'));
postModal.addEventListener('click', e => { if (e.target === postModal) postModal.classList.add('hidden'); });

$('submitPost').addEventListener('click', () => {
  const content = $('postContent').value.trim();
  if (!content) { showToast('Please write something first ✍️'); return; }

  const newPost = {
    id: Date.now(),
    author: currentUser.name,
    initial: currentUser.initial || currentUser.name[0].toUpperCase(),
    color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    time: 'Just now',
    text: content,
    image: null,
    emoji: null,
    likes: 0,
    comments: 0,
    shares: 0,
    liked: false,
    reactions: ['👍'],
  };

  posts.unshift(newPost);
  renderPosts();
  $('postContent').value = '';
  postModal.classList.add('hidden');
  showToast('Your post has been shared! 🎉');
});

// ── NAV SEARCH ─────────────────────────────────────────────────────────────
$('navSearch').addEventListener('keydown', e => {
  if (e.key === 'Enter' && $('navSearch').value.trim()) {
    showToast(`Searching for "${$('navSearch').value.trim()}" 🔍`);
  }
});

// ── FORGOT PASSWORD ────────────────────────────────────────────────────────
document.querySelector('.forgot-password')?.addEventListener('click', e => {
  e.preventDefault();
  showToast('Password reset link sent to your email 📧');
});

// ── ESCAPE KEY ─────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    signupModal.classList.add('hidden');
    postModal.classList.add('hidden');
  }
});

// ── HELPERS ────────────────────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── SESSION RESTORE ────────────────────────────────────────────────────────
(function restoreSession() {
  const saved = sessionStorage.getItem('fbUser');
  if (saved) {
    try {
      loginSuccess(JSON.parse(saved));
    } catch {
      sessionStorage.removeItem('fbUser');
    }
  }
})();
