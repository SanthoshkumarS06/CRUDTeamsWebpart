import * as React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = (props) => {
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
      <h1>Home</h1>
    </div>
  );
};

export default Home;
