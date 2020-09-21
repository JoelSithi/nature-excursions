const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');


const router = express.Router();

// users route:
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Password reset functionality's routes:
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware:
router.use(authController.protect);

// Updating the current user's password route:
router.patch('/updateMyPassword', authController.updatePassword);

// Adding a /me endpoint route:
router.get('/me', userController.getMe, userController.getUser);

// Updating the current user data's route:
router.patch('/updateMe', userController.updateMe );

// Delete user's route:
router.delete('/deleteMe', userController.deleteMe );

//Only admins can do the following actions after this :
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);


  module.exports = router;