const express = require('express');
const app = express();
const mysql = require ('mysql2');
const cors = require('cors');
const path = require('path');

const PORT = 3000;

//connect to database
const db = require('./config/db');

//import routes
const categoriesRouter = require('./routes/categories');
const entriesRouter = require('./routes/entries');

//run public folder before any other routes (absolute path so it works from any cwd)
app.use(express.static(path.join(__dirname, 'public')));

//upload images
app.use('/uploads', express.static(path.join(__dirname, 'public/images')));

//parse json
app.use(express.json());

//cors options for cross origin resource sharing
const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders: "Content-Type, Authorization",
};

//use cors options
app.use(cors(corsOptions));

//use routes
app.use('/categories', categoriesRouter);
app.use('/entries', entriesRouter);

//handle 404 errors
app.use('/',(req,res)=>{
  res.status(404).send("URL not found");
});
//start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
});