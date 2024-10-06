import React, { useState } from "react";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";
const Payment = () => {
  const [orderId, setOrderId] = useState("");

  let cashfree;
  var initializeSDK = async function () {
    cashfree = await load({
      mode: "sandbox",
    });
  };
  initializeSDK();

  const getSessionId = async () => {
    try {
      let res = await axios.get("https://cashfree-payment-integration-server.vercel.app/payment");
      if (res.data && res.data.payment_session_id) {
        console.log(res.data.payment_session_id);
        setOrderId(res.data.order_id);
        return res.data.payment_session_id;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const verifyPayment = async() =>{
    try {
        let res = await axios.post("https://cashfree-payment-integration-server.vercel.app/verify",{
            orderId: orderId,
        })
        if(res && res.data){
            alert("Payment Verified")
        }
    } catch (error) {
        
    }
  }
  const makePayment = async (e) => {
    e.preventDefault();
    try {
      let sessionId = await getSessionId();
      let checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_self",
      };
      cashfree.checkout(checkoutOptions).then((res) => {
        console.log("Payment Initialized");
        verifyPayment(orderId)
        
      });
    } catch (error) {}
  };
  return (
    <>
      <div className="product-card">
      <img src={`https://picsum.photos/300?random=${Math.floor(Math.random() * 1000)}`} alt="Image" className="product-image" />
      <h3 className="product-title">Sample Product</h3>
      <p className="product-price">₹2.0</p>
      <button id="renderBtn" onClick={makePayment} type="submit" className="buy-button">Pay Now</button>
    </div>
    </>
  );
};

export default Payment;
