const User = require("../models/UserModel");
const userCustomer = require("../models/userCustomerModel");
const Quotation = require("../models/QuotationModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  createAccessToken,
  createRefreshToken,
  generateToken,
} = require("../utils/generateToken");
const { checkEmail, checkPassword, checkPhone } = require("../utils/validate");
const sendSms = require("../utils/sendSms");

const userCtrl = {
  register: async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;
      if (!name && !email && !password && !string)
        return res
          .status(404)
          .json({ msg: "a payload was not provded, please check credentials" });

      if (!checkEmail(email))
        return res.status(404).json({ msg: "Invalid email provided!." });

      if (!checkPassword(password))
        return res.status(404).json({
          msg: "Invalid password. follow the password pattern provided",
        });

      if (!checkPhone(phone))
        return res.status(404).json({
          msg: "Phone number must be in international format",
        });

      const user = await User.findOne({ email });
      if (user)
        return res
          .status(404)
          .json({ msg: "this user is alrady registered with us." });

      const generatedToken = generateToken();

      const passwordHash = await bcrypt.hash(password, 10);
      const tokenHash = await bcrypt.hash(generatedToken, 10);
      const newUser = new User({
        name,
        email,
        phone,
        password: passwordHash,
        token: tokenHash,
      });

      sendSms(phone, generatedToken);

      await newUser.save();

      res.json({
        status: "success",
        message: "check your phone message box for a verification token",
        data: {
          generatedToken,
          email,
          phone,
        },
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  verifyPhone: async (req, res) => {
    try {
      const { email, token } = req.body;

      const user = await User.findOne({ email });

      const isMatch = await bcrypt.compare(token, user.token);
      if (!isMatch) return res.status(400).json({ msg: "Incorrect token." });

      await User.findOneAndUpdate({ email }, { emailVerified: true });

      res.json({
        status: "success",
        message: "Registration successful please settup your profile.",
        data: email,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  setupProfile: async (req, res) => {
    try {
      const {
        email,
        companyName,
        streetAddress,
        state,
        country,
        postalCode,
        website,
      } = req.body;

      await User.findOneAndUpdate(
        { email },
        {
          companyName,
          streetAddress,
          state,
          country,
          postalCode,
          website,
        }
      );

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });

      res.json({
        status: "success",
        message: "companies profile successfully up",
        data: accesstoken,
      });
    } catch (err) {
      res.statu(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!checkEmail(email))
        return res.status(404).json({ msg: "Invalid email provided!." });

      if (!checkPassword(password))
        return res.status(404).json({
          msg: "Invalid password. follow the password pattern provided",
        });

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Incorrect password." });

      // If login success , create access token and refresh token
      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });

      res.json({
        accesstoken,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getMe: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const userId = decoded.id;

      const user = await User.findOne({ _id: userId }).select(
        "-password -token"
      );
      if (!user)
        return res.status(404).json({ msg: `No User found with id ${userId}` });

      const customers = await userCustomer
        .find({ user: userId })
        .sort({ _id: -1 });
      const quotations = await Quotation.find({ billingFrom: userId }).sort({
        _id: -1,
      });

      res.json({
        status: "success",
        message: "User successfully fetched",
        data: {
          user,
          customers,
          quotations,
        },
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = userCtrl;
