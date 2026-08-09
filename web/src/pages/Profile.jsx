import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEntries, formatDate } from "../api";

export default function Profile({ isAuthenticated, handleSignOut }) {
    //saved at sign-in, so no extra request just to show who is signed in
    const username = localStorage.getItem("username") || "there";
    const email = localStorage.getItem("email");

    //the entries carry everything else worth showing here
    const [entries, setEntries] = useState(null);

    useEffect(() => {
      if (!isAuthenticated) return;
      getEntries()
        .then((res) => setEntries(res.data))
        .catch(() => setEntries([]));
    }, [isAuthenticated]);

    //signed out: nothing to show but the way back in
    if (!isAuthenticated) {
      return (
        <main>
          <header className="page-header center">
            <h1>Your Profile</h1>
            <p className="tagline">Sign in to access your account.</p>
          </header>

          <div className="notice">
            <Link to="/sign-in" className="button primary">Sign In</Link>
          </div>
        </main>
      );
    }

    const count = entries === null ? "—" : entries.length;
    //entries come back newest first, so the last one is the oldest
    const since = entries?.length ? formatDate(entries[entries.length - 1].created_at) : "—";
    const categories =
      entries === null ? "—" : new Set(entries.map((e) => e.category)).size;

    return (
      <main>
        <header className="page-header header-row">
          <h1>Your Profile</h1>

          <button type="button" className="button danger" onClick={handleSignOut}>
            Sign Out
          </button>
        </header>

        <section className="profile-card">
          <p className="avatar" aria-hidden="true">{username.charAt(0).toUpperCase()}</p>
          <h2>{username}</h2>
          {email && <p className="profile-email">{email}</p>}

          <dl className="stat-row">
            <div>
              <dt>Moments</dt>
              <dd>{count}</dd>
            </div>
            <div>
              <dt>Categories</dt>
              <dd>{categories}</dd>
            </div>
            <div>
              <dt>First moment</dt>
              <dd>{since}</dd>
            </div>
          </dl>
        </section>

        <div className="profile-actions">
          <button type="button" className="button danger" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </main>
    );
  }
