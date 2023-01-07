const jwt = require("jsonwebtoken");

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "11m" });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

function generateToken() {
  return Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
}

module.exports = { createAccessToken, createRefreshToken, generateToken };
