var 	express 					= require('express');
 	passport 					= require('passport');
 	FacebookStrategy 				= require('passport-facebook').Strategy;
 	session 					= require('express-session');
	formidable 					= require('express-formidable');
	fsPromises 					= require('fs').promises;
	app						= express();
	GitHubStrategy 					= require('passport-github').Strategy;
var 	{ MongoClient, ServerApiVersion, ObjectId } 	= require('mongodb');
const bcrypt = require('bcrypt');  // 添加這行
const userCollectionName = 'users';
const flash = require('connect-flash');

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

// 2. 創建初始化函數
async function initializeDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// 3. 修改用戶創建函數
async function createUser(userData) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const result = await db.collection(userCollectionName).insertOne({
      username: userData.username,
      password: userData.password,
      createdAt: new Date(),
      // 初始化這些陣列
      registeredConcerts: [],
      favoriteConcerts: []
    });
    return result;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  } finally {
    await client.close();
  }
}
app.set('view engine', 'ejs');



//passport
//

var user = {};
passport.serializeUser((user, done) => {
  console.log('序列化使用者:', user);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log('反序列化使用者:', user);
  done(null, user);
});

app.use(session({
  secret: "tHiSiSasEcRetStr",
  resave: true,
  saveUninitialized: true
}));

app.use(formidable({
  encoding: 'utf-8',
  uploadDir: './uploads',
  multiples: true,
  keepExtensions: true
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log('Request Body:', {
    fields: req.fields,
    path: req.path
  });
  next();
});
 
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

app.get("/login", (req, res) => {
  res.status(200).render('login', { 
    messages: req.flash(),
    user: req.user || null 
  });
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

// 修改根路由
app.get('/', async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const concerts = await db.collection('concerts')
                           .find({})
                           .toArray();
    
    // 確保傳遞用戶資訊,即使未登入
    res.render('home', { 
      concerts: concerts,
      user: req.user || null  // 如果未登入則傳遞 null
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).render('info', {
      message: '獲取資料時發生錯誤',
      user: req.user || null
    });
  } finally {
    await client.close();
  }
});

app.get('/register', (req, res) => {
  res.render('register', { user: null });
});

app.post('/register', async (req, res) => {
  try {
    const username = req.fields?.username;
    const password = req.fields?.password;
    
    console.log('處理的註冊數據:', {
      username: username,
      password: password ? '已提供' : '未提供'
    });

    if (!username || !password) {
      return res.status(400).render('info', {
        message: '使用者名稱和密碼都是必填欄位',
        user: null
      });
    }

    await client.connect();
    const db = client.db(dbName);
    
    const existingUser = await db.collection(userCollectionName).findOne({ username });
    if (existingUser) {
      return res.status(400).render('info', {
        message: '使用者名稱已存在',
        user: null
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 使用更新後的結構建立使用者
    await db.collection(userCollectionName).insertOne({
      username,
      password: hashedPassword,
      createdAt: new Date(),
      registeredConcerts: [],  // 初始化空陣列
      favoriteConcerts: []    // 初始化空陣列
    });
    
    res.redirect('/login');
  } catch(error) {
    console.error('註冊錯誤:', error);
    res.status(500).render('info', {
      message: '註冊過程發生錯誤',
      user: null
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
});

app.post('/login/local', async (req, res) => {
  try {
    const { username, password } = req.fields;
    
    if (!username || !password) {
      return res.status(400).render('info', {
        message: '請提供使用者名稱和密碼',
        user: null
      });
    }

    await client.connect();
    const db = client.db(dbName);
    
    const user = await db.collection(userCollectionName).findOne({ username });

    if (!user) {
      return res.status(401).render('info', {
        message: '使用者不存在',
        user: null
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).render('info', {
        message: '密碼錯誤',
        user: null
      });
    }

    // 建立 session
    req.session.user = {
      id: user._id,
      username: user.username,
      name: user.username,
      type: 'local'
    };

    res.redirect('/content');

  } catch (error) {
    console.error('登入錯誤:', error);
    res.status(500).render('info', {
      message: '登入過程發生錯誤',
      user: null
    });
  } finally {
    await client.close();
  }
});

// 更新 isLoggedIn middleware
const isLoggedIn = (req, res, next) => {
  if (req.session.user || req.isAuthenticated()) {
    // 合併 session user 和 passport user
    req.user = req.session.user || req.user;
    return next();
  }
  res.redirect('/login');
};

app.use( express.static( "public" ) );

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

// 用戶個人資料頁面
app.get('/profile', isLoggedIn, async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    
    const user = await db.collection(userCollectionName).findOne(
      { username: req.user.username }
    );

    if (!user) {
      return res.status(404).render('info', {
        message: '找不到使用者資料',
        user: req.user
      });
    }

    // 確保陣列存在
    const registeredIds = user.registeredConcerts || [];
    const favoriteIds = user.favoriteConcerts || [];

    // 使用 ObjectId 轉換前先檢查陣列是否為空
    const registeredConcerts = registeredIds.length > 0 
      ? await db.collection(collectionName)
          .find({ _id: { $in: registeredIds.map(id => new ObjectId(id)) } })
          .toArray()
      : [];
      
    const favoriteConcerts = favoriteIds.length > 0
      ? await db.collection(collectionName)
          .find({ _id: { $in: favoriteIds.map(id => new ObjectId(id)) } })
          .toArray()
      : [];

    res.render('profile', {
      user: req.user,
      registeredConcerts,
      favoriteConcerts
    });
  } catch (error) {
    console.error('獲取個人資料錯誤:', error);
    res.status(500).render('info', {
      message: '獲取資料時發生錯誤',
      user: req.user
    });
  } finally {
    await client.close();
  }
});

// 收藏/取消收藏演唱會
app.post('/toggle-favorite', isLoggedIn, async (req, res) => {
  try {
    console.log('收藏請求內容:', req.fields);
    const concertId = req.fields?.concertId || req.body?.concertId;
    
    if (!concertId) {
      console.log('缺少演唱會ID');
      return res.status(400).json({ 
        success: false, 
        message: '缺少演唱會ID' 
      });
    }

    await client.connect();
    const db = client.db(dbName);
    
    // 查找使用者
    const user = await db.collection(userCollectionName).findOne({ 
      username: req.user.username 
    });

    if (!user) {
      console.log('找不到使用者');
      return res.status(404).json({
        success: false,
        message: '找不到使用者'
      });
    }

    // 初始化收藏陣列（如果不存在）
    if (!user.favoriteConcerts) {
      await db.collection(userCollectionName).updateOne(
        { username: req.user.username },
        { $set: { favoriteConcerts: [] } }
      );
    }

    // 檢查演唱會是否已收藏
    const favoriteConcerts = user.favoriteConcerts || [];
    const isFavorited = favoriteConcerts.includes(concertId);
    
    // 更新收藏狀態
    let updateResult;
    if (isFavorited) {
      updateResult = await db.collection(userCollectionName).updateOne(
        { username: req.user.username },
        { $pull: { favoriteConcerts: concertId } }
      );
    } else {
      updateResult = await db.collection(userCollectionName).updateOne(
        { username: req.user.username },
        { $addToSet: { favoriteConcerts: concertId } }
      );
    }

    if (updateResult.modifiedCount === 0) {
      throw new Error('更新失敗');
    }

    console.log('收藏操作成功:', !isFavorited);
    res.json({ 
      success: true, 
      isFavorited: !isFavorited 
    });

  } catch (error) {
    console.error('收藏操作失敗:', error);
    res.status(500).json({ 
      success: false, 
      message: '收藏操作失敗' 
    });
  } finally {
    await client.close();
  }
});

// 重設密碼
app.get('/reset-password', isLoggedIn, (req, res) => {
  res.render('reset-password', { user: req.user });
});

app.post('/reset-password', isLoggedIn, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.fields;
    
    if (newPassword !== confirmPassword) {
      return res.status(400).render('info', {
        message: '新密碼與確認密碼不符',
        user: req.user
      });
    }

    await client.connect();
    const db = client.db(dbName);
    const user = await db.collection(userCollectionName)
      .findOne({ username: req.user.username });

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).render('info', {
        message: '目前密碼錯誤',
        user: req.user
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await db.collection(userCollectionName).updateOne(
      { username: req.user.username },
      { $set: { password: hashedNewPassword } }
    );

    req.flash('success', '密碼已成功更新');
    res.redirect('/profile');
  } catch (error) {
    console.error('重設密碼錯誤:', error);
    res.status(500).render('info', {
      message: '重設密碼時發生錯誤',
      user: req.user
    });
  } finally {
    await client.close();
  }
});


app.get('/*', (req, res) => {
  res.status(404).render('info', { 
    message: `${req.path} - Unknown request!`, 
    user: req.user || null 
  });
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
  try {
    await client.connect();
    const db = client.db(dbName);
    
    // 獲取使用者的收藏清單
    const user = await db.collection(userCollectionName).findOne({ 
      username: req.user.username 
    });
    const favoriteIds = user.favoriteConcerts || [];
    
    // 查詢所有演唱會
    const concerts = await findDocument(db, criteria);
    
    const concertsWithFavoriteStatus = concerts.map(concert => ({
      ...concert,
      isFavorited: favoriteIds.includes(concert._id.toString())
    }));

    res.render('list', { 
      user: req.user, 
      concerts: concertsWithFavoriteStatus 
    });
    
  } catch (error) {
    console.error('獲取演唱會列表失敗:', error);
    res.status(500).render('info', {
      message: '獲取資料時發生錯誤',
      user: req.user
    });
  } finally {
    await client.close();
  }
};

const handle_Create = async (req, res) => {
  await client.connect();
  const db = client.db(dbName);

  const newConcert = {
    title: req.fields.title,
    date: req.fields.date,
    location: req.fields.location,
    description: req.fields.description,
    ticketFee: req.fields.ticketFee,
    time: req.fields.time,
    content: req.fields.content,
    artist: req.fields.artist,
  };

  await insertDocument(db, newConcert);

  await client.close();

  res.redirect('/content');
};

const handle_Details = async (req, res, criteria) => {
  await client.connect();
  const db = client.db(dbName);

  const concert = await findDocument(db, { _id: new ObjectId(criteria._id) });


  await client.close();

  res.render('details', { concert: concert[0], user: req.user });
};

const handle_Edit = async (req, res, criteria) => {
  try {
    if (!criteria._id) {
      res.status(400).render('info', { message: "Missing concert ID!", user: req.user });
      return;
    }

    await client.connect();
    const db = client.db(dbName);
    const concert = await findDocument(db, { _id: new ObjectId(criteria._id) });

    if (concert.length === 0) {
      res.status(404).render('info', { message: "Concert not found!", user: req.user });
      return;
    }

    res.render('edit', { concert: concert[0], user: req.user });
  } catch (error) {
    console.error("Error in edit:", error);
    res.status(500).render('info', { message: "Database error!", user: req.user });
  } finally {
    await client.close();
  }
};
const handle_Update = async (req, res) => {
  try {
    if (!req.query._id) {
      res.status(400).render('info', { 
        message: "Missing concert ID!", 
        user: req.user || null 
      });
      return;
    }

    const updateData = {
      title: req.fields.title,
      date: req.fields.date,
      location: req.fields.location,
      description: req.fields.description,
      ticketFee: req.fields.ticketFee, 
	    time: req.fields.time, 
	    content: req.fields.content, 
	    artist: req.fields.artist,
    };

    await client.connect();
    const db = client.db(dbName);
    const result = await updateDocument(db, 
      { _id: new ObjectId(req.query._id) },
      updateData
    );

    if (result.modifiedCount === 1) {
      res.redirect('/content');
    } else {
      res.status(404).render('info', { message: "Concert not found or no changes made!", user: req.user });
    }
  } catch (error) {
    console.error("Error updating concert:", error);
    res.status(500).render('info', { 
      message: "Database error!", 
      user: req.user || null 
    });
  }
};
const handle_Delete = async (req, res) => {
  try {
    if (!req.query._id) {
      res.status(400).render('info', { 
        message: "Missing concert ID for deletion!", 
        user: req.user || null 
      });
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
    res.status(500).render('info', { 
      message: "An error occurred while deleting the concert.", 
      user: req.user || null 
    });
  }
};

//
//
//

const port = process.env.PORT || 8099;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

