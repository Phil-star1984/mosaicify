import React from "react";
import "../components/HeaderStyle.css";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="navbar_container">
      <Link to="/">
        <h1>Mosaicify</h1>
      </Link>
      <nav>
        <ul>
          <li /* style={{ display: "none" }} */>
            <Link to="http://millionpainter.de/" target="_blank">
              About
            </Link>
          </li>
          <li>
            <Link to="/impressum">Impressum</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
