# Daybook
Daybook is a small personal journaling app. You'll capture a "Moment" with a title, a short reflection, an optional photo, and a category.

## Pages
archive.jsx: shows up all moments in and you can filter by category. 
entry.jsx: the moment details, which you can read it in full, edit, or delete.
newEntry.jsx: the form for adding new moments
editEntry.jsx: the form for editing the moment, the image field is a bit different cause there will be an existing image.

# Folder 
- `web/`— React 19, React Router frontend, built with Vite.
- `server/` — Express 5 API backed by MySQL (via `mysql2`), with image uploads handled by Multer.

## Features

- Create, edit, and delete entries (title, reflection text, category, optional photo)
- Archive view with category filtering — the filter is stored in the URL (`?category=2`) so it survives a refresh or back-button press instead of resetting
- Accessible loading and empty states (skeleton cards while data loads, `aria-hidden`/`sr-only` where appropriate, alt text on photos)
- Images are stored on disk and served statically, with filenames timestamped to avoid collisions

## Running it locally

**Database**
You'll need a local MySQL instance with a database called `daybook_app`

Table 1 : ec_categories
Table 2 : ec_entries

## Reflection

I wanted to build something that felt a little more meaningful while still meeting the assignment requirements. I remembered advice I received before about keeping track of the little moments that brighten my day, especially because I tend to doubt myself sometimes. That became the inspiration for this project.

Overall, the project was straightforward to follow and gave me practical, hands-on experience building a full CRUD application and setting up the back end. It also helped reinforce what we covered in the tutorials, as I had to revisit each step and understand how everything connected rather than simply following along.

While none of the individual tasks were especially difficult, getting all the pieces working together correctly took several iterations. CORS was the biggest challenge, since the Vite development server and the Express API run on different ports, and I hadn’t encountered same-origin restrictions in this way before. Carefully reading the error messages and taking the time to configure a proper corsOptions object—instead of simply applying cors() globally—was ultimately what resolved the issue. That experience gave me a much clearer understanding of how the front end and back end communicate during development.
