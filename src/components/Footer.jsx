import React from "react";
import "../components/FooterStyle.css";

function Footer() {
  return (
    <footer>
      &copy; {new Date().getFullYear()} WebDev by MillionPainter.de
    </footer>
  );
}

export default Footer;
