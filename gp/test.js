const request = require('supertest');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const formidable = require('express-formidable');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

// server.test.js

describe('Authentication Tests', () => {
  let app;
  let client;

  beforeAll(async () => {
    app = express();
    
    // 配置中間件
    app.use(session({
      secret: 'test-secret',
      resave: false,
      saveUninitialized: false
    }));

    app.use(formidable({
      encoding: 'utf-8',
      uploadDir: './uploads',
      multiples: true
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    // 連接測試數據庫
    client = await MongoClient.connect('mongodb://localhost:27017/test');
  });

  afterAll(async () => {
    await client.close();
  });

  // 測試註冊功能
  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/register')
        .field('username', 'testuser')
        .field('password', 'password123');

      expect(response.status).toBe(302);
      expect(response.header.location).toBe('/login');
    });
  });

  // 測試登入功能
  describe('POST /login/local', () => {
    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/login/local')
        .field('username', 'testuser')
        .field('password', 'password123');

      expect(response.status).toBe(302);
      expect(response.header.location).toBe('/content');
    });

    it('should fail with missing credentials', async () => {
      const response = await request(app)
        .post('/login/local')
        .field('username', '')
        .field('password', '');

      expect(response.status).toBe(400);
      expect(response.text).toContain('Missing credentials');
    });

    it('should fail with incorrect password', async () => {
      const response = await request(app)
        .post('/login/local')
        .field('username', 'testuser')
        .field('password', 'wrongpassword');

      expect(response.status).toBe(401);
      expect(response.text).toContain('密碼錯誤');
    });
  });

  // 測試表單數據處理
  describe('Form Data Handling', () => {
    it('should process form data correctly', async () => {
      const response = await request(app)
        .post('/login/local')
        .type('form')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(response.status).not.toBe(400);
    });
  });
});

// 修復建議：在 server.js 中，確保 LocalStrategy 的配置正確
/*
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async function(req, username, password, done) {
  if (!username || !password) {
    return done(null, false, { message: 'Missing credentials' });
  }
  // ... 其餘驗證邏輯
}));
*/// server.js - Move formidable middleware BEFORE all routes
app.use(formidable({
  keepExtensions: true,
  encoding: 'utf-8',
    uploadDir: './uploads',
    multiples: true
}));

// Update other middleware order
app.use(session({
    secret: "tHiSiSasEcRetStr",
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('info', {
        message: 'Something broke!',
        user: req.user || null
    });
});

// Add logging middleware
app.use((req, res, next) => {
    console.log('Request Body:', req.fields);
    next(); 
});