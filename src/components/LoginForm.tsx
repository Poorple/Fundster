import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useCookies } from "react-cookie";

const LOGIN_URL = "/login";

const LoginForm = () => {
  const [cookie, setCookie, removeCookie] = useCookies(["user-cookie"]);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(LOGIN_URL, formData);

      if (response.status === 200) {
        console.log("Login successful!", response.data);
        const accessToken = response?.data?.token;
        setCookie("user-cookie", accessToken, { path: "/" });
        navigate(from, { replace: true });
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <section>
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">
          E-mail:
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password">
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?
        <br />
        <span className="line">{<Link to="/registration">Register</Link>}</span>
      </p>
    </section>
  );
};

export default LoginForm;
