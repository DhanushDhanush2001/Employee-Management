const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    mobile:{
        type: String,
        required: true,
    },
    image: {
        type: String
    },
     designation:{
         type: String,
         required: true,
    },
      gender:{
        type: String,
        required: true,
      },
      courses:{
         type: [],
         required: true,
      },
       status: { 
        type: Boolean, 
        default: true 
      },
       createdDate:{
         type: Date,
         default: Date.now()
      },
      id:{
          type: Number,
      }
});

const EmployeeModel =  mongoose.model('employees', EmployeeSchema);
module.exports = EmployeeModel;