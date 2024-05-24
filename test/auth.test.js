const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Assuming your Express app is exported from app.js
const User = require('../models/User');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Authentication API', () => {
  let testUser;

  before(async () => {
    
    testUser = await User.create({
      email: 'seemasudhakar143@gmail.com',
      password: 'test123',
      name: 'Test User',
      bio: 'Test bio',
      phone: '9348146253',
      photo: 'http://example.com/photo.jpg',
      isAdmin: false,
      isPublic: true
    });
  });

  after(async () => {
    // Delete the test user after tests
    await User.deleteMany({ email: 'seemasudhakar143@gmail.com' });
  });

  describe('User Registration', () => {
    it('should register a new account', async () => {
      const res = await chai.request(app)
        .post('/auth/register')
        .send({
          email: 'seemasudhakar143@gmail.com',
          password: 'newuser123',
          name: 'New User',
          bio: 'New bio',
          phone: '9876543210'
        });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('token');
    });
  });

  describe('User Login', () => {
    it('should log in with valid credentials', async () => {
      const res = await chai.request(app)
        .post('/auth/login')
        .send({
          email: 'seemasudhakar143@gmail.com',
          password: 'test123'
        });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('token');
    });

    it('should not log in with invalid password', async () => {
      const res = await chai.request(app)
        .post('/auth/login')
        .send({
          email: 'seemasudhakar143@gmail.com',
          password: 'invalidpassword'
        });
      expect(res).to.have.status(401);
      expect(res.body).to.have.property('message', 'Incorrect password.');
    });

    it('should not log in with invalid email', async () => {
      const res = await chai.request(app)
        .post('/auth/login')
        .send({
          email: 'seemasudhakar143@gmail.com',
          password: 'test123'
        });
      expect(res).to.have.status(401);
      expect(res.body).to.have.property('message', 'Incorrect email.');
    });
  });

  describe('User Profile', () => {
    let authToken;

    before(async () => {
      // Log in to get authentication token
      const res = await chai.request(app)
        .post('/auth/login')
        .send({
          email: 'seemasudhakar143@gmail.com',
          password: 'test123'
        });
      authToken = res.body.token;
    });

    it('should get user profile details', async () => {
      const res = await chai.request(app)
        .get('/profile/me')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('email', 'test@example.com');
      
    });

    it('should update user profile details', async () => {
      const res = await chai.request(app)
        .put('/profile/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Name',
          bio: 'Updated bio',
          phone: '9876543210'
        });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('name', 'Updated Name');
      
    });

    it('should set profile as public or private', async () => {
      const res = await chai.request(app)
        .put('/profile/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ isPublic: false });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('isPublic', false);
    });

  });

});
