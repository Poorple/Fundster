import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { JwtPayload } from "../interfaces/CommonInterfaces";
import { jwtDecode } from "jwt-decode";
import { userProfileDataTypes } from "../interfaces/CommonInterfaces";
import axios from "../api/axios";
import "../styles/user-profile.css";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,24}$/;
const PHONE_REGEX = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;

const UserProfile: React.FC = () => {
  const [cookie, setCookie, removeCookie] = useCookies(["user-cookie"]);

  const token = cookie["user-cookie"];

  const [userID, setUserID] = useState<number>(0);

  const [popUpMessage, setPopUpMessage] = useState<string>("");

  const [showPwdChange, setShowPwdChange] = useState<boolean>(false);

  const [showPopUp, setShowPopUp] = useState<boolean>(false);

  const [showSuccesfulInfoPopUp, setShowSuccesfulInfoPopUp] =
    useState<boolean>(false);

  const [showUnsuccesfulInfoPopUp, setShowUnsuccesfulInfoPopUp] =
    useState<boolean>(false);

  const [showSuccesfulPwdPopUp, setShowSuccesfulPwdPopUp] =
    useState<boolean>(false);

  const [showUnsuccesfulPwdPopUp, setShowUnsuccesfulPwdPopUp] =
    useState<boolean>(false);

  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [initialUser, setInitialUser] = useState<userProfileDataTypes>({
    id: 0,
    name: "",
    email: "",
    role: 1,
    profilePictureUrl: "",
    phoneNumber: "",
    password: "",
    projects: [],
    favouriteProjects: [],
  });

  const [updatedUser, setUpdatedUser] = useState<userProfileDataTypes>({
    id: 0,
    name: "",
    email: "",
    role: 1,
    profilePictureUrl: "",
    phoneNumber: "",
    password: "",
    projects: [],
    favouriteProjects: [],
  });

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      console.log(decoded);
      setUserID(decoded.user_id);
      console.log(userID);
    }
  }, [userID]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (userID !== 0) {
          if (token) {
            const headers = {
              Authorization: `Bearer ${token}`,
            };

            const response = await axios.get(`/users/${userID}`, {
              headers: headers,
            });

            if (response.status === 200) {
              const responseArray = response.data;
              setInitialUser((prevUser) => ({
                ...prevUser,
                id: responseArray.id,
                name: responseArray.name,
                email: responseArray.email,
                role: responseArray.role,
                profilePictureUrl: responseArray.profilePictureUrl,
                phoneNumber: responseArray.phoneNumber,
                password: responseArray.password,
                projects: responseArray.projects,
                favouriteProjects: responseArray.favouriteProjects,
              }));
              setUpdatedUser((prevUser) => ({
                ...prevUser,
                id: responseArray.id,
                name: responseArray.name,
                email: responseArray.email,
                role: responseArray.role,
                profilePictureUrl: responseArray.profilePictureUrl,
                phoneNumber: responseArray.phoneNumber,
                password: responseArray.password,
                projects: responseArray.projects,
                favouriteProjects: responseArray.favouriteProjects,
              }));
              setShowPopUp(false);
            } else {
              console.error("User data fetch failed");
            }
          }
        }
      } catch (error) {
        console.error("User data fetch error:", error);
      }
    };

    fetchUserData();
  }, [userID]);

  useEffect(() => {
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      id: initialUser.id,
      name: initialUser.name,
      email: initialUser.email,
      role: initialUser.role,
      profilePictureUrl: initialUser.profilePictureUrl,
      phoneNumber: initialUser.phoneNumber,
      password: initialUser.password,
      projects: initialUser.projects,
      favouriteProjects: initialUser.favouriteProjects,
    }));
  }, []);

  useEffect(() => {
    console.log(initialUser);
    console.log(updatedUser);
  }, [updatedUser, initialUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const closePopUp = (event: React.MouseEvent<HTMLElement>): void => {
    setShowPopUp(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.put(`/users/${userID}`, updatedUser, {
          headers: headers,
        });
        if (response.status === 200 || response.status === 204) {
          setPopUpMessage("User data updated successfully");
          setShowSuccesfulInfoPopUp(true);
          setShowPopUp(true);
        } else {
          setPopUpMessage("User data update failed");
          setShowUnsuccesfulInfoPopUp(true);
          setShowPopUp(true);
        }
      }
    } catch (error) {
      console.error("User data update error:", error);
    }
  };

  useEffect(() => {
    console.log(PHONE_REGEX.test(updatedUser.phoneNumber));
  }, [updatedUser.phoneNumber]);

  const displayPwdChange = () => {
    setShowPwdChange(!showPwdChange);
  };

  const cancelPwdChange = () => {
    setPasswordForm({
      newPassword: "",
      confirmPassword: "",
    });
    setShowPwdChange(!showPwdChange);
  };

  const handlePasswordChange = async () => {
    const isPasswordsValid =
      passwordForm.newPassword &&
      passwordForm.confirmPassword &&
      passwordForm.newPassword === passwordForm.confirmPassword &&
      PWD_REGEX.test(passwordForm.newPassword);

    if (isPasswordsValid) {
      updatedUser.password = passwordForm.newPassword;

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.put(`/users/${userID}`, updatedUser, {
          headers: headers,
        });

        if (response.status === 200 || response.status === 204) {
          setPasswordForm((prevPwd) => ({
            ...prevPwd,
            newPassword: "",
            confirmPassword: "",
          }));
          setShowSuccesfulPwdPopUp(true);
          setPopUpMessage("Password changed successfully");
          setShowPopUp(true);
        } else {
          setPasswordForm((prevPwd) => ({
            ...prevPwd,
            newPassword: "",
            confirmPassword: "",
          }));
          setShowUnsuccesfulPwdPopUp(true);
          setPopUpMessage("Password change failed");
          setShowPopUp(true);
        }
      } catch (error) {
        console.error("Password change error:", error);
      }
    }
  };

  return (
    <>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <img
            src={
              initialUser.profilePictureUrl != ""
                ? initialUser.profilePictureUrl
                : "/profile-placeholder.svg"
            }
          />
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={updatedUser.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={updatedUser.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label>Profile Picture URL:</label>
            <input
              type="text"
              name="profilePictureUrl"
              value={updatedUser.profilePictureUrl}
              onChange={handleChange}
              placeholder="Enter profile picture URL"
            />
          </div>
          <div>
            <label>Phone Number:</label>
            <input
              type="tel"
              name="phoneNumber"
              value={updatedUser.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          {!showPwdChange ? (
            <button onClick={displayPwdChange}>Change password</button>
          ) : null}
          {showPwdChange ? (
            <div className="pwd-container">
              <p>Password must contain 6-24 characters.</p>
              <p>
                Must include at least one uppercase and lowercase letter, and a
                number
              </p>
              <div>
                <label>New password:</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label>Confirm password:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
              <button
                className="cancel-btn"
                type="button"
                onClick={cancelPwdChange}
              >
                Cancel
              </button>
              <button
                className="pwd-update-btn"
                type="submit"
                onClick={handlePasswordChange}
                disabled={
                  !(
                    passwordForm.newPassword &&
                    passwordForm.confirmPassword &&
                    passwordForm.newPassword === passwordForm.confirmPassword &&
                    PWD_REGEX.test(passwordForm.newPassword)
                  )
                }
              >
                Update Password
              </button>
            </div>
          ) : null}
          <button
            className="submit-btn"
            type="submit"
            disabled={
              !(
                (updatedUser.name === initialUser.name ||
                  updatedUser.email === initialUser.email ||
                  updatedUser.profilePictureUrl ===
                    initialUser.profilePictureUrl) &&
                updatedUser.phoneNumber === initialUser.phoneNumber &&
                PHONE_REGEX.test(updatedUser.phoneNumber)
              )
            }
          >
            Submit
          </button>
        </form>
      </div>
      {showPopUp ? (
        showSuccesfulInfoPopUp ||
        showUnsuccesfulInfoPopUp ||
        showSuccesfulPwdPopUp ||
        showUnsuccesfulPwdPopUp ? (
          <div className="div-message-box">
            <p>{popUpMessage}</p>
            <button onClick={closePopUp}>Close</button>
          </div>
        ) : null
      ) : null}
    </>
  );
};

export default UserProfile;
