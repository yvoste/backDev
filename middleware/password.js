const passSchema = require("../models/pswd_model");

module.exports = (req, res, next) => {
  if (!passSchema.validate(req.body.password)) {
    req.badPassword = 1;    
  }
  next();
};