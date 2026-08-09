import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../api";

export default function SignUp() {
  //useNavigate to send the new account to the sign in page
  const navigate = useNavigate();

  //useState to store and update the form data
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  //function to handle the form submission
  async function handleSubmit(event) {
    //prevent the default form submission
    event.preventDefault();
    setError(null);

    //the server never sees the confirmation, so this one is checked here
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await signUp(username, email, password);
      //sign-up returns no token, so the new account signs in on the next page
      navigate("/sign-in");
    } catch (err) {
      //the server sends {errors:[{msg}]} for validation and duplicate emails, {message} for the rest
      setError(
        err.response?.data?.errors?.[0]?.msg ??
          err.response?.data?.message ??
          "Couldn't create your account. Is the server running?"
      );
      setSubmitting(false);
    }
  }

  return (
    //create the main container
    <main>
      {/* Page header */}
      <header className="page-header center">
        <h1>Create Account</h1>
        <p className="tagline">Somewhere to keep your moments.</p>
      </header>

      {/* Error message */}
      {error && <p className="notice">{error}</p>}

      {/* create the form */}
      <form onSubmit={handleSubmit} className="entry-form">
        {/* create the username field */}
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          name="username"
          placeholder="What should we call you?"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />

        {/* create the email field */}
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="signup@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
          minLength={8}
        />

        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          id="confirm-password"
          type="password"
          name="confirmPassword"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
          minLength={8}
        />

        {/* Register button */}
        <button type="submit" className="button primary" disabled={submitting}>
          {submitting ? "Creating…" : "Register"}
          <span className="orb" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </span>
        </button>
      </form>

      {/* link to the sign in page for people who already have an account */}
      <p className="form-switch">
        Already have an account? <Link to="/sign-in">Sign in</Link>
      </p>
    </main>
  );
}
