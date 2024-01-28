import React, { useEffect, useState } from "react";
import { userProjectTypes } from "../interfaces/CommonInterfaces";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "../api/axios";
import "../styles/project-specifications.css";

const PROJECT_URL = "/projects";

const ProjectSpecifications = () => {
  const { projectId } = useParams();

  const navigate = useNavigate();

  const [cookie, setCookie, removeCookie] = useCookies(["user-cookie"]);

  const token = cookie["user-cookie"];

  const [fetchedProject, setFetchedProject] = useState<userProjectTypes>();

  const [donateAmount, setDonateAmount] = useState<number>(0);

  const [popUpMessage, setPopUpMessage] = useState<string>("");

  const [showPopUp, setShowPopUp] = useState<boolean>(false);

  const [donationBoxVisibility, setDonationBoxVisibility] =
    useState<boolean>(false);

  if (!projectId) {
    return <p>No project details found.</p>;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const headers = {
            Authorization: `Bearer ${token}`,
          };

          const response = await axios.get(`${PROJECT_URL}/${projectId}`, {
            headers: headers,
          });

          if (response.status === 200) {
            setFetchedProject(response.data);
          } else {
            console.error("Failed to fetch data");
          }
        } else {
          null;
        }
      } catch (error: any) {
        console.error(
          "Fetch data error:",
          error.response || error.message || error
        );
      }
    };

    fetchData();
  }, []);

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
    if (fetchedProject) {
      try {
        if (token) {
          const headers = {
            Authorization: `Bearer ${token}`,
          };
          const newDonation = fetchedProject.moneyAcquired + donateAmount;
          const response = await axios.put(
            `/projects/${projectId}`,
            { ...fetchedProject, moneyAcquired: newDonation },
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
    }
  };

  return (
    <>
      {fetchedProject ? (
        <article className="proj-article">
          <img
            src={
              fetchedProject.projectPictureUrl != ""
                ? fetchedProject.projectPictureUrl
                : "/landscape-placeholder.svg"
            }
          />
          <p>{fetchedProject.name}</p>
          <section className="desc-section">
            <p>Project description:</p>
            <p className="project-description">{fetchedProject.description}</p>
          </section>
          <p>{`Wanted amount: ${fetchedProject.moneyGoal}`}</p>
          <p>{`Deadline: ${formatCorrectDateToDisplay(
            fetchedProject.deadline
          )}`}</p>

          <p className="money-stat">{`Money acquired: ${
            fetchedProject.moneyAcquired !== null
              ? fetchedProject.moneyAcquired
              : 0
          }/${fetchedProject.moneyGoal}`}</p>
          <div className="progress-bar">
            <span
              style={{
                width: `${calculatePercentage(
                  fetchedProject.moneyAcquired,
                  fetchedProject.moneyGoal
                )}%`,
              }}
            ></span>
          </div>
          <button type="button" onClick={() => setDonationBoxVisibility(true)}>
            Donate
          </button>
        </article>
      ) : null}
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
