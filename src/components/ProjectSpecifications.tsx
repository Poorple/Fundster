import React, { useState } from "react";
import { userProjectTypes } from "../interfaces/CommonInterfaces";
import { useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "../api/axios";
import "../styles/project-specifications.css";

const ProjectSpecifications = () => {
  const [cookie, setCookie, removeCookie] = useCookies(["user-cookie"]);

  const token = cookie["user-cookie"];

  const location = useLocation();
  const project: userProjectTypes | undefined = location.state?.project;

  const [donateAmount, setDonateAmount] = useState<number>(0);

  const [popUpMessage, setPopUpMessage] = useState<string>("");

  const [showPopUp, setShowPopUp] = useState<boolean>(false);

  const [donationBoxVisibility, setDonationBoxVisibility] =
    useState<boolean>(false);

  if (!project) {
    return <p>No project details found.</p>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDonateAmount(parseInt(e.target.value));
  };

  const calculatePercentage = (
    moneyAcquired: number,
    moneyGoal: number
  ): number => {
    if (moneyAcquired / moneyGoal !== 0) {
      return (moneyAcquired / moneyGoal) * 100;
    } else if (moneyAcquired / moneyGoal > 1) {
      return 1;
    } else return moneyAcquired / moneyGoal + 0.01 * 100;
  };

  const formatCorrectDateToDisplay = (x: Date) => {
    const formattedDeadline = new Date(x).toLocaleString("en-GB", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });
    return formattedDeadline;
  };

  const closePopUp = (event: React.MouseEvent<HTMLElement>): void => {
    setShowPopUp(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.put(
          `/projects/${project.id}`,
          { ...project, moneyAcquired: donateAmount },
          {
            headers: headers,
          }
        );
        if (response.status === 200 || response.status === 204) {
          setPopUpMessage("Donation successful!");
          setDonateAmount(0);
          setShowPopUp(true);
          setDonationBoxVisibility(false);
        } else {
          setPopUpMessage("Donation failed!");
          setShowPopUp(true);
        }
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <>
      <article className="proj-article">
        <img
          src={
            project.projectPictureUrl != ""
              ? project.projectPictureUrl
              : "/landscape-placeholder.svg"
          }
        />
        <p>{project.name}</p>
        <section className="desc-section">
          <p>Project description:</p>
          <p className="project-description">{project.description}</p>
        </section>
        <p>{`Wanted amount: ${project.moneyGoal}`}</p>
        <p>{`Deadline: ${formatCorrectDateToDisplay(project.deadline)}`}</p>

        <p className="money-stat">{`Money acquired: ${
          project.moneyAcquired !== null ? project.moneyAcquired : 0
        }/${project.moneyGoal}`}</p>
        <div className="progress-bar">
          <span
            style={{
              width: `${calculatePercentage(
                project.moneyAcquired,
                project.moneyGoal
              )}%`,
            }}
          ></span>
        </div>
        <button type="button" onClick={() => setDonationBoxVisibility(true)}>
          Donate
        </button>
      </article>
      {donationBoxVisibility ? (
        <section className="donation-section">
          <form onSubmit={handleSubmit}>
            <label>
              Donate Amount:
              <input
                type="number"
                value={donateAmount}
                onChange={handleChange}
                required
              />
            </label>
            <div className="btn-box">
              <button
                type="button"
                onClick={() => setDonationBoxVisibility(false)}
              >
                Cancel
              </button>
              <button type="submit">Submit</button>
            </div>
          </form>
        </section>
      ) : null}
      {showPopUp ? (
        <div className="div-message-box">
          <p>{popUpMessage}</p>
          <button onClick={closePopUp}>Close</button>
        </div>
      ) : null}
    </>
  );
};

export default ProjectSpecifications;
