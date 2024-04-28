import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Routes from "./Routes";

import { loadWeb3 } from './Core/web3';

function App() {
  useEffect(() => {
    const reloadWeb3 = async () => {
      await loadWeb3();
    }
    reloadWeb3();
  }, []);

  return (
    <>
      <Router>
        <Routes />
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
      />
    </>
  );
}

export default App;
