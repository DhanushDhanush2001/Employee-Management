const express = require('express');
const router =  express.Router();
const multer = require('multer');
const path = require('path');


const upload = multer({storage: multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, path.join( __dirname,'..' , 'uploads/user' ) )
  },
  filename: function(req, file, cb ) {
      cb(null, file.originalname)
  }
}) })

const { createEmployee, getEmployee, getSingleEmployee, deleteEmployee, updateEmployee } = require('../Controller/employeeController');
router.route('/create').post(upload.single('image'),createEmployee);
router.route('/getSingleEmployee/:id').get(getSingleEmployee);
router.route('/getEmployee').get(getEmployee);
router.route('/deleteEmployee/:id').delete(deleteEmployee);
router.route('/updateEmployee/:id').put(upload.single('image'),updateEmployee);

module.exports = router;