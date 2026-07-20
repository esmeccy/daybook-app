const express = require('express');
const categoriesRouter = express.Router();
const db = require("../config/db");

//get all categories
categoriesRouter.get ("/",(req,res)=>{
  //sort categories alphabetically
  const sql = `SELECT * FROM ec_categories ORDER BY name ASC`;

  db.query(sql, (err, result) => {
      if (err){
        //log error for human readability
          console.error(err);
          //return error for computer readability
          res.status(500).json({
            message: "Failed to retrieve categories.",
            error: err.message
        });
          return;
      }
      //return categories
      res.status(200).json(result);
  });
});

module.exports = categoriesRouter;
