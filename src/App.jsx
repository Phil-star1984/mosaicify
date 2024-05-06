import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Impressum from "./components/Impressum.jsx";
import TestTwo from "./components/TestTwo";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/nothing" element={<TestTwo /> } />

      </Routes>
      <Footer />
    </>
  );
}

export default App;
