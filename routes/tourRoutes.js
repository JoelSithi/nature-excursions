
const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');


const router = express.Router();

//router.param('id', tourController.checkID);

// Implementing Nested Routes
//router
//.route('/:tourId/reviews')
//.post(
 // authController.protect,
  //authController.restrictTo('user'),
  //reviewController.createReview
//);

// Nested Routes with Express:
router.use('/:tourId/reviews', reviewRouter);

//tours route:
router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);

// Aggregate pipeline routes:
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(authController.protect, authController.restrictTo('admin', 'lead-guide', 'guide'), tourController.getMonthlyPlan);

// Geospatial queries route:
router.route('/tours-within/:distance/center/:latlng/unit/:unit')
      .get(tourController.getToursWithin); // or we can do : /tours-within?distance=233&center=-40,45&unit=mi

// Geospatial  aggregation calculate distances route:
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.updateTour)
  .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

// Implementing Nested Routes
//router
//.route('/:tourId/reviews')
//.post(
 // authController.protect,
  //authController.restrictTo('user'),
  //reviewController.createReview
//);

module.exports = router;