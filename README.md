# Facebook Login/Homepage Clone

A front-end recreation of the Facebook login and homepage feed interface, built with pure HTML, CSS, and JavaScript — no frameworks or dependencies.

---

## 🚀 Live Demo

Open `index.html` in any modern browser to run the project locally.

**Demo Credentials:**
| Email | Password |
|-------|----------|
| `demo@facebook.com` | `demo1234` |
| `john@example.com` | `password` |

> You can also log in with **any email + 6-character password** to demo the app.

---

## 📁 Project Structure

```
facebook-clone/
├── index.html          # Main HTML — login page + home feed layout
├── css/
│   └── style.css       # All styles, CSS variables, responsive design
├── js/
│   └── app.js          # All interactivity, validation, feed rendering
└── README.md
```

---

## ✨ Features

### Login Page
- Pixel-faithful Facebook login UI (logo, tagline, form, footer)
- **Form validation** — empty fields, invalid email format, short password
- **Show/Hide password** toggle
- Simulated async login with **loading spinner**
- **Forgot password** mock action
- **Create account** opens the Sign Up modal

### Sign Up Modal
- Full registration form (name, email, password, DOB, gender)
- Dynamically populated Day/Year dropdowns
- Closes on backdrop click or Escape key

### Home Feed (after login)
- **Top navbar** — logo, search bar, navigation icons, user avatar, action buttons
- **Left sidebar** — profile shortcut, navigation links, shortcuts section
- **Right sidebar** — contacts list with online indicators, birthdays
- **Create Post** widget
- **Sample posts** with realistic content

### Post Interactions
- ❤️ **Like / Unlike** with live counter update
- 💬 **Comment** button (toast notification)
- ↗️ **Share** button with live share counter
- **Create new post** — modal with text area, audience picker, action buttons

### General UX
- **Toast notifications** for all user actions
- **Session persistence** via `sessionStorage` (survives page refresh)
- **Logout** button returns to login page
- **Escape key** closes all modals
- **Nav search** with Enter key action

---

## 📱 Responsive Design

| Breakpoint | Layout |
|---|---|
| ≥ 1080px | 3-column grid (left sidebar + feed + right sidebar) |
| 768–1080px | 2-column (left sidebar + feed) |
| ≤ 768px | Single column feed, sidebars hidden |
| ≤ 480px | Simplified navbar, optimized form |

---

## 🛠 Technologies Used

- **HTML5** — semantic structure, accessibility attributes
- **CSS3** — custom properties (variables), flexbox, CSS Grid, media queries, animations
- **Vanilla JavaScript (ES6+)** — DOM manipulation, event handling, async/await, sessionStorage

---

## 🔧 Running the Project

1. **Clone or unzip** the project folder
2. Open `index.html` in a browser (Chrome, Firefox, Safari, Edge)
3. No build step, server, or npm required

---

## 📝 Notes

- This is a **UI recreation for educational purposes only**
- No real authentication or backend — all data is in-memory
- Facebook's logo/brand is used solely for visual reference; this project is not affiliated with Meta

---

*Built with HTML, CSS & JavaScript*
