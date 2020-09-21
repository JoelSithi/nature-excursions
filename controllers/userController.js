const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require ('./../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if(allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Adding a /me endpoint:
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

//2) ROUTE HANDLERS (Handling GET requests):
exports.getAllUsers = factory.getAll(User);
//catchAsync(async (req, res, next) => {
 // const users = await User.find();
    
  // SEND THE RESPONSE:
  //  res.status(200).json({
   //   status:'success',
  //    results: users.length,
  //    data: {
  //      users
  //    }
   // });
//});

// Updating the current user data:
exports.updateMe = catchAsync(async(req, res, next) => {
  // 1) create error if user POSTs password data:
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. Please use /updateMyPassword', 400))
  }


  // 2) Filtered out unwanted fields names that are not allowed to be updated:
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document:
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true, 
    runValidators: true
  });

  res.status(200).json({
    status: 'success', 
    data: {
      user: updatedUser
    }
  });
});

// Delete user:
exports.deleteMe = catchAsync(async(req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false})

  res.status(204).json({
  status: 'success', 
  data: null
  });
});

exports.getUser = factory.getOne(User);

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error', 
    message: 'This route is not yet defined. Use /signup instead'
  });
};

// Do Not update password with this!
exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
