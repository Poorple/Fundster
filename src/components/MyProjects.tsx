import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import "../styles/my-projects.css";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";

const PROJECT_URL = "/projects";
interface ProjectData {
  name: string;
  projectPictureUrl: string;
  description: string;
  moneyGoal: number;
  deadline: string;
  userID: number;
}
interface JwtPayload {
  exp: number;
  iat: number;
  sub: string;
  user_id: number;
}

interface userProjectTypes {
  id: number;
  name: string;
  description: string;
  backers: number;
  deadline: Date;
  moneyAcquired: number;
  moneyGoal: number;
  projectPictureUrl: string;
  userID: number;
}

const MyProjects: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [userProj, setUserProj] = useState<userProjectTypes[]>([]);
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

  const createNew = () => {
    setShowForm(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProjectData({
      ...projectData,
      [name]: value,
    });
  };

  const formatDeadline = (datetime: string): string => {
    const formattedDate = new Date(datetime).toISOString();
    return formattedDate.substring(0, 23) + "+00:00";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      <button className="newprojectBtn" onClick={createNew}>
        Create New Project
      </button>
      {showForm ? (
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
            <button type="submit">Submit</button>
          </form>
        </section>
      ) : null}
      {!showForm ? (
        <div className="personal-projects">
          {userProj && userProj.length > 0 ? (
            userProj.map((singleProj: userProjectTypes) => (
              <article key={singleProj.id}>
                <img
                  src={
                    (singleProj.projectPictureUrl = "")
                      ? singleProj.projectPictureUrl
                      : "/landscape-placeholder.svg"
                  }
                />
                <p>{singleProj.name}</p>
                <p className="project-description">{singleProj.description}</p>
                <p>{`Wanted amount: ${singleProj.moneyGoal}`}</p>
                <p>{`Deadline: ${singleProj.deadline}`}</p>

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
