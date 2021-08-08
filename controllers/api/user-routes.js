
const router = require('express').Router();

const { User, Post, Comment } = require('../../models');


const session = require('express-session');


const withAuth = require('../../utils/auth');

const SequelizeStore = require('connect-session-sequelize')(session.Store);


router.get('/', (req, res) => {
 
  User.findAll({
    
    attributes: { exclude: ['password'] },
  })
    
    .then((dbUserData) => res.json(dbUserData))
    
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});


router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { exclude: ['password'] },
    
    where: {
      id: req.params.id,
    },
    
    include: [
      {
        model: Post,
        attributes: ['id', 'title', 'content', 'created_at'],
      },

      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: Post,
          attributes: ['title'],
        },
      },
    ],
  })
    .then((userData) => {
      if (!userData) {
  
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }

      res.json(userData);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});


router.post('/', (req, res) => {
  User.create({
    username: req.body.username,
    password: req.body.password,
  })

    .then((userData) => {
      req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.username = userData.username;
        req.session.loggedIn = true;

        res.json(userData);
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});


router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { username: req.body.username },
    });

    if (!userData) {
      res.status(400).json({ message: 'No user with that username!' });
      return;
    }
  
    const validPassword = userData.checkPassword(req.body.password);

  
    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }
    req.session.save(() => {
  
      req.session.user_id = userData.id;
      req.session.username = userData.username;
      req.session.loggedIn = true;

      res.json({ user: userData, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
     
      res.status(204).end();
    });
  } else {
    
    res.status(404).end();
  }
});


router.put('/:id', withAuth, (req, res) => {
  User.update(req.body, {
   
    individualHooks: true,
    
    where: {
      id: req.params.id,
    },
  })
    .then((userData) => {
      if (!userData[0]) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(userData);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// Delete an existing user
router.delete('/:id', (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((userData) => {
      if (!userData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(userData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
