import { Link, useNavigate } from "react-router-dom";
import "../styles/header.css";
import { useCookies } from "react-cookie";

const Header = () => {
  const [cookie, , removeCookie] = useCookies(["user-cookie"]);
  const navigate = useNavigate();

  const deleteCookie = () => {
    removeCookie("user-cookie");
    navigate("/login");
  };

  const isUserLoggedIn = !!cookie["user-cookie"];

  return (
    <nav>
      <h1>
        <Link to="/">
          Fund<span>ster.</span>
        </Link>
      </h1>
      {isUserLoggedIn ? (
        <ul>
          <li>
            <Link to="/my_projects">My Projects</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li onClick={deleteCookie}>
            <a>Log Out</a>
          </li>
        </ul>
      ) : (
        <ul>
          <li>
            <Link to="/registration">Register</Link>
          </li>
          <li>
            <Link to="/login">Log In</Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Header;
