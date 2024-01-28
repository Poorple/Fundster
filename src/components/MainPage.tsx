import { useEffect, useState } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/main-page.css";
import axios from "../api/axios";
import { useCookies } from "react-cookie";
import { userProjectTypes } from "../interfaces/CommonInterfaces";
import { useNavigate } from "react-router-dom";

const PROJECT_URL = "/projects";

const MainPage = () => {
  let navigate = useNavigate();

  const [allUserProj, setAllUserProj] = useState<userProjectTypes[]>([]);

  const [searchInput, setSearchInput] = useState<string>("");

  const [searchedProject, setSearchedProject] = useState<userProjectTypes[]>(
    []
  );

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
            setAllUserProj(response.data);
            console.log(response.data);
          } else {
            console.error("All project fetch failed");
          }
        }
      } catch (error) {
        console.error("All project fetch error:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSearchInput(newValue);
    debouncedSearch(newValue);
  };

  const search = (value: string) => {
    const filteredProjects: userProjectTypes[] = [];

    if (filteredProjects.length > 0) {
      filteredProjects.filter((x: userProjectTypes) => {
        x.name.toLowerCase().includes(value.toLowerCase())
          ? filteredProjects.slice(filteredProjects.indexOf(x))
          : null;
      });
      console.log(filteredProjects);
      setSearchedProject(filteredProjects);
    }
    if (searchedProject && searchedProject.length! >= 0) {
      if (allUserProj && allUserProj.length >= 0) {
        allUserProj.filter((x: userProjectTypes) => {
          x.name.toLowerCase().includes(value.toLowerCase())
            ? filteredProjects.push(x)
            : null;
        });
        console.log(filteredProjects);
        setSearchedProject(filteredProjects);
      }
    }
  };

  const updateURL = (obj: userProjectTypes) => {
    const newURL = `${obj.id}`;
    navigate(`/proj_info/${newURL}`);
  };

  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;

    return function (...args: any[]) {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedSearch = debounce(search, 750);

  const [cookie, setCookie, removeCookie] = useCookies(["user-cookie"]);

  const token = cookie["user-cookie"];

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

  return (
    <>
      <div className="input-and-logo">
        <input
          className="main-page-input"
          name="search"
          id="searchInput"
          type="text"
          placeholder="Search Through All Projects.."
          value={searchInput}
          autoComplete="off"
          onChange={handleSearchChange}
        />
        <FontAwesomeIcon className="react-ico" icon={faMagnifyingGlass} />
      </div>
      <div className="all-user-projects">
        {searchedProject.length !== 0 ? (
          searchedProject.map((singleProj: userProjectTypes) => (
            <article onClick={() => updateURL(singleProj)} key={singleProj.id}>
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
                singleProj.moneyAcquired !== null ? singleProj.moneyAcquired : 0
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
        ) : allUserProj ? (
          allUserProj.map((singleProj: userProjectTypes) => (
            <article onClick={() => updateURL(singleProj)} key={singleProj.id}>
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
              <p>{`Deadline: ${formatCorrectDateToDisplay(
                singleProj.deadline
              )}`}</p>

              <p className="money-stat">{`Money acquired: ${
                singleProj.moneyAcquired !== null ? singleProj.moneyAcquired : 0
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
    </>
  );
};

export default MainPage;
