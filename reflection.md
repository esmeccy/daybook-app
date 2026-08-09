# Daybook

Daybook is a small personal journaling app. You capture a "Moment" with a title, a short reflection, an optional photo, and a category — and now each account only ever sees its own moments.

## Folders

- `web/` — React 19 + React Router frontend, built with Vite.
- `server/` — Express 5 API backed by MySQL (via `mysql2`), with image uploads handled by Multer.

## Pages

- `SignUp.jsx` / `SignIn.jsx` — create an account or sign in. Sign-in stores the JWT in localStorage.
- `Archive.jsx` — all of *your* moments, filterable by category.
- `Entry.jsx` — the moment in full, where you can read, edit, or delete it.
- `NewEntry.jsx` — the form for adding a moment.
- `EditEntry.jsx` — the same form for editing. The image field works a bit differently because there's already an existing image.
- `profile.jsx` — who you're signed in as, a few stats, and the sign-out button.

## Features

- Sign-up, sign-in, and sign-out, with passwords hashed by bcrypt and a JWT for the session
- Every entry belongs to a user, and the API only ever returns or edits rows belonging to the signed-in one
- Create, edit, and delete moments (title, reflection, category, optional photo)
- Archive view with category filtering — the filter is stored in the URL (`?category=2`) so it survives a refresh or back-button press instead of resetting
- Accessible loading and empty states (skeleton cards while data loads, `aria-hidden`/`sr-only` where appropriate, alt text on photos)
- Images are stored on disk and served statically, with timestamped filenames to avoid collisions

## Running it locally

**1. Database**

Start MySQL in MAMP (it runs on port `8889`), then in phpMyAdmin create a database called `daybook_app` and import `daybook_app.sql`. That gives you three tables:

- `ec_categories` — the fixed list of categories
- `ec_entries` — the moments, with a `user_id` foreign key pointing at the users table
- `ec_users-table` — usernames, emails (unique), and bcrypt-hashed passwords

The connection details live in `server/config/db.js`. If your MySQL user isn't `esme`, change them there.

**2. Server**

```bash
cd server
npm install
```

Copy `.env.example` to `.env` and put a real key in it — this is what signs the JWTs, so it needs to be long and random, not a word. I generated mine from https://randomkeygen.com.

```bash
npm run dev
```

That starts nodemon on http://localhost:3000.

**3. Frontend**

```bash
cd web
npm install
npm run dev
```

Vite serves on http://localhost:5173. Open it, create an account, and you're in.

## Reflection

I wanted to build something that felt a little more meaningful while still meeting the assignment requirements. I remembered advice I received before about keeping track of the little moments that brighten my day, especially because I tend to doubt myself sometimes. That became the inspiration for this project.

The CRUD half was straightforward to follow and gave me practical, hands-on experience building a full application and setting up the back end. None of the individual tasks were especially difficult, but getting all the pieces working together took several iterations. CORS was the biggest challenge there, since the Vite dev server and the Express API run on different ports and I hadn't run into same-origin restrictions in this way before. Reading the error messages carefully and configuring a proper `corsOptions` object — instead of just calling `cors()` globally — was what fixed it, and it gave me a much clearer picture of how the front end and back end actually talk to each other in development.

Adding authentication was a different kind of work, and most of it was new to me. The part that took the longest to click was that a JWT isn't a session — the server doesn't remember anything about me between requests. Everything it knows comes from the token I send it each time. Once that landed, the middleware made sense: `auth.js` pulls the token out of the `Authorization` header, verifies it, and hangs the decoded user on `req.user` so every route after it can just read `req.user.userId` without caring how it got there.

The decision I'm happiest with is how I scoped the data. My first instinct was to fetch an entry, then check in JavaScript whether it belonged to the right person, and return a 403 if it didn't. That felt fragile — it's one forgotten `if` away from leaking someone's journal. Instead I put `user_id = ?` into the WHERE clause of every query. Someone else's entry now simply matches zero rows, so the same "not found" path I already had covers it. Less code, and it can't be forgotten halfway down a route.

Two smaller things I ended up reasoning about properly rather than just copying. One, I let the UNIQUE constraint on the email column catch duplicate sign-ups and handled the `ER_DUP_ENTRY` error, instead of doing a SELECT first to check — a pre-check can pass and then still lose a race if two people register at the same instant, whereas the database can't. Two, I return the same "Invalid email or password" whether the email doesn't exist or the password is wrong. It's more annoying to debug, but telling someone "that email exists, wrong password" hands an attacker a way to find out who has an account.

On the front end, the thing that surprised me was how much of it was state, not requests. Attaching the token turned out to be four lines in one axios interceptor in `api.js` rather than something I repeat everywhere. The real work was making the app *believe* the sign-in — `isAuthenticated` in `App.jsx` reads localStorage on first render so a returning user doesn't flash the sign-in page, and when it's false the router only offers sign-in and sign-up, so there's no signed-out shell to get stuck in.

What I'd fix next: my tokens expire after an hour, and right now nothing handles that moment. The app still sees a token in localStorage and shows you the UI, but every request comes back 403 and it just looks broken. The fix is a response interceptor that clears localStorage on a 401 or 403 and sends you back to sign-in. I know where it goes, I just ran out of time to do it properly.

The bigger takeaway is that authentication is mostly about not trusting things. Not trusting the client to tell me who it is, not trusting that a check I wrote in one route got written in the other four, not trusting input to be shaped how the form shaped it. Putting the ownership check in SQL and the validation in `express-validator` at the edge, rather than scattering `if` statements through my handlers, is the version of that I'll carry forward.
