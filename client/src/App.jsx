import React from "react";
import {Routes, Route} from 'react-router-dom'
import Payment from "./pages/Payment";
import SuccessGif from "./components/SuccessGif";
const App = () => {
  
  return (
    <div>
     <Routes>
      <Route path="/" element={<Payment />}/>
      <Route path="/success" element={<SuccessGif/>} />
     </Routes>
    </div>
  );
};

export default App;
