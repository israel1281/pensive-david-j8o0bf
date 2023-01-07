const router = require("express").Router();
const quotationCtrl = require("../controllers/quotationCtrl");

router.route("/quotation").post(quotationCtrl.createQuotation);

router.delete("/quotation/:id", quotationCtrl.deleteQuotation);

router.get("/quotation/:id", quotationCtrl.getBillersQuotations);

module.exports = router;
