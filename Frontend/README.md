# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## App Routes

Client-side routing is configured with `react-router-dom`.

Available paths:

- `/` → Redirects to `/home`
- `/home` → Home page (`src/pages/Home.jsx`)
- `/register` → Register page (`src/pages/Register.jsx`)
- `/login` → Login page (`src/pages/Login.jsx`)
- Any other path → 404 fallback message

Navigation links are rendered in `src/App.jsx` inside a `<nav>` element.

Entry setup:

- `src/main.jsx` wraps `<App />` with `<BrowserRouter>`.
- `src/App.jsx` declares `<Routes>` and individual `<Route>` elements.

To run locally:

```bash
npm install
npm run dev
```

Then open the shown local URL (typically `http://localhost:5173`) and use the navigation links or type the route paths directly.
