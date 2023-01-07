const userCustomer = require("../models/userCustomerModel");
const User = require("../models/UserModel");
const APIfeatures = require("../utils/apiFeatures");

const userCustomerCtrl = {
  createNewCustomer: async (req, res) => {
    try {
      const {
        user,
        customerName,
        email,
        phone,
        streetAddress,
        state,
        country,
        postalCode,
      } = req.body;

      if (
        !user &&
        !customerName &&
        !email &&
        !phone &&
        !streetAddress &&
        !state &&
        !state &&
        !country &&
        !postalCode
      )
        return res
          .status(404)
          .json({ msg: "Please provide all payload needed" });

      const customer = await userCustomer.findOne({ email });
      if (customer)
        return res
          .status(404)
          .json({ msg: `customer with email ${email} already exists` });

      const biller = await User.findById({ _id: user });

      const newCustomer = new userCustomer({
        user,
        customerName,
        email,
        phone,
        streetAddress,
        state,
        country,
        postalCode,
      });

      await newCustomer.save();

      res.json({
        status: "success",
        message: `successfully created a new customer for ${biller.companyName}`,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  getBillerCustomers: async (req, res) => {
    try {
      const features = new APIfeatures(
        userCustomer.find({ user: req.params.id }).select("-user"),
        req.query
      )
        .filtering()
        .paginating()
        .sorting();

      const customers = await features.query;

      res.json({
        status: "success",
        total: customers.length,
        data: customers,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  getBillerCustomer: async (req, res) => {
    try {
      const customer = await userCustomer.findById({ _id: req.params.id });
      if (!customer)
        return res.status(404).json({ msg: "Cannot get customer details" });

      res.json({
        data: customer,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  deleteBillerCustomer: async (req, res) => {
    try {
      await userCustomer.findByIdAndDelete({ _id: req.params.id });

      res.json({
        status: "success",
        message: "customer deleted successfully",
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = userCustomerCtrl;
