const express = require("express");
const entriesRouter = express.Router();

const db = require("../config/db");
const upload = require("../config/storage");

const authenticateToken = require("../auth");

// use the authenticateToken middleware to protect the routes
entriesRouter.use(authenticateToken);

// Get all Daybook entries
entriesRouter.get("/", (req, res) => {

    // Join the categories table so the frontend receives the category name instead of just the category_id.
    const sql = `SELECT ec_entries.*,
    ec_categories.name AS category
    FROM ec_entries
    JOIN ec_categories
    ON ec_entries.category_id = ec_categories.id  
    WHERE ec_entries.user_id = ?
    ORDER BY created_at DESC`;

    // get the user id from the request object
    const userId = req.user.userId;
    db.query(sql, [userId], (err, result) => {

      if (err) {
        //log error for human readability
          console.error(err);
          //return error for computer readability
          res.status(500).send(err);
          return;
      }
      res.json(result);
  });

});

// get entry by id
entriesRouter.get("/:id", (req,res)=>{
const {id} = req.params;
//query database
const sql = `
SELECT ec_entries.*, 
ec_categories.name AS category
FROM ec_entries
JOIN ec_categories 
ON ec_entries.category_id = ec_categories.id
WHERE ec_entries.id = ? AND ec_entries.user_id = ?`;
//query database, scoped to the signed-in user so nobody can read someone else's entry
db.query(sql, [id, req.user.userId], (err, result) => {
  if (err) {
    //log error for human readability
      console.error(err);
      //return error for computer readability
      return res.status(500).json({
        error: "Server Error: " + err.message
      });
  }
  //if entry not found, return 404 error
  if (result.length === 0) {
    return res.status(404).json({
      message: "Entry not found."
    });
  }
  //return entry as json object at index 0 so the first entry is returned
  res.status(200).json(result[0]);
});

});

//return a clear 400 naming the missing fields, so the frontend can show the user what to fix
function missingFields(body) {
  const missing = [];
  if (!body.title || !body.title.trim()) missing.push("title");
  if (!body.reflection || !body.reflection.trim()) missing.push("reflection");
  if (!body.category_id) missing.push("category");
  return missing;
}

// Add a new entry
entriesRouter.post("/", upload.single("image"),
(req, res) => {

  const { title, reflection, category_id } = req.body;
  const image = req.file ? req.file.filename : null;

  const missing = missingFields(req.body);
  if (missing.length) {
    return res.status(400).json({
      error: `Please fill in: ${missing.join(", ")}.`
    });
  }

  //insert new entry into database
  const sql = `
      INSERT INTO ec_entries
      (title, reflection, image, category_id, user_id, created_at)
      VALUES (?, ?, ?, ?,?, NOW())`;

  //create an array of query parameters
    const queryParams = [title, reflection, image, category_id, req.user.userId];

  //query database
  db.query(sql, queryParams, (err, result) => {
    //if there is an error, return a 500 error
    if (err) {
      console.error(err);
      return res.status(500).json({
      error: "Server Error: " + err.message
    });
  }
  //return success message and new entry id
  res.status(201).json({
    message: "Entry Logged successfully.",
    id: result.insertId
  });
});
});

//update an entry
entriesRouter.put("/:id", upload.single("image"), (req, res) => {
  const id = req.params.id;
  const { title, reflection, category_id } = req.body;

  const missing = missingFields(req.body);
  if (missing.length) {
    return res.status(400).json({
      error: `Please fill in: ${missing.join(", ")}.`
    });
  }

  //create an array of query parameters
  const queryParams = [title, reflection, category_id];

  //create the sql query
  let sql = `
      UPDATE ec_entries
      SET
          title = ?,
          reflection = ?,
          category_id = ?
  `;

  //only touch the image column if a new image was uploaded
  if (req.file) {
    sql += ", image = ?";
    queryParams.push(req.file.filename);
  }

  //user_id in the WHERE clause means another user's entry simply matches nothing
  sql += " WHERE id = ? AND user_id = ?";
  queryParams.push(id, req.user.userId);

  //update the entry in the database
  db.query(sql, queryParams, (err, result) => {
    //if there is an error, return a 500 error
          if (err) {
              console.error(err);
              return res.status(500).json({
                error: "Error updating entry:" + err.message
              });
          }
          //no rows matched = wrong id, or the entry belongs to someone else
          if (result.affectedRows === 0) {
            return res.status(404).json({
              message: "Entry not found."
            });
          }
          //return success message
          res.json({
              message: "Entry updated successfully."
          });

      }
  );

});

//delete an entry
entriesRouter.delete("/:id", (req, res) => {
  const id = req.params.id;
  //create the sql query
  const sql = `DELETE FROM ec_entries
  WHERE id = ? AND user_id = ?
  LIMIT 1`;
  //query the database
  db.query(sql, [id, req.user.userId], (err, result) => {
    //if there is an error, return a 500 error
      if (err) {
          console.error(err);
          return res.status(500).send
          ('Error deleting entry:' + err.message);
      }
      //no rows matched = wrong id, or the entry belongs to someone else
      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Entry not found."
        });
      }
      //return success message
      res.json({
          message: "Entry deleted successfully."
      });

  });

});

module.exports = entriesRouter;
