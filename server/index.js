import express, { response } from "express";
import cors from "cors";
import crypto from "crypto";
import { Cashfree } from "cashfree-pg";
import dotenv from "dotenv";

dotenv.config()
const app = express();
const allowedOrigins = [
    "https://cashfree-payment-integration-server.vercel.app/",
    "https://cashfree-payment-integration-server.vercel.app",
    "http://cashfree-payment-integration-server.vercel.app/",
    "https://cashfree-payment-integration-client.vercel.app/",
    "https://cashfree-payment-integration-client.vercel.app",
    "http://cashfree-payment-integration-client.vercel.app/",
    undefined
]
const corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS from origin : ${origin}`));
      }
    },
    credentials: true,
  };
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extends: true }));

Cashfree.XClientId = process.env.CLIENT_ID;
Cashfree.XClientSecret = process.env.CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

//generate random order ids
function generateOrderId() {
  const uniqueId = crypto.randomBytes(16).toString("hex");
  const hash = crypto.createHash("sha256");
  hash.update(uniqueId);
  const orderId = hash.digest("hex");
  return orderId.substr(0, 12);
}

const PORT = 8080;
app.get("/", (req, res) => {
  res.send("Welcome to cashfree payment backend!!");
});

app.get("/payment", async (req, res) => {
  try {
    let request = {
      order_amount: 2.0,
      order_currency: "INR",
      order_id: await generateOrderId(),
      customer_details: {
        customer_id: "Muntasirul01",
        customer_name: "Muntasirul Islam",
        customer_email: "customer@gmail.com",
        customer_phone: "6294268784",
      },
      order_meta: {
        return_url: `https://cashfree-payment-integration-client.vercel.app/success`,
        payment_methods: "cc,dc,upi",
      },
      order_tags: {
        name: "Muntasirul",
        company: "Cashfree",
      },
    };
    /////////Method 1
    // const response = await axios.post(
    //   `${XEnvironment}/pg/orders`,
    //   requestBody,
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //       "x-client-id": XClientId,
    //       "x-client-secret": XClientSecret,
    //     },
    //   }
    // );
    // console.log(response.data)
    // res.json(response.data)

    ///// Method 2
    // Cashfree.PGCreateOrder("2023-08-01", request)
    //   .then((response) => {
    //     console.log("Order created successfully:", response.data);
    //     res.json(response.data);
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error.response.data.message);
    //   });

    //// Method 3
    const response = await Cashfree.PGCreateOrder("2023-08-01", request);
    if (response.data && response.data.payment_session_id) {
        console.log("Order created successfully:", response.data);
        res.json({
          payment_session_id: response.data.payment_session_id,
          order_id: request.order_id,
        });
      } else {
        console.error("Payment session ID not found in the response");
        res.status(400).json({ message: "Payment session ID not found" });
      }
  } catch (error) {
    console.log(error.response ? error.response.data : error.message);
    res.status(500).json({
      message: "Failed to create payment",
      error: error.response ? error.response.data : error.message,
    });
  }
});
app.post("/verify", async (req, res) => {
    try {
        let {orderId} = req.body;
        Cashfree.PGOrderFetchPayment('2023-08-01',orderId).then((response)=>{
            res.json(response.data)
        }).catch((error)=>{
            res.json(response.error)
        })
    } catch (error) {
        
    }

});

app.listen(PORT, (req, res) => {
  console.log(`Server listening on ${PORT}`);
});
