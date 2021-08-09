const { User } = require('../models');

const userData = [
  {
    username: 'Dariush',
    password: '123456789',
  },
  {
    username: 'Shirin',
    password: 'password1',
  },
  {
    username: 'Soraya',
    password: 'password4',
  },
];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;