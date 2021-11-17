const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const mongooseErrors = require("mongoose-errors");

const validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const userSchema = mongoose.Schema({
  email: { 
    type: String, 
    required: true,
    unique: true,
    validate: [validateEmail, 'Please fill a valid email address']
  },
  password: { 
    type: String,
    required: true
   },
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(mongooseErrors);

module.exports = mongoose.model("User", userSchema);
