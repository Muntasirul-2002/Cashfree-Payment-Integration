import React from "react";
import {Routes, Route} from 'react-router-dom'
import Payment from "./pages/Payment";
import SuccessGif from "./components/SuccessGif";
const App = () => {
  const backend_url = "https://cashfree-payment-integration-server.vercel.app"
  return (
    <div>
     <Routes>
      <Route path="/" element={<Payment/>}  backend_url={backend_url}/>
      <Route path="/success" element={<SuccessGif/>} backend_url={backend_url} />
     </Routes>
    </div>
  );
};

export default App;
