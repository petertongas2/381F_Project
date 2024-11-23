var 	express 					= require('express');
 	passport 					= require('passport');
 	FacebookStrategy 				= require('passport-facebook').Strategy;
 	session 					= require('express-session');
	formidable 					= require('express-formidable');
	fsPromises 					= require('fs').promises;
	app						= express();
	GitHubStrategy 					= require('passport-github').Strategy;
var 	{ MongoClient, ServerApiVersion, ObjectId } 	= require('mongodb');

//mongodb
//
const mongourl = 'mongodb+srv://bondlcf123:123@cluster0.hchfj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'concert';
const collectionName = 'concertinfo';
const client = new MongoClient(mongourl, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
//
//

app.set('view engine', 'ejs');

//passport
//

var user = {};
passport.serializeUser (function (user, done) {done (null, user); });
passport.deserializeUser (function (id, done) {done (null, user);});
app.use(session({
	secret: "tHiSiSasEcRetStr",
	resave: true,
	saveUninitialized: true }));
app.use (passport.initialize());
app.use(passport.session());
 
passport.use(new FacebookStrategy({
  clientID: '1215133756230490',
  clientSecret: '7f4e0f31c20126663d06a8746d26d493',
  callbackURL: 'http://localhost:8099/auth/facebook/callback'
},
 function (token, refreshToken, profile, done) {
 console.log("Facebook Profile: " + JSON.stringify(profile));
 user = {};
 user['id'] = profile.id;
 user['name'] = profile.displayName;
 user['type'] = profile.provider; // Facebook
 console.log('user object: ' + JSON.stringify(user));
 return done(null,user); // put user object into session => req.user
 }));

passport.use(new GitHubStrategy({
    clientID: 'Ov23liEUpuNWpO4jsNOv',
    clientSecret: '6a156a2f3572f0dbed9d87d75dcb58f6ca8bd532',
    callbackURL: "http://localhost:8099/auth/github/callback"
  },
function (accessToken, refreshToken, profile, cb) {
  user = {
    id: profile.id,
    name: profile.displayName,
    type: profile.provider // GitHub
  };
  console.log('user object: ' + JSON.stringify(user));
  return cb(null, user);
}));

//
//

app.use((req, res, next) => {
  let d = new Date();
  console.log(`TRACE: ${req.path} was requested at ${d.toLocaleDateString()}`);
  next();
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};

app.get("/login", (req, res) => {
  res.status(200).render('login');
});

app.get("/auth/facebook", passport.authenticate("facebook", { scope: "email" }));

app.get("/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/content",
    failureRedirect: "/"
  })
);

app.get('/auth/github',passport.authenticate('github'));

app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/content');
  });

app.get('/', isLoggedIn, (req, res) => {
  res.redirect('/content');
});

app.use(formidable());

app.get("/content", isLoggedIn, (req, res) => {
  handle_Find(req, res, req.query.docs);
});

app.get('/create', isLoggedIn, (req, res) => {
  res.status(200).render('create', { user: req.user });
});

app.post('/create', isLoggedIn, (req, res) => {
  handle_Create(req, res);
});

app.get('/details', isLoggedIn, (req, res) => {
  handle_Details(req, res, req.query);
});

app.get('/edit', isLoggedIn, (req, res) => {
  handle_Edit(req, res, req.query);
});

app.post('/update', isLoggedIn, (req, res) => {
  handle_Update(req, res, req.query);
});

app.get('/delete', isLoggedIn, (req, res) => {
  handle_Delete(req, res);
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

app.get('/*', (req, res) => {
  res.status(404).render('info', { message: `${req.path} - Unknown request!`, user: req.user });
});

//CRUD
//
//
const insertDocument = async (db, doc) => {
  const collection = db.collection(collectionName);
  const results = await collection.insertOne(doc);
  console.log("Inserted one document:", results);
  return results;
};

const findDocument = async (db, criteria) => {
  const collection = db.collection(collectionName);
  const results = await collection.find(criteria).toArray();
  console.log("Found documents:", results);
  return results;
};

const updateDocument = async (db, criteria, updateData) => {
  const collection = db.collection(collectionName);
  const results = await collection.updateOne(criteria, { $set: updateData });
  console.log("Updated document:", results);
  return results;
};

const deleteDocument = async (db, criteria) => {
  const collection = db.collection(collectionName);
  const results = await collection.deleteOne(criteria);
  console.log("Deleted document:", results);
  return results;
};
//
//
//

// function
//
//
const handle_Find = async (req, res, criteria) => {
  // Connect to the MongoDB client
  await client.connect();
  const db = client.db(dbName);

  // Query the MongoDB collection
  const results = await findDocument(db, criteria);

  // Render the results using the list.ejs template
  res.render('list', { user: req.user, concerts: results });

  // Close the MongoDB client connection
  await client.close();
};

const handle_Create = async (req, res) => {
  // Connect to the MongoDB client
  await client.connect();
  const db = client.db(dbName);

  // Prepare the document to be inserted
  const newConcert = {
    title: req.fields.title,
    date: req.fields.date,
    location: req.fields.location,
    description: req.fields.description
  };

  // Insert the document into the collection
  await insertDocument(db, newConcert);

  // Close the MongoDB client connection
  await client.close();

  // Redirect to the home page after creation
  res.redirect('/content');
};

const handle_Details = async (req, res, criteria) => {
  // Connect to the MongoDB client
  await client.connect();
  const db = client.db(dbName);

  // Find the specific concert based on the criteria
  const concert = await findDocument(db, { _id: new ObjectId(criteria._id) });

  // Close the MongoDB client connection
  await client.close();

  // Render the concert details using the details.ejs template
  res.render('details', { concert: concert[0], user: req.user });
};

const handle_Edit = async (req, res, criteria) => { /* Your implementation */ };
const handle_Update = async (req, res, criteria) => { /* Your implementation */ };
const handle_Delete = async (req, res) => {
  try {
    if (!req.query._id) {
      res.status(400).render('info', { message: "Missing concert ID for deletion!", user: req.user });
      return;
    }

    await client.connect();
    const db = client.db(dbName);
    const result = await deleteDocument(db, { _id: new ObjectId(req.query._id) });

    if (result.deletedCount === 1) {
      res.redirect('/content');
    } else {
      res.status(404).render('info', { message: "Concert not found!", user: req.user });
    }
  } catch (error) {
    console.error("Error deleting concert:", error);
    res.status(500).render('info', { message: "An error occurred while deleting the concert.", user: req.user });
  } finally {
    await client.close();
  }
};

//
//
//

const port = process.env.PORT || 8099;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

