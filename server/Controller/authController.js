const catchAsyncError = require('../Middleware/catchAsyncError');
const User = require('../Models/userModels');
const sendToken = require('../Utils/jwt');


// Register User - /api/v1/register

exports.registerUser = catchAsyncError(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
  
      if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required." });
      }
      
      const user = await User.create({
        name: username,
        email,
        password,
      });
  
      sendToken(user, 201, res);
    } catch (error) {
      next(error);
    }
  });
  


// Login User - /api/v1/login
exports.loginUser = catchAsyncError(async(req,res,next) => {
    try{
    const {email,password} = req.body

    if(!email || !password) {
        return next(('please enter email & password',400))
    }
    // finding user from Database
    const user = await User.findOne({email}).select('+password')

    if(!user){
        return next(('invalid Email or Password',401))
    }
    if(! await user.isValidPassword(password)){
        return next(('Invalid email or password',401))
    }

     sendToken(user, 201, res,)
  } catch(error){
    next(error)
  }
})

// Logout - /api/v1/logout
exports.logoutUser = (req,res,next) =>{
    res.cookie('token',null,{
        expires: new Date(Date.now()),
        httpOnly : true,
      })
      .status(200)
      .json({
        success:true,
        message: 'Logged out'
      })
}
