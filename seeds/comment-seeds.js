const { Comment } = require('../models');

const commentData = [
  {
    comment_text: 'Too many to count! lol',
    user_id: 1,
    post_id: 1,
  },
  {
    comment_text:
      'PC all the way. MAC is too much about their technology, MAC products only. I feel they are more commercial and pcs are about getting the job done in an effecitve way so others can join',
    user_id: 2,
    post_id: 2,
  },
  {
    comment_text: 'All of them and only the good ones!',
    user_id: 3,
    post_id: 3,
  },
];

const seedComments = () => Comment.bulkCreate(commentData);

module.exports = seedComments;