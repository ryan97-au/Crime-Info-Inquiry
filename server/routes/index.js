var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var url = require('url');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Crime systems API' });
});

// register
router.post("/register", function(req,res,next) {
  var email = req.body.email;
  var password = req.body.password;
  // SELECT email FROM web_computing.users WHERE email=''
  req.db.from("web_computing.users").select('email').where({email:email})
  .then(result => {
    // check if the mail exists, if it exists send 400
    if(result.length !== 0) {
      res.status(400).send({message: "oops! It looks like that user already exists :("})
    }
    else {
      // if the email does not exist, insert email and password 
      req.db('web_computing.users').insert({email:email,password:password})
        .then(result => {
          res.status(201).send({message: "yay! you've successfully registered your user account :)"})
        })
    }
  })
  .catch(error=>{
    throw error
  })
});

// login
const JWT_SECRET = 'my-secret'; // set the secret
router.post("/login", function (req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  // SELECT email FROM web_computing.users where email='' AND password=''
  req.db.from("web_computing.users").select('email').where({ email, password })
    .then(result => {
      // if exist, generate and send a token
      if (result.length !== 0) {
        // get the token (jwt.sign(payload, secret, {expiresIn}))
        var token = jwt.sign({ email, password }, JWT_SECRET, { expiresIn: 86400 }); // set the expiration time to one day
        res.status(200).send({ token });
      }
      else {
        // email or password or both are incorrect, invalid login
        res.status(401).send({message: "oh no! Invalid login"});
      }
    })
    .catch(error => {
      throw error;
    });
});

// for verifying the token
function verifyToken(req, res, next) {
  var token = null;
  // try to find token from request headers
  // headers: { Authorization: `Bearer ${JWT}` }
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) { // no token
    res.status(400).send({message: 'request the token!' });
  } else {
      // verify the token
      jwt.verify(token, JWT_SECRET, function(error, decoded) {
        if (error) res.status(401).send({message: "oh no! it looks like your authorization token is invalid..."});
        else next(); // token is valid, go next
      });
  }
};

// offences
router.get("/offences", function(req,res,next) {
  // SELECT pretty FROM web_computing.offence_columns
  req.db.from('web_computing.offence_columns').select("pretty")
    .then((rows) => {
      res.json({"offences" : rows.map(row => 
        {
          return row['pretty']
        })
      })
    })
    .catch((error) => {
      console.log(error);
      res.json({message: "Error in MySQL query"})
    })
});

// areas
router.get("/areas", function(req,res,next) {
  // SELECT area FROM web_computing.offences group by area
  req.db.from('web_computing.offences').select("area").groupBy("area")
    .then((rows) => {
      res.json({"areas" : rows.map(row => 
        {
          return row['area']
        })
      })
    })
    .catch((error) => {
      console.log(error);
      res.json({message: "Error in MySQL query"})
    })
});

// ages
router.get("/ages", function(req,res,next) {
  // SELECT age FROM web_computing.offences group by age
  req.db.from('web_computing.offences').select("age").groupBy("age")
    .then((rows) => {
      res.json({"ages" : rows.map(row => 
        {
          return row['age']
        })
      })
    })
    .catch((error) => {
      console.log(error);
      res.json({message: "Error in MySQL query"})
    })
});

// genders
router.get("/genders", function(req,res,next) {
  // SELECT gender FROM web_computing.offences group by gender
  req.db.from('web_computing.offences').select("gender").groupBy("gender")
    .then((rows) => {
      res.json({"genders" : rows.map(row => 
        {
          return row['gender']
        })
      })
    })
    .catch((error) => {
      console.log(error);
      res.json({message: "Error in MySQL query"})
    })
});

// years
router.get("/years", function(req,res,next) {
  // SELECT year FROM web_computing.offences group by year
  req.db.from('web_computing.offences').select("year").groupBy("year")
    .then((rows) => {
      res.json({"years" : rows.map(row => 
        {
          return row['year']
        })
      })
    })
    .catch((error) => {
      console.log(error);
      res.json({message: "Error in MySQL query"})
    })
});

// search
router.get('/search', verifyToken, function(req,res,next) { // check if search has authorization
  var query = url.parse(req.url, true).query; // true, parse url into each object
  var offence = query.offence;
  var area = query.area;
  var age = query.age;
  var gender = query.gender;
  var year = query.year;
  // SELECT column FROM web_computing.offence_columns where pretty=''
  req.db.from('web_computing.offence_columns').select('column').where({ 'pretty': offence })
    .then((rows) => {
      if (rows.length !== 0) {
        var where = {};
        if (area) { where.area = area; }
        if (age) { where.age = age; }
        if (gender) { where.gender = gender; }
        if (year) { where.year = year; } // filters
        var columnName = rows[0].column;
        // e.g: SELECT area,SUM(assault) FROM web_computing.offences where area='Brisbane City Council' AND age='Adult' AND gender='Male' AND year=2001 group by area
        req.db.from('web_computing.offences').select("area", req.db.raw(`SUM(${columnName})`)).where(where).groupBy("area")
          .then((rows) => {
            var result = []; // define an empty array
            for (var i = 0; i < rows.length; i++) {
              result.push({"LGA": rows[i].area, "total": rows[i][`SUM(${columnName})`]}); // get the totals of selected offence of each area
            }
            res.json({result});
          })
          .catch((error) => {
            console.log(error);
            res.json({message: "Error in MySQL query" })
          })
      } else { // offences.length === 0
          res.json({"rows": []})
      }
    })
});

// search-without-verifyToken for showing the search results, and the content is the same as the search above
router.get('/search-without-verifyToken', function(req,res,next) { // do not need to check authorization here
  var query = url.parse(req.url, true).query; // true, parse url into each object
  var offence = query.offence;
  var area = query.area;
  var age = query.age;
  var gender = query.gender;
  var year = query.year;
  // SELECT column FROM web_computing.offence_columns where pretty=''
  req.db.from('web_computing.offence_columns').select('column').where({ 'pretty': offence })
    .then((rows) => {
      if (rows.length !== 0) {
        var where = {};
        if (area) { where.area = area; }
        if (age) { where.age = age; }
        if (gender) { where.gender = gender; }
        if (year) { where.year = year; } // filters
        var columnName = rows[0].column;
        // e.g: SELECT area,SUM(assault) FROM web_computing.offences where area='Brisbane City Council' AND age='Adult' AND gender='Male' AND year=2001 group by area
        req.db.from('web_computing.offences').select("area", req.db.raw(`SUM(${columnName})`)).where(where).groupBy("area")
          .then((rows) => {
            var result = [];
            for (var i = 0; i < rows.length; i++) {
              result.push({"LGA": rows[i].area, "total": rows[i][`SUM(${columnName})`]}); // get the totals of selected offence of each area
            }
            res.json({result});
          })
          .catch((error) => {
            console.log(error);
            res.json({message: "Error in MySQL query" })
          })
      } else {
          res.json({"rows": []})
      }
    })
});

module.exports = router;
