const chai = require('chai');
const mongoose = require('mongoose');
const User = require('../models/UserModel')

describe('User model', () => {
  it('should require a name', () => {
    const user = new User({
      email: 'test@example.com',
      password: 'password',
    });
    const error = user.validateSync();
    chai.expect(error.errors.name.message).to.equal('Path `name` is required.');
  });

  it('should require an email', () => {
    const user = new User({
      name: 'Test',
      password: 'password',
    });
    const error = user.validateSync();
    chai.expect(error.errors.email.message).to.equal('Path `email` is required.');
  });

  it('should require a unique email', () => {
    const user1 = new User({
      name: 'Test',
      email: 'test@example.com',
      password: 'password',
    });
    user1.save();

    const user2 = new User({
      name: 'Test',
      email: 'test@example.com',
      password: 'password',
    });
    const error = user2.validateSync();
    chai.expect(error.errors.email.message).to.equal('Error, expected `email` to be unique. Value: `test@example.com`');
  });
});
