import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCategories, createEntry } from "../api";

export default function NewEntry() {
  //useNavigate to navigate to the home page
  const navigate = useNavigate();

  //useState to store and update the data
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [reflection, setReflection] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  //useEffect to get the categories from the database
  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setError("Couldn't load categories. Is the server running?"));
  }, []);

  //function to handle the file input
  function handleFile(event) {
    const chosen = event.target.files[0] ?? null;
    setFile(chosen);
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return chosen ? URL.createObjectURL(chosen) : null;
    });
  }

  //function to handle the form submission
  async function handleSubmit(event) {
    //prevent the default form submission
    event.preventDefault();
    //set the saving state to true
    setSaving(true);
    //set the error to null
    setError(null);

    //create a new FormData object
    const data = new FormData();
    //append the title, reflection, and category id to the form data
    data.append("title", title);
    data.append("reflection", reflection);
    data.append("category_id", categoryId);
    if (file) data.append("image", file);

    try {
      //create the entry in the database
      const res = await createEntry(data);
      //navigate to the entry page
      navigate(`/entry/${res.data.id}`);
    } catch (err) {
      //set the error to the server's reason (e.g. "Please fill in: title.") when it gives one
      setError(err.response?.data?.error ?? "Couldn't save your moment. Please try again.");
      setSaving(false);
    }
  }

  return (
    <main>
      {/* Back link */}
      <Link to="/" className="back-link">← Back</Link>

      {/* Page header */}
      <header className="page-header center">
        <h1>Capture a moment</h1>
        <p className="tagline">What made you pause today?</p>
      </header>

      {/* Error message */}
      {error && <p className="notice">{error}</p>}

      {/* Entry form */}
      <form onSubmit={handleSubmit} className="entry-form">
        {/* Image input */}
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="sr-only"
        />
        {/* if there is a preview image, show the preview image, otherwise show the dropzone */}
        {preview ? (
          <label className="preview-swap" htmlFor="image">
            <img className="form-preview" src={preview} alt="Preview of your chosen photo" />
            <span className="swap-hint">Choose a different photo</span>
          </label>
        ) : (
          <label className="dropzone" htmlFor="image">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            Add a photo
          </label>
        )}

        {/* Title input */}
        <label htmlFor="title">Title<span className="req" aria-hidden="true"> *</span></label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="A stranger's smile on the bus"
          maxLength={100}
          required
        />
        {/* Category input */}
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="" disabled>Choose a category</option>
          {/* map over the categories and create an option for each category */}
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        {/* Reflection input */}
        <label htmlFor="reflection">Reflection<span className="req" aria-hidden="true"> *</span></label>
        <textarea
          id="reflection"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="A sentence or two is plenty…"
          rows={5}
          required
        />

        {/* Save button */}
        <button type="submit" className="button primary" disabled={saving}>
          {saving ? "Saving…" : "Keep this moment"}
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
