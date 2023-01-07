const router = require("express").Router();
const userCustomerCtrl = require("../controllers/userCustomerCtrl");

router.post("/create-customer", userCustomerCtrl.createNewCustomer);

router.get("/get-billers-customers/:id", userCustomerCtrl.getBillerCustomers);

router.get("/get-customer/:id", userCustomerCtrl.getBillerCustomer);

router.delete("/biller-customer/:id", userCustomerCtrl.deleteBillerCustomer);

module.exports = router;
