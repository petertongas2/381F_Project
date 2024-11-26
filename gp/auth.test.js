const request = require('supertest');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const formidable = require('express-formidable');
const { MongoClient } = require('mongodb');

describe('驗證測試', () => {
  let app;
  let client;

  beforeAll(async () => {
    app = express();
    
    // 設置中間件順序很重要
    app.use(formidable({
      encoding: 'utf-8',
      keepExtensions: true
    }));

    app.use(session({
      secret: 'test-secret',
      resave: true,
      saveUninitialized: true
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    // 測試用的登入路由
    app.post('/login/local', (req, res) => {
      console.log('登入請求內容:', {
        fields: req.fields,
      });

      if (!req.fields?.username || !req.fields?.password) {
        return res.status(400).json({ error: 'Missing credentials' });
      }
      res.json({ success: true });
    });
  });

  // 測試登入請求
  test('應該成功處理登入表單數據', async () => {
    const response = await request(app)
      .post('/login/local')
      .field('username', 'testuser')
      .field('password', 'password123');

    expect(response.status).not.toBe(400);
  });
});