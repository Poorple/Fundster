import React, { useState } from "react";
import axios from "../api/axios";
import "../styles/my-projects.css";

const PROJECT_URL = "/projects";
interface ProjectData {
  name: string;
  projectPictureUrl: string;
  description: string;
  moneyGoal: string;
  deadline: string;
  userID: number;
}

const MyProjects: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [userProj, setUserProj] = useState("");
  const [projectData, setProjectData] = useState<ProjectData>({
    name: "",
    projectPictureUrl: "",
    description: "",
    moneyGoal: "",
    deadline: "",
    userID: 53,
  });

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

      console.log(formattedDeadline);
      const response = await axios.post(PROJECT_URL, {
        ...projectData,
        deadline: formattedDeadline,
      });
      if (response.status === 201) {
        console.log("Registration successful!", response.data);
        // ...
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
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
            <label>
              Picture URL:
              <input
                type="text"
                name="projectpictureUrl"
                value={projectData.projectPictureUrl}
                onChange={handleChange}
              />
            </label>
            <br />
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
          {userProj ? (
            <>
              <p>My personal projects</p>
              <article>Project #</article>
            </>
          ) : (
            <p>No Projects Found</p>
          )}
        </div>
      ) : null}
    </>
  );
};

export default MyProjects;
