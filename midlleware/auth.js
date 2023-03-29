const jwt = require("jsonwebtoken");
//Creation of a middlware that can enter in any request made by our users
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; //get the token from the headers split by ' ' divise the Authorozation header to two parts [0]=>"bearer", [1]=>token
    const decodeToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); // decodage of the token with the same key that is created with
    const userId = decodeToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
