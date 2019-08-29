import React from "react";
import { Link } from "react-router-dom";

function Nav() {
  const navStyle = {
    color: "white"
  };

  return (
    <nav>
      <Link style={navStyle} to="/">
        <h3>Home</h3>
      </Link>
      <Link style={navStyle} to="/login">
        <h3>Login</h3>
      </Link>
      <ul className="nav-links">
        <Link style={navStyle} to="/discussion">
          <li>Discussion</li>
        </Link>
        <Link style={navStyle} to="/leaderboard">
          <li>Leaderboad</li>
        </Link>
      </ul>
    </nav>
  );
}

export default Nav;
