/**
 *  Routes
 */
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-conf");
const verifyForm = require("../middleware/checkForm");

const saucesCtrl = require("../controllers/sauce_ctrl");

router.post("", auth, multer, verifyForm, saucesCtrl.createSauce);
router.get("", auth, saucesCtrl.getAllSauce);
router.get("/:id", auth, saucesCtrl.getOneSauce);
router.put("/:id", auth, multer, verifyForm, saucesCtrl.modifySauce);
router.delete("/:id", auth, saucesCtrl.deleteSauce);
router.post("/:id/like", auth, saucesCtrl.likeSauce);

module.exports = router;
