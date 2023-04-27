const express = require("express");
const router = express.Router();
const userCtrl = require("../Controllers/user");

//signup route
router.post("/signup", userCtrl.signup);
//save the location information
router.post("/location/:id", userCtrl.saveLocation);
//send code to the number phone route
router.post("/2fa-send/:id", userCtrl.sendPinCode);
// verification of that code
router.post("/2fa-verify/:id", userCtrl.verifyPinCode);
//sending mail verification
router.post("/send-mail/:id", userCtrl.sendEmailVerification);
// we need a route of verification mail
router.get(`/email-verify/:id/:tokenCode`, userCtrl.verifyEmail);
//route for saving the profile type
router.post("/profiltype/:id", userCtrl.profileType);
//login route
router.post("/login", userCtrl.login);
//route to reset password
router.post("/forget_password", userCtrl.reset);
//getting the link to reset the password
router.get(`/reset_password/:id/:tokenR`, userCtrl.resPass);
//post route to indentify the new password
router.post(`/reset_password/:id/:tokenR`, userCtrl.newPass);
//logout password
router.post("/logout", userCtrl.logout);

module.exports = router;
