import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getEntry, deleteEntry, imageUrl, formatDate } from "../api";

//Single entry: full details, edit link, delete with confirmation.
export default function Entry() {
  //useParams to get the id from the url
  const { id } = useParams();
  //useNavigate to navigate to the home page
  const navigate = useNavigate();

  //useRef to store the dialog reference
  const dialogRef = useRef(null);

  //useState to store the entry and error
  const [entry, setEntry] = useState(null);
  const [error, setError] = useState(null);

  //useEffect to get the entry from the database
  useEffect(() => {
    getEntry(id)
      .then((res) => setEntry(res.data))
      .catch(() => setError("Couldn't find this moment."));
  }, [id]);

  //function to handle the delete button
  async function handleDelete() {
    try {
      await deleteEntry(id);
      navigate("/");
    } catch {
      dialogRef.current.close();
      setError("Couldn't delete this moment. Please try again.");
    }
  }

  //if there is an error, show the error message and back link
  if (error) {
    return (
      <main>
        <p className="notice">{error}</p>
        <Link to="/" className="back-link">← Back to your moments</Link>
      </main>
    );
  }
  if (!entry) return <main><p className="notice">One moment…</p></main>;

  return (
    <main>
      {/* Back link */}
      <Link to="/" className="back-link">← Moments</Link>

      <article className="entry">
        {/* image */}
        {entry.image && (
          <img
            src={imageUrl(entry.image)}
            alt={`Photo for “${entry.title}”`}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        )}

        {/* header */}
        <header>
          {/* category */}
          <span className="tag">{entry.category}</span>
          {/* title */}
          <h1>{entry.title}</h1>
          {/* date */}
          <time dateTime={entry.created_at}>{formatDate(entry.created_at)}</time>
        </header>

        {/* body */}
        {/* reflection */}
        <p className="reflection">{entry.reflection}</p>
        
        {/* buttons row */}
        <div className="entry-actions">
          {/* edit button */}
          <Link to={`/edit/${entry.id}`} className="button">Edit</Link>
          {/* delete button */}
          <button
            type="button"
            className="button danger"
            onClick={() => dialogRef.current.showModal()}
          >
            Delete
          </button>
        </div>
      </article>

      {/* delete confirmation dialog */}
      <dialog ref={dialogRef} className="confirm">
        <h2>Let this moment go?</h2>
        <p>“{entry.title}” will be removed from your daybook.</p>
        <div className="entry-actions">

          {/* keep it button */}
          <button type="button" className="button" onClick={() => dialogRef.current.close()}>
            Keep it
          </button>

          {/* delete button */}
          <button type="button" className="button danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </dialog>
    </main>
  );
}
