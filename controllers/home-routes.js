const router = require('express').Router();
const { Post, User, Comment } = require('../models');


router.get('/', async (req, res) => {
  try {
    
    const postData = await Post.findAll({
      attributes: ['id', 'title', 'content', 'created_at'],
      include: [
        {
          model: Comment,
          attributes: [
            'id',
            'comment_text',
            'post_id',
            'user_id',
            'created_at',
          ],
         
          order: [['created_at', 'DESC']],

          
          include: { model: User, attributes: ['username'] },
        },
        {
          model: Comment,
          attributes: [
            'id',
            'comment_text',
            'post_id',
            'user_id',
            'created_at',
          ],
          include: {
            model: User,
            attributes: ['username'],
          },
        },
      ],
    });

    
    const posts = postData.map((post) => post.get({ plain: true }));

    console.log("posts", posts)
    console.log(req.session.loggedIn)
    res.render('homepage', {
      posts,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//LOGIN
router.get('/login', (req, res) => {
  
  if (req.session.loggedIn) {
    res.redirect('/dashboard');
    return;
  }
  res.render('login');
});

//SIGNUP
router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/dashboard');
    return;
  }
  res.render('signup');
});

//POST
router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'content', 'title', 'created_at'],
      include: [
        {
          model: Comment,
          attributes: [
            'id',
            'comment_text',
            'post_id',
            'user_id',
            'created_at',
          ],
          include: { model: User, attributes: ['username'] },
        },
        {
          model: Comment,
          attributes: [
            'id',
            'comment_text',
            'post_id',
            'user_id',
            'created_at',
          ],
         
        },
      ],
    });

    
    if (!postData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }
    // Serialize the post data
    const post = postData.get({ plain: true });

    //Past data into template
    res.render('single-post', {
      post,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
module.exports = router;