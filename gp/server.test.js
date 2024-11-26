const request = require('supertest');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const formidable = require('express-formidable');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const LocalStrategy = require('passport-local').Strategy;

describe('Authentication Tests', () => {
  let app;
  let client;
  let mockUser;

  beforeAll(async () => {
    app = express();
    
    // 中間件配置 - 順序很重要
    app.use(formidable({
      encoding: 'utf-8',
      keepExtensions: true,
      multiples: true
    }));

    app.use(session({
      secret: 'test-secret',
      resave: true,
      saveUninitialized: true
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    // Passport configuration
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));

    // Setup local strategy
    passport.use(new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    }, async (req, username, password, done) => {
      try {
        if (!username || !password) {
          return done(null, false, { message: 'Missing credentials' });
        }
        return done(null, mockUser);
      } catch (err) {
        return done(err);
      }
    }));

    // Test routes
    app.post('/login/local', passport.authenticate('local'), (req, res) => {
      res.json({ success: true });
    });
  });

  beforeEach(() => {
    mockUser = {
      id: '123',
      username: 'testuser',
      type: 'local'
    };
  });

  describe('POST /login/local', () => {
    it('應該處理正確的登入憑證', async () => {
      const response = await request(app)
        .post('/login/local')
        .field('username', 'testuser')
        .field('password', 'password123');

      expect(response.status).toBe(200);
    });

    it('應該拒絕缺少使用者名稱的請求', async () => {
      const response = await request(app)
        .post('/login/local')
        .field('password', 'password123');

      expect(response.status).toBe(401);
    });

    it('應該拒絕缺少密碼的請求', async () => {
      const response = await request(app)
        .post('/login/local')
        .field('username', 'testuser');

      expect(response.status).toBe(401);
    });

    describe('Authentication Integration Tests', () => {
        let app;
        let client;
        describe('Authentication Tests', () => {
            let app;
            let client;
            let db;

        beforeAll(async () => {
            app = express();
  describe('Authentication Flow Tests', () => {
    let app;
    let mockDb;

  describe('POST /login/local', () => {

  // 清理
  afterAll(async () => {
    if (client) {
      await client.close();
    }
  });
});
});