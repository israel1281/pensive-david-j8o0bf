const Quotation = require("../models/QuotationModel");
const APIfeatures = require("../utils/apiFeatures");

const quotationCtrl = {
  createQuotation: async (req, res) => {
    try {
      const { billingFrom, billingTo, item, quantity, price, discount } =
        req.body;

      if (
        !billingFrom &&
        !billingTo &&
        !item &&
        !quantity &&
        !price &&
        !discount
      )
        return res.status(400).json({ msg: "Please all required field" });

      const quotationTotal = quantity * price * (1 - discount / 100);

      const newQuotation = new Quotation({
        billingFrom,
        billingTo,
        item,
        quantity,
        price,
        discount,
        total: quotationTotal,
      });

      await newQuotation.save();

      const quotation = await Quotation.findOne({ _id: newQuotation._id })
        .populate({
          path: "billingFrom",
          select: "-password, -token",
        })
        .populate("billingTo");

      res.json({
        status: "success",
        message: "new quotation generated",
        data: quotation,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  getBillersQuotations: async (req, res) => {
    try {
      const features = new APIfeatures(
        Quotation.find({
          billingFrom: req.params.id,
        })
          .populate({
            path: "billingFrom",
            select: "-password, -token",
          })
          .populate("billingTo"),
        req.query
      )
        .filtering()
        .sorting()
        .paginating();

      const billersQuotation = await features.query;

      res.json({
        status: "success",
        total: billersQuotation.length,
        data: billersQuotation,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  deleteQuotation: async (req, res) => {
    try {
      await Quotation.findOneAndDelete({ _id: req.params.id });

      res.json({
        status: "success",
        message: "Quotation deleted successfully",
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = quotationCtrl;
