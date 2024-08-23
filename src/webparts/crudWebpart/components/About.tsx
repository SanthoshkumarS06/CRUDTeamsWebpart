import * as React from "react";
import { Link } from "react-router-dom";

const About: React.FC = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
      <h1>About</h1>
    </div>
  );
};

export default About;
