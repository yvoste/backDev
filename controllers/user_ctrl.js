/* jshint esversion: 10 */
const bcrypt = require("bcrypt");
const User = require("../models/user_model");
const jwt = require("jsonwebtoken");
var mongoose = require('mongoose');
const password = require("../middleware/password");
var ValidationError = mongoose.Error.ValidationError;
var ValidatorError  = mongoose.Error.ValidatorError;


const signup = async (req, res, next) => { 
  try{
    if(req.invalidEmail && req.invalidEmail == 1){
      const error = {
        "message": "veuillez rentrer un email valide ! ex : michel@gmail.com"
      };
      res.status(401).json(error);
    } else if(req.badPassword && req.badPassword == 1){
        const error = {
          "message":"the password must contain At least one lower and upper case 6 characters min and 20 max 2 digits min no space"
        };
        res.status(401).json(error);
    } else {    
      const user = new User({
        email: req.body.email,
        password: req.body.password,
      });
      
      const salt = await bcrypt.genSalt(Number(process.env.SALT));    
      user.password = await bcrypt.hash(user.password, salt);

      const ret = await user.save();
      console.log(ret);
      if(ret) {   
        res.status(201).json({ message: "Utilisateur créé !" });
      } else {
        const error = {
          "message": "failed to creating user"
        };
        res.status(401).json(error);
      }
    }    
  } catch (error){
    console.log(error);    
    const err = {
      "message": error.info.email
    };
    res.status(error.statusCode).json(err);    
  }
};

  
const login = (req, res, next) => {
  User.findOne({
    // email: maskData.maskEmail2(req.body.email, emailMaskOptions),
    email: req.body.email
  })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: 86400,
            }),
          });
        })
        .catch((error) => res.status(401).json({ error: error }));
    })
    .catch((error) => res.status(401).json({ error: error }));
};

module.exports = {
  signup,
  login
};