const catchAsyncError = require('../Middleware/catchAsyncError');
const sendToken = require('../utils/jwt');
const Employee = require('../Models/EmployeeModel');
const path = require('path')

// Create Employee - /api/v1/CreateEmployee
exports.createEmployee = catchAsyncError(async (req, res, next) => {
    let image;
  
    let BASE_URL = process.env.BACKEND_URL;
    if (process.env.NODE_ENV === "production") {
      BASE_URL = `${req.protocol}://${req.get('host')}`;
    }
  
    if (req.file) {
      image = `${BASE_URL}/uploads/user/${req.file.originalname}`;
    } const employees = await Employee.find({});
    // Create the employee record
    const courses = req.body.courses ? JSON.parse(req.body.courses) : [];

    const employee = await Employee.create({
        ...req.body,
        id: employees.length + 1,
        courses,
        image,
    });
  
    // Parse courses array if it is sent as a JSON string
  
    // Create the employee record
   
  
    res.status(200).json({
      success: true,
      employee,
    });
  });

// Get single Employee - /api/v1/getSingleEmployee

exports.getSingleEmployee = catchAsyncError(async(req,res,next) => {
    const employee = await Employee.findById(req.params.id)
    if (!employee) {
        return next((`Employee not Found with this Id ${req.params.id}`,404))
    }
    res.status(200).json({
        success: true,
        employee
    })
})

// Get All Employee - /api/v1/getSingleEmployee

exports.getEmployee = catchAsyncError(async(req,res,next) => {
    const employee = await Employee.find();

    res.status(200).json({
        success: true,
        employee
    })
})

// Delete Employee - api/v1/deleteEmployee/:id

exports.deleteEmployee = catchAsyncError(async(req,res,next) => {
    const employee = await Employee.findById(req.params.id)
    if (!employee) {
        return next((`Employee not Found with this Id ${req.params.id}`,404))
    }
    await employee.deleteOne();
     res.status(200).json({
        success: true
     })
})

// Update Employee - api/v1/updateEmployee/:id

// Update Employee - /api/v1/updateEmployee/:id
exports.updateEmployee = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    let newUserData = {
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      designation: req.body.designation,
      gender: req.body.gender,
      courses: req.body.courses ? JSON.parse(req.body.courses) : [], // Parse courses array
      status: req.body.status,
      image: req.body.image,
    };
  
    let image;
    let BASE_URL = process.env.BACKEND_URL;
    if (process.env.NODE_ENV === "production") {
      BASE_URL = `${req.protocol}://${req.get('host')}`;
    }
  
    if (req.file) {
      image = `${BASE_URL}/uploads/user/${req.file.originalname}`;
      newUserData = { ...newUserData, image };
    }
  
    // Update the employee in the database
    const updatedEmployee = await Employee.findByIdAndUpdate(id, newUserData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure that validation rules are applied
    });
  
    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }
  
    res.status(200).json({
      success: true,
      employee: updatedEmployee,
    });
  });