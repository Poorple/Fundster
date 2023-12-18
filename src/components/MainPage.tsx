import { useEffect, useState } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/main-page.css";
import axios from "../api/axios";
import { useCookies } from "react-cookie";

interface allUserProjectTypes {
  id: number;
  name: string;
  description: string;
  backers: number;
  deadline: Date;
  moneyAcquired: number;
  moneyGoal: number;
  projectPictureUrl: string;
  userId: number;
}

const PROJECT_URL = "/projects";

const MainPage = () => {
  const [allUserProj, setAllUserProj] = useState<allUserProjectTypes[]>([]);

  const [searchInput, setSearchInput] = useState<string>("");

  const [searchedProject, setSearchedProject] = useState<allUserProjectTypes[]>(
    []
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSearchInput(newValue);
    debouncedSearch(newValue);
  };

  const search = (value: string) => {
    const filteredProjects: allUserProjectTypes[] = [];

    if (filteredProjects.length > 0) {
      filteredProjects.filter((x: allUserProjectTypes) => {
        x.name.toLowerCase().includes(value.toLowerCase())
          ? filteredProjects.slice(filteredProjects.indexOf(x))
          : null;
      });
      console.log(filteredProjects);
      setSearchedProject(filteredProjects);
    }
    if (searchedProject && searchedProject.length! >= 0) {
      if (allUserProj && allUserProj.length >= 0) {
        allUserProj.filter((x: allUserProjectTypes) => {
          x.name.toLowerCase().includes(value.toLowerCase())
            ? filteredProjects.push(x)
            : null;
        });
        console.log(filteredProjects);
        setSearchedProject(filteredProjects);
      }
    }
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

  const calculatePercentage = (
    moneyAcquired: number,
    moneyGoal: number
  ): number => {
    if (moneyAcquired / moneyGoal !== 0) {
      return (moneyAcquired / moneyGoal) * 100;
    } else return moneyAcquired / moneyGoal + 0.01 * 100;
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
        {searchedProject ? (
          searchedProject.map((singleProj: allUserProjectTypes) => (
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
        ) : allUserProj.length > 0 ? (
          allUserProj.map((singleProj: allUserProjectTypes) => (
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
