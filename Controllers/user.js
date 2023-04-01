const User = require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const imaps = require("imap-simple");
const bcrypt = require("bcrypt");

exports.signup = (req, res, next) => {
  // Generate confirmation code
  const confirmationCode = Math.floor(Math.random() * 1000000);

  // Hash password and save user to database
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        password: hash,
        gender: req.body.gender,
        country: req.body.country,
        city: req.body.city,
        streetAddress: req.body.streetAddress,
        secondStreetAddress: req.body.secondStreetAddress,
        zipCode: req.body.zipCode,
      });
      user
        .save()
        .then(() => {
          // Send confirmation email
          // console.log("1");
          const transporter = nodemailer.createTransport({
            host: "smtp.live.com",
            port: 587,
            secure: false,
            auth: {
              user: "yassinoubil3@hotmail.fr",
              pass: "1337Yassinetaji@",
            },
          });
          // console.log("2");
          const info = transporter
            .sendMail(
              {
                from: "yassinoubil3@hotmail.fr",
                to: user.email,
                subject: "Confirm your email",
                text: `Please use the following code to confirm your email: ${confirmationCode}`,
              },
              // console.log("yassine")
            )
            .then(() => {
              console.log("Confirmation email sent.");

            //   // Connect to IMAP server and search for confirmation email
            //   const config = {
            //     imap: {
            //       user: "yassine_taji@​yahoo.com",
            //       password: "www.100705pama",
            //       host: "imap.mail.yahoo.com",
            //       port: 993,
            //       tls: true,
            //       authTimeout: 3000,
            //     },
            //   };

            //   imaps.connect(config).then((connection) => {
            //     const searchCriteria = {
            //       from: "yassine_taji@​yahoo.com",
            //       subject: "Confirm your email",
            //     };
            //     const fetchOptions = {
            //       bodies: ["HEADER", "TEXT"],
            //     };

            //     connection
            //       .search(searchCriteria, fetchOptions)
            //       .then((results) => {
            //         const message = results[0].parts
            //           .filter((part) => part.which === "TEXT")
            //           .map((part) => part.body)
            //           .join("");

            //         if (message.includes(confirmationCode)) {
            //           console.log("Email confirmed.");
            //           res.status(200).json({ message: "Email confirmed." });
            //         } else {
            //           console.log("Incorrect confirmation code.");
            //           res.status(400).json({
            //             error: "Incorrect confirmation code.",
            //           });
            //         }
            //         connection.end();
            //       })
            //       .catch((err) => {
            //         console.error(err);
            //         res.status(500).json({ error: "Error confirming email." });
            //       });
            //   });
            })
            .catch((err) => {
              console.error(err);
              res
                .status(500)
                .json({ error: "Error sending confirmation email." });
            });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: "Error saving user." });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Error hashing password." });
    });
};

exports.login = (req, res, next) => {
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
        res.status(200).json({
          userId: user._id,
          token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
            expiresIn: "6h",
          }),
        });
      });
    })
    .catch((error) => res.status(500).json({ error }));
};
