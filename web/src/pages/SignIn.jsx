import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../api";

export default function SignIn() {
  //useNavigate to go back to the archive once signed in
  const navigate = useNavigate();

  //useState to store and update the form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  //the stored token is the only thing that says "signed in", so read it straight from storage
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  //function to handle the form submission
  async function handleSubmit(event) {
    //prevent the default form submission
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await signIn(email, password);
      //keep the token so every later request can send it (see the interceptor in api.js)
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      //the server sends {message} for bad credentials and {errors:[{msg}]} for validation
      setError(
        err.response?.data?.message ??
          err.response?.data?.errors?.[0]?.msg ??
          "Couldn't sign in. Is the server running?"
      );
      setSubmitting(false);
    }
  }

  //function to sign out by throwing the token away
  function handleSignOut() {
    localStorage.removeItem("token");
    setToken(null);
  }

  //if already signed in, this tab is just a way back out
  if (token) {
    return (
      <main>
        <header className="page-header center">
          <h1>Your account</h1>
          <p className="tagline">You're signed in.</p>
        </header>

        <div className="notice">
          <button type="button" className="button" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </main>
    );
  }

  return (
    <main>
      {/* Page header */}
      <header className="page-header center">
        <h1>Welcome back</h1>
        <p className="tagline">Sign in to see your moments.</p>
      </header>

      {/* Error message */}
      {error && <p className="notice">{error}</p>}

      {/* Sign in form */}
      <form onSubmit={handleSubmit} className="entry-form">
        {/* Email input */}
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        {/* Password input */}
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          autoComplete="current-password"
          required
        />

        {/* Sign in button */}
        <button type="submit" className="button primary" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
          <span className="orb" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </span>
        </button>
      </form>
    </main>
  );
}
