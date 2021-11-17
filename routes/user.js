const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user_ctrl");
const verifyPassword = require("../middleware/password");
const verifyEmail = require("../middleware/email");

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes
  max: 3, // limit each IP to 3 requests per windowMs
  message: "trop de requete abusive , vous devez attendre 3 minutes",
});

router.post("/signup", verifyEmail, verifyPassword, userCtrl.signup);
/**
 *  Equivalent à 
 *  router.post("/signup", verifyEmail);
 *  router.post("/signup", verifyPassword);
 *  router.post("/signup", userCtrl.signup);
 */

router.post("/login", limiter, userCtrl.login);
/**
 *  Equivalent à 
 *  router.post("/login", limiter);
 *  router.post("/login", userCtrl.login);
 */

module.exports = router;
