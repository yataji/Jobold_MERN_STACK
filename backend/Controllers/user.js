const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const ObjectId = require("mongodb").ObjectId;
const MailGen = require("mailgen");
const { Vonage } = require("@vonage/server-sdk");
require("dotenv").config();
// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const vonage = new Vonage({
  apiKey: "865f7bee",
  apiSecret: "tJVzHKy90P84pzcZ",
});

//Signup route with only the necessary fields
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then(async (hash) => {
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash,
        phoneNumber: req.body.phoneNumber,
      });
      user
        .save()
        .then(() => {
          res.status(201).json({
            message: "user created successfully",
          });
          next();
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({
            message: "Error while creating ",
            error,
          });
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error while hashing password ",
        error,
      });
    });
};

//save the location of the user
exports.saveLocation = (req, res) => {
  const { id } = req.params;
  User.findById({ _id: new ObjectId(id) })
    .then((user) => {
      if (user) {
        User.updateOne(
          { _id: id },
          { country: req.body.country, city: req.body.city },
          { _id: id }
        )
          .then(() => {
            res.status(200).json({
              message: "location set correctly and user has been modified",
              success: true,
            });
          })
          .catch((err) => {
            res.status(401).json({
              message: "Error while updating user ",
              success: false,
              err,
            });
          });
      } else {
        res.status(401).json({
          message: "User dosent exist",
          success: false,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Internal server Error",
        err,
      });
    });
};

//Independante route because we will send the email verification after signing up
exports.sendEmailVerification = async (req, res) => {
  const { id } = req.params;
  User.findById({ _id: new ObjectId(id) })
    .then(async (user) => {
      if (user) {
        //generate a link expired after 5min with jwt
        const secret = user._id + process.env.JWT_SECRET;
        const tokenCode = jwt.sign(
          { email: user.email, id: user._id },
          secret,
          {
            expiresIn: "5m",
          }
        );
        const link = `https://localhost:5000/user/email-verify/${id}/${tokenCode}`;
        //create a smtp gmail transporter
        try {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              type: "OAuth2",
              user: "jjobold@gmail.com",
              clientId: process.env.CLIENT_ID,
              clientSecret: process.env.CLIENT_SECRET,
              accessToken:
                "ya29.a0Ael9sCML2cZ97uBDGRZK7dDxzN8UhcN_aZOOiWGDH8-ogL-OG9W9NUV1O2RMel8UXKKhE9nS54mUq-3ytjYoawUBT0KVgSiUiYLvXS1CjDmL2gt8uuWpEcRMmb_Pba4YBysVN393ObteDvi0V2FegyZ4h72LaCgYKARASARMSFQF4udJhs7N39JFsM2ws-oJFyRueAA0163",
            },
            tls: {
              rejectUnauthorized: false,
            },
          });

          const mailOptions = {
            from: "jjobold@gmail.com",
            to: user.email,
            subject: "Confirm your email",
            html:
              "<h1>Hello from JOBOLD </h1>" +
              `<p>Please click the following link to confirm your email: ${link}</p>`,
          };

          transporter
            .sendMail(mailOptions)
            .then(() => {
              res.status(200).json({
                message: `email sent to ${user.email} with success`,
              });
            })
            .catch((err) => console.log(err));
        } catch (error) {
          console.log(error);
        }
      } else {
        res.status(401).json({
          message: "User not found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Internal server Error",
        err,
      });
    });
};

//verify email
exports.verifyEmail = (req, res) => {
  //get the id and the verification code both are hashed from the url params
  const { id, tokenCode } = req.params;
  //search for the user in order to verify the mail
  //our body include the user id and the code confirmation "not hashed"
  User.findById((_id = new ObjectId(id)))
    .then((user) => {
      try {
        const secret = user._id + process.env.JWT_SECRET;
        const verify = jwt.verify(tokenCode, secret);
        if (verify && user) {
          User.updateOne({ _id: id }, { emailVerified: true })
            .then(() => {
              //affiche this response that indicate everything works okay
              res.status(200).json({
                message: "Email has been verified",
                success: true,
              });
            })
            .catch((err) => {
              //there is some problem
              res.status(500).json({
                message: "Email has not verified",
                success: false,
                res,
                err,
              });
            });
        } else {
          res.status(401).json({
            message: "User not found",
            err,
          });
        }
      } catch (error) {
        console.log(error);
        return res.status(500).json({ err, message: "internal error" });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Internal server Error",
        err,
      });
    });
};
exports.profileType = (req, res) => {
  const { profilType } = req.body;
  const { id } = req.params;
  User.findById({ _id: new ObjectId(id) })
    .then((user) => {
      if (user) {
        if (profilType) {
          User.updateOne({ _id: id }, { profilType: profilType }, { _id: id })
            .then(() => {
              res.status(200).json({
                message:
                  "profile type set correctly and user has been modified",
                success: true,
              });
            })
            .catch((err) => {
              res.status(401).json({
                message: "Error while updating user ",
                success: false,
                err,
              });
            });
        } else {
          res.status(500).json({
            message: "request is null",
            req,
            success: false,
          });
        }
      } else {
        res.status(401).json({
          message: "User dosent exist",
          success: false,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Internal server Error",
        err,
      });
    });
};
exports.login = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Both email/password incorrect" });
        //we don't have to annoce that the user is not in our database (security concepts)
      }
      bcrypt.compare(req.body.password, user.password).then((valid) => {
        if (!valid) {
          return res
            .status(401)
            .json({ message: "Both email/password incorrect" });
        }

        (req.session.isAuth = true), (req.session.user = user);
        res.status(200).json({
          userId: user._id,
          session: req.session.isAuth,
          token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "6h",
          }),
        });
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

