import React from "react";
import { Link } from "react-router-dom";

function Nav() {
  const navStyle = {
    color: "white"
  };

  return (
   
      <nav>
        <ul className="nav-links">
          <Link style={navStyle} to="/">
            <li>Home</li>
          </Link>
          <Link style={navStyle} to="/login">
            <li>Login</li>
          </Link>

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
