import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getEntries, imageUrl, formatDate } from "../api";
import CategoryFilter from "../components/CategoryFilter";

// Archive: short summary of every entry, filterable by category.
export default function Archive() {
  //useState to store the entries and error
  const [entries, setEntries] = useState(null);
  const [error, setError] = useState(null);

  //useSearchParams to get the search params from the url and set the selected category
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter lives in the URL (?category=2) so back/refresh/share keep it.
  const selected = searchParams.get("category")
    ? Number(searchParams.get("category"))
    : "all";
    //set the selected category
  const setSelected = (value) =>
    setSearchParams(value === "all" ? {} : { category: value });

  //useEffect to get the entries from the database
  useEffect(() => {
    //get the entries from the database
    getEntries()
      .then((res) => setEntries(res.data))
      //catch the error and set the error state
      .catch(() => setError("Couldn't load your moments. Is the server running?"));
  }, []);

  //filter the entries by the selected category
  const shown =
    entries === null
      ? []
      : selected === "all"
        ? entries
        //filter the entries by the selected category
        : entries.filter((e) => e.category_id === selected);

  return (
    <main>
      {/* Page header */}
      <header className="page-header">
        <h1>Daybook</h1>
        <p className="tagline">One small moment at a time.</p>
      </header>

      {/* CategoryFilter component */}
      <CategoryFilter selected={selected} onSelect={setSelected} />
      {/* Error message */}
      {error && <p className="notice">{error}</p>}
      {/* Loading message */}
      {entries === null && !error && (
        <>
          <p className="sr-only" role="status">Loading your moments</p>
          <ul className="card-grid" aria-hidden="true">
            {[1, 2, 3].map((n) => (
              <li key={n}><div className="card skeleton" /></li>
            ))}
          </ul>
        </>
      )}

      {/* No entries message */}
      {entries !== null && shown.length === 0 && (
        <div className="notice">
          <p>
            {entries.length === 0
              ? "Nothing here yet."
              : "No moments in this category yet."}
          </p>

          {/* Capture a moment button */}
          <Link to="/new" className="button primary">
            Capture a moment
            <span className="orb" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </span>
          </Link>
        </div>
      )}

      {/* Entries list */}
      <ul className="card-grid">
        {/* map over the shown entries and create a card for each entry */}
        {shown.map((entry) => (
          <li key={entry.id}>
            <article className="card">
              {/* link to the entry */}
              <Link to={`/entry/${entry.id}`}>
                {/* image */}
                {entry.image && (
                  <img
                    src={imageUrl(entry.image)}
                    alt={`Photo for “${entry.title}”`}
                    loading="lazy"
                    //onError to handle the error of the image not loading
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
                <div className="card-body">
                  {/* category */}
                  <span className="tag">{entry.category}</span>
                  {/* title */}
                  <h2>{entry.title}</h2>
                  {/* reflection */}
                  <p className="snippet">{entry.reflection}</p>
                  {/* date */}
                  <time dateTime={entry.created_at}>{formatDate(entry.created_at)}</time>
                </div>
              </Link>
            </article>
          </li>
        ))}
      </ul>

      {/* Capture a new moment button */}
      <Link to="/new" className="fab" aria-label="Capture a new moment">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </Link>
    </main>
  );
}
