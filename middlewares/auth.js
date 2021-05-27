const jwt = require("jsonwebtoken");

// Middlewares which checks for user token in request header

// @middleware
// @desc Authenticating user with JWT
// access Public
function auth(req, res, next) {
  const header = req.headers["authorization"];
  const bearer = header ? header.split(" ") : [];
  const token = bearer[1] ? bearer[1] : null;

  // Check for token
  if (!token) {
    res.status(401).json({ msg: "No token!!! Authorization denied" });
  }

  jwt.verify(token, "secretkey", (err, data) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Token expired or invalidated !!" });
    } else {
      next();
    }
  });
}

module.exports = auth;
