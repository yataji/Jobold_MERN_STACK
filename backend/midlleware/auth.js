const jwt = require("jsonwebtoken");
const JWT_SECRET =
  "qwertyuiop[]asdfghjkl;'zxcvbnm,./hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

//Creation of a middlware that can enter in any request made by our users
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; //get the token from the headers split by ' ' divise the Authorozation header to two parts [0]=>"bearer", [1]=>token
    const decodeToken = jwt.verify(token, JWT_SECRET)//"RANDOM_TOKEN_SECRET"); // decodage of the token with the same key that is created with
    const userId = decodeToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};

//middlware to block access without signing up
module.exports.isAuthentificated = (req, res, next) => {
  req.user || req.session.isAuth
    ? next()
    : res.status(401).json({
        message: "you cannot access, you have to get logged",
      });
};
