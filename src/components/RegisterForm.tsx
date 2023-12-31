import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../api/axios";
import { useCookies } from "react-cookie";
import "../styles/register-form.css";
import { loginTypes, userDataTypes } from "../interfaces/CommonInterfaces";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,24}$/;
const PHONE_REGEX = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
const REGISTER_URL = "/users";
const LOGIN_URL = "/users/login";

const RegisterForm = () => {
  const navigate = useNavigate();
  const userRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const telRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const [cookie, setCookie, removeCookie] = useCookies(["user-cookie"]);

  const [validTel, setValidTel] = useState(false);
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [formData, setFormData] = useState<userDataTypes>({
    name: "",
    email: "",
    role: 1,
    profilePictureUrl: "",
    phoneNumber: "",
    password: "",
  });

  const [autoLogin, setAutoLogin] = useState<loginTypes>({
    email: "",
    password: "",
  });

  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setValidTel(PHONE_REGEX.test(formData.phoneNumber));
  }, [formData.phoneNumber]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(formData.password));
    setValidMatch(formData.password === matchPwd);
  }, [formData.password, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [formData.email, formData.password, formData.phoneNumber, matchPwd]);

  useEffect(() => {
    const autoLoginMail = formData.email;
    const autoLoginPassword = formData.password;
    setAutoLogin({
      email: autoLoginMail,
      password: autoLoginPassword,
    });
  }, [formData.email, formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(REGISTER_URL, formData);

      if (response.status === 201) {
        cookie["user-cookie"] && removeCookie("user-cookie");
        console.log("Registration successful!", response.data);

        try {
          console.log(autoLogin);
          const loginResponse = await axios.post(LOGIN_URL, autoLogin);

          if (loginResponse.status === 200) {
            console.log(
              "Registration and Login successful!",
              loginResponse.data
            );
            const accessToken = loginResponse?.data?.token;
            setCookie("user-cookie", accessToken, { path: "/" });
            navigate("/");
          } else {
            console.error("Registration and Login failed");
          }
        } catch (loginError) {
          console.error("Registration and Login error:", loginError);
        }
        navigate("/");
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <>
      <section>
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>
          {errMsg}
        </p>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Username:</label>
          <input
            name="name"
            type="text"
            id="name"
            ref={userRef}
            autoComplete="off"
            onChange={handleChange}
            value={formData.name}
            required
          />
          <label htmlFor="email">Email:</label>
          <input
            name="email"
            type="email"
            id="email"
            ref={emailRef}
            autoComplete="off"
            onChange={handleChange}
            value={formData.email}
            required
          />

          <label htmlFor="tel">
            Phone number:
            <FontAwesomeIcon
              icon={faCheck}
              className={validTel ? "valid" : "hide"}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className={validTel || !formData.phoneNumber ? "hide" : "invalid"}
            />
          </label>
          <input
            name="phoneNumber"
            type="tel"
            id="tel"
            ref={telRef}
            autoComplete="off"
            onChange={handleChange}
            value={formData.phoneNumber}
            required
          />

          <label htmlFor="password">
            Password:
            <FontAwesomeIcon
              icon={faCheck}
              className={validPwd ? "valid" : "hide"}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className={validPwd || !formData.password ? "hide" : "invalid"}
            />
          </label>
          <input
            name="password"
            type="password"
            id="password"
            onChange={handleChange}
            value={formData.password}
            required
            onFocus={() => setPwdFocus(true)}
            onBlur={() => setPwdFocus(false)}
          />
          <p className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
            <FontAwesomeIcon icon={faInfoCircle} />
            6 to 24 characters.
            <br />
            Must include uppercase and lowercase letters, and a number
            <br />
          </p>

          <label htmlFor="confirm_pwd">
            Confirm Password:
            <FontAwesomeIcon
              icon={faCheck}
              className={validMatch && matchPwd ? "valid" : "hide"}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className={validMatch || !matchPwd ? "hide" : "invalid"}
            />
          </label>
          <input
            type="password"
            id="confirm_pwd"
            onChange={(e) => setMatchPwd(e.target.value)}
            value={matchPwd}
            required
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)}
          />
          <p
            className={matchFocus && !validMatch ? "instructions" : "offscreen"}
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            Must match the first password input field.
          </p>

          <button
            disabled={
              !formData.name || !formData.email || !validPwd || !validMatch
                ? true
                : false
            }
          >
            Sign Up
          </button>
        </form>
        <p>
          Already registered?
          <br />
          <span className="line">{<Link to="/login">Log In</Link>}</span>
        </p>
      </section>
    </>
  );
};

export default RegisterForm;
