const emailSchema = require("validator");

module.exports = (req, res, next) => {
  if (!emailSchema.isEmail(req.body.email)) {
    req.invalidEmail = 1;
  } 
  next();
  
};
