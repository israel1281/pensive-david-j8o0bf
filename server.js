require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

const http = require("http").createServer(app);

const URI = process.env.MONGODB_URL;
mongoose.connect(
  URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to mongodb");
  }
);

app.use("/user", require("./routers/userRouter"));
app.use("/api", require("./routers/userCustomerRouter"));
app.use("/api", require("./routers/quotationRouter"));
app.get("/", (req, res) => {
  res.send("Hello, world");
});

const port = process.env.PORT || 5000;
http.listen(port, () => {
  console.log("Server is running on port", port);
});
