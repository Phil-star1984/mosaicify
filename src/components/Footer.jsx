import React from "react";
import "../components/FooterStyle.css";

function Footer() {
  return (
    <footer>
      <div className="footer_textcontainer">
      &copy; {new Date().getFullYear()} WebDev by MillionPainter.de
      </div>
      </footer>
  );
}

export default Footer;
