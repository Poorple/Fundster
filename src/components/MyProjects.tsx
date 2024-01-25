import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import "../styles/my-projects.css";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";
import {
  ProjectData,
  JwtPayload,
  userProjectTypes,
} from "../interfaces/CommonInterfaces";

const PROJECT_URL = "/projects";

const MyProjects: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(false);

  const [creationHandler, setCreationHandler] = useState<boolean>(false);

  const [editProject, setEditProject] = useState<boolean>(false);

  const [userProj, setUserProj] = useState<userProjectTypes[]>([]);

  const [projectToEdit, setProjectToEdit] = useState<userProjectTypes>({
    id: 0,
    name: "",
    description: "",
    backers: 0,
    deadline: new Date(),
    moneyAcquired: 0,
    moneyGoal: 0,
    projectPictureUrl: "",
    userID: 0,
  });

  const [popUpMessage, setPopUpMessage] = useState<string>("");

  const [showPopUp, setShowPopUp] = useState<boolean>(false);

  /*   const [confirmDeletePrompt, setConfirmDeletePrompt] =
    useState<boolean>(false); */

  const [showSuccesfulInfoPopUp, setShowSuccesfulInfoPopUp] =
    useState<boolean>(false);

  const [showUnsuccesfulInfoPopUp, setShowUnsuccesfulInfoPopUp] =
    useState<boolean>(false);

  const [projectData, setProjectData] = useState<ProjectData>({
    name: "",
    projectPictureUrl: "",
    description: "",
    moneyGoal: 0,
    deadline: "",
    userID: 0,
  });

  const [cookie, setCookie, removeCookie] = useCookies(["user-cookie"]);

  let userIdForProjDisplay: number = 0;
  let userProjects: userProjectTypes[] = [];

  const token = cookie["user-cookie"];

  //GETTING USER ID FOR PROJECT DISPLAY
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      const userId = decoded.user_id;

      setProjectData((prevData) => ({
        ...prevData,
        userID: userId,
      }));
      userIdForProjDisplay = userId;
    } else {
      null;
    }
  }, []);

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

  //FETCHING DATA AND USER PROJECTS
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const headers = {
            Authorization: `Bearer ${token}`,
          };

          const response = await axios.get(PROJECT_URL, {
            headers: headers,
          });

          if (response.status === 200) {
            userProjects = response.data.filter(
              (singleProj: userProjectTypes) =>
                singleProj.userID == userIdForProjDisplay
            );
            if (userProj.length == 0) {
              setUserProj(() => {
                const updatedUserProjects = response.data.filter(
                  (singleProj: userProjectTypes) =>
                    singleProj.userID == userIdForProjDisplay
                );
                console.log(updatedUserProjects);
                return updatedUserProjects;
              });
              userIdForProjDisplay = projectData.userID;
            }
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
  }, [userProj]);

  //CLOSING MESSAGE POP UP
  const closePopUp = (event: React.MouseEvent<HTMLElement>): void => {
    setShowPopUp(false);
    /* if (confirmDeletePrompt) {
      setConfirmDeletePrompt(!confirmDeletePrompt);
    } */
  };

  //OPENING NEW PROJECT FORM
  const createNew = () => {
    setShowForm(true);
    setProjectData({
      ...projectData,
      name: "",
      description: "",
      moneyGoal: 0,
      deadline: "",
    });
    setCreationHandler(true);
  };

  //CANCEL NEW PROJECT
  const cancelProjectCreation = () => {
    setProjectData({
      ...projectData,
      name: "",
      description: "",
      moneyGoal: 0,
      deadline: "",
    });
    console.log(projectData);
    setCreationHandler(false);
    setShowForm(false);
  };

  //UPDATING CLICKED PROJECT
  const updateProjectInfo = (obj: userProjectTypes) => {
    setProjectToEdit(obj);

    setProjectData((prevData) => ({
      ...prevData,
      name: obj.name,
      description: obj.description,
      moneyGoal: obj.moneyGoal,
    }));

    setProjectToEdit((prevProjectToEdit) => ({
      ...prevProjectToEdit,
      id: obj.id,
      name: obj.name,
      description: obj.description,
      backers: obj.backers,
      moneyAcquired: obj.moneyAcquired,
      moneyGoal: obj.moneyGoal,
      projectPictureUrl: obj.projectPictureUrl,
      userID: obj.userID,
    }));
    setEditProject(true);
    setShowForm(true);
  };
  useEffect(() => {
    setProjectToEdit((prevProjectToEdit) => ({
      ...prevProjectToEdit,
      name: projectData.name,
      description: projectData.description,
      moneyGoal: projectData.moneyGoal,
    }));
  }, [projectData]);

  //DELETE SELECTED PROJECT -- DOESNT WORK, API ONLY ALLOWS ADMIN TO DELETE
  /* const DeleteProj = async () => {
    try {
      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.delete(
          `/projects/${selectedProject?.id}`,
          {
            headers: headers,
          }
        );
        if (
          response.status === 200 ||
          response.status === 202 ||
          response.status === 204
        ) {
          setPopUpMessage("Project deleted successfully");
          setShowSuccesfulInfoPopUp(true);
          setShowPopUp(true);
          setEditProject(false);
        } else {
          setPopUpMessage("Project deletion failed");
          setShowUnsuccesfulInfoPopUp(true);
          setShowPopUp(true);
          setEditProject(false);
        }
      }
    } catch (error) {
      console.error("Project deletion error:", error);
    }
  }; */

  //INPUT CHANGE HANDLE
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProjectData({
      ...projectData,
      [name]: value,
    });
  };

  //FORMATTING DATE TO REQUIRED FORMAT
  const formatDeadline = (datetime: string): string => {
    const formattedDate = new Date(datetime).toISOString();
    return formattedDate.substring(0, 23) + "+00:00";
  };

  //FORM SUBMIT AND UPDATE
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editProject === true) {
      if (projectToEdit) {
        try {
          if (token) {
            const headers = {
              Authorization: `Bearer ${token}`,
            };
            const formattedDeadline = formatDeadline(projectData.deadline);
            const response = await axios.put(
              `/projects/${projectToEdit.id}`,
              { ...projectToEdit, deadline: formattedDeadline },
              {
                headers: headers,
              }
            );
            if (response.status === 200 || response.status === 204) {
              setPopUpMessage("Project data updated successfully");
              setShowSuccesfulInfoPopUp(true);
              setShowPopUp(true);
              setEditProject(false);
              setShowForm(false);
            } else {
              setPopUpMessage("Project data update failed");
              setShowUnsuccesfulInfoPopUp(true);
              setShowPopUp(true);
              setEditProject(false);
              setShowForm(false);
            }
          }
        } catch (error) {
          console.error("User data update error:", error);
        }
      }
    }
    if (creationHandler === true) {
      try {
        const formattedDeadline = formatDeadline(projectData.deadline);

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        console.log(formattedDeadline);
        const response = await axios.post(
          PROJECT_URL,
          {
            ...projectData,
            deadline: formattedDeadline,
          },
          {
            headers: headers,
          }
        );
        if (response.status === 201) {
          console.log("Project creation successful!", response.data);
          const currentUserId = projectData.userID;
          setShowForm(false);
          setProjectData({
            name: "",
            projectPictureUrl: "",
            description: "",
            moneyGoal: 0,
            deadline: "",
            userID: currentUserId,
          });
          const updatedDataResponse = await axios.get(PROJECT_URL);
          setUserProj(updatedDataResponse.data);
        } else {
          console.error("Project creation failed");
        }
      } catch (error) {
        console.error("Project creation error:", error);
      }
    }
  };

  const calculatePercentage = (
    moneyAcquired: number,
    moneyGoal: number
  ): number => {
    if (moneyAcquired / moneyGoal !== 0) {
      return (moneyAcquired / moneyGoal) * 100;
    } else return moneyAcquired / moneyGoal + 0.005 * 100;
  };

  return (
    <>
      <button className="new-project-btn" onClick={createNew}>
        Create New Project
      </button>
      {showForm /* && !confirmDeletePrompt */ ? (
        <section>
          <form onSubmit={handleSubmit}>
            <label>
              Project Name:
              <input
                type="text"
                name="name"
                value={projectData.name}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            {/* <label>
              Picture URL:
              <input
                type="text"
                name="projectpictureUrl"
                value={projectData.projectPictureUrl}
                onChange={handleChange}
              />
            </label>
            <br /> */}
            <label>
              Project Description:
              <textarea
                name="description"
                value={projectData.description}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Money Goal:
              <input
                type="number"
                name="moneyGoal"
                value={projectData.moneyGoal}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Deadline:
              <input
                type="datetime-local"
                name="deadline"
                value={projectData.deadline}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <div className="button-div">
              <button type="button" onClick={cancelProjectCreation}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  projectData.name == "" ||
                  projectData.moneyGoal == 0 ||
                  projectData.description == "" ||
                  projectData.deadline == ""
                }
              >
                Submit
              </button>
            </div>
            {/* {editProject ? (
              <button onClick={() => setConfirmDeletePrompt(true)}>
                Delete
              </button>
            ) : null} */}
          </form>
        </section>
      ) : null}
      {/* {confirmDeletePrompt || showPopUp ? (
        <div className="div-message-box">
          <p>Are you sure?</p>
          <div className="button-div">
            <button onClick={DeleteProj}>Delete</button>
            <button onClick={closePopUp}>Cancel</button>
          </div>
        </div>
      ) : null} */}
      {showPopUp ? (
        showSuccesfulInfoPopUp || showUnsuccesfulInfoPopUp ? (
          <div className="div-message-box">
            <p>{popUpMessage}</p>
            <button onClick={closePopUp}>Close</button>
          </div>
        ) : null
      ) : null}
      {!showForm ? (
        <div className="personal-projects">
          {userProj && userProj.length > 0 ? (
            userProj.map((singleProj: userProjectTypes) => (
              <article
                onClick={() => updateProjectInfo(singleProj)}
                key={singleProj.id}
              >
                <img
                  src={
                    singleProj.projectPictureUrl != ""
                      ? singleProj.projectPictureUrl
                      : "/landscape-placeholder.svg"
                  }
                />
                <p>{singleProj.name}</p>
                <p className="project-description">{singleProj.description}</p>
                <p>{`Wanted amount: ${singleProj.moneyGoal}`}</p>
                <p>{`Deadline: ${formatCorrectDateToDisplay(
                  singleProj.deadline
                )}`}</p>

                <p className="money-stat">{`Money acquired: ${
                  singleProj.moneyAcquired !== null
                    ? singleProj.moneyAcquired
                    : 0
                }/${singleProj.moneyGoal}`}</p>
                <div className="progress-bar">
                  <span
                    style={{
                      width: `${calculatePercentage(
                        singleProj.moneyAcquired,
                        singleProj.moneyGoal
                      )}%`,
                    }}
                  ></span>
                </div>
              </article>
            ))
          ) : (
            <p>No Projects Found</p>
          )}
        </div>
      ) : null}
    </>
  );
};

export default MyProjects;
