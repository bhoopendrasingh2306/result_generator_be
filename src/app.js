// app.js
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const stripe = require("stripe")(process.env.SECRET_KEY_STRIPE);
const { v4: uuidv4 } = require('uuid');


require("./db/config");


app.use(express.json());
// app.use(cors());
app.use(
  cors({
    origin: "*",
  })
);

// ======================================================================
console.log("hi");


const student = require("./routes/student");
app.use("/student", student);

const university = require("./routes/university_routes");
app.use("/university", university);

const result = require("./routes/result_routes");
app.use("/result", result);

app.post("/payment", (req, res) => {
  const { product, token } = req.body;
  console.log("product", product);
  console.log("price", product.price);

  const idempotencyKey = uuidv4();

  return stripe.customers.create({
    email: token.email,
    source: token.id,
  }).then(customer => {
    // Ensure idempotency_key is correctly passed as part of the options object
    return stripe.charges.create(
      {
        amount: product.price * 100, // Amount in cents
        currency: "usd",
        customer: customer.id,
        description: "Sample Charge",
        receipt_email: token.email,
      }
    );
  }).then(result => {
    res.status(200).json(result);
  }).catch(error => {
    console.log("backend error", error);
    res.status(500).json({ error: "Payment processing failed" });
  });
});



app.listen(process.env.PORT || 5000, function () {
  console.log("App running on port 4000.");
});