//CREATE A LINK AND SEND EMAIL TO CHANGE PASSWORD AND SET A TOKEN EXPIRED IN 5 MIN
exports.reset = async (req, res) => {
  try {
    const oldUser = await User.findOne({ email: req.body.email });
    if (!oldUser) {
      return res.send("User Not Exist");
    }
    const secret = process.env.JWT_SECRET + oldUser.password;
    const tokenR = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });
    const link = `http://localhost:5000/user/reset_password/${oldUser._id}/${tokenR}`;
    const accountR = await nodemailer.createTestAccount();
    var transporter = nodemailer.createTransport({
      host: accountR.smtp.host,
      port: accountR.smtp.port,
      secure: accountR.smtp.secure,
      auth: {
        user: accountR.user,
        pass: accountR.pass,
      },
    });

    var mailOptions = {
      from: accountR.user,
      to: oldUser.email,
      subject: "Password Reset",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res
      .status(200)
      .json({ link, message: "Click this link to reset your password" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "Error " });
  }
};
// GET PAGE WITH THE LINK AND VEREFY THE TOKEN IF EXPIRED OR NO
exports.resPass = async (req, res, next) => {
  const { id, tokenR } = req.params;
  console.log(req.params);
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.status(401).json({ message: "user not found" });
  }
  const secret = process.env.JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(tokenR, secret);
    if (verify)
      return res.status(200).json({
        verify,
        message: "link clicked and account verified with success",
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ err, message: "internal error" });
  }
};

// NEW PASSWORD VERIFY TOKEN CRYPT NEWPASS CHANGE PASS
exports.newPass = async (req, res) => {
  const { id, tokenR } = req.params;
  const { password, confirmpass } = req.body;
  console.log(password);
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.send("User Not Exist");
  }
  const secret = process.env.JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(tokenR, secret);
    if (password === confirmpass && verify) {
      const cryptpass = await bcrypt.hash(password, 10);
      await User.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            password: cryptpass,
          },
        }
      );
    }
    return res.status(200).json({ message: "password updated with success" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error, message: "error while updating user" });
  }
};

exports.sendPinCode = (req, res) => {
  const id = req.params.id;
  User.findById({ _id: new ObjectId(id) })
    .then((user) => {
      if (user) {
        phoneNumber = user.phoneNumber;
        console.log(phoneNumber);
        vonage.verify
          .start({
            number: phoneNumber,
            brand: "JOBOLD",
          })
          .then((resp) =>
            User.updateOne(
              { _id: id },
              { request_id: resp.request_id, _id: id }
            )
              .then(() => {
                res.send({
                  message: "2fa verification sent",
                  resp,
                });
              })
              .catch((err) => {
                res.json({ resp, err, message: "error while updating user" });
              })
          )
          .catch((err) =>
            res.json({ err, message: "error while sending code" })
          );
      } else {
        res.status(500).json({
          message: "not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
};

exports.verifyPinCode = (req, res) => {
  const { token } = req.body;
  const id = req.params.id;
  User.findById({ _id: new ObjectId(id) })
    .then((user) => {
      if (user) {
        vonage.verify
          .check(user.request_id, token)
          .then((resp) => {
            if (resp.status == 0) {
              User.updateOne({ _id: id }, { numberVerified: true, _id: id })
                .then(() => {
                  res.status(200).json({
                    message: "user totp verified",
                  });
                })
                .catch((err) => {
                  res.json(400).json({
                    message: "error while updating user",
                    err,
                  });
                });
            } else {
              res.status(300).json({
                message: "code pin not valid",
              });
            }
          })
          .catch((err) => console.error(err));
      } else {
        res.status(500).json({
          message: "not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
};
