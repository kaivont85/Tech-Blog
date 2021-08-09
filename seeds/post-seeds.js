const { Post } = require('../models');

const postData = [
  {
    title: 'javscript help',
    content:
      'How many different functions could there be??? ',
    user_id: 1,
  },
  {
    title: 'PC or MAC',
    content:
      'This topic is always a hot discussion, but what is your biggest reason for using your choice of machine?',
    user_id: 2,
  },
  {
    title: 'Tech Jobs',
    content:
      'Would it not be nice to just have a place to go to that was just handing out jobs in this field left and right? let me know what you think is the best language to learn',
    user_id: 3,
  },
];

const seedPosts = () => Post.bulkCreate(postData);

module.exports = seedPosts;