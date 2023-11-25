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

  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;

    return function (...args: any[]) {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const search = (value: string) => {
    console.log(value);
  };

  const debouncedSearch = debounce(search, 750);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSearchInput(newValue);
    debouncedSearch(newValue);
  };

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
    return (moneyAcquired / moneyGoal) * 100;
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
        {allUserProj ? (
          allUserProj.map((singleProj: allUserProjectTypes) => (
            <article key={singleProj.id}>
              <img
                src={
                  !(singleProj.projectPictureUrl = "")
                    ? singleProj.projectPictureUrl
                    : "https://i.seadn.io/gae/OGpebYaykwlc8Tbk-oGxtxuv8HysLYKqw-FurtYql2UBd_q_-ENAwDY82PkbNB68aTkCINn6tOhpA8pF5SAewC2auZ_44Q77PcOo870?auto=format&dpr=1&w=3840"
                }
              />
              <p>{singleProj.name}</p>
              <p>{singleProj.description}</p>
              <p>{`Wanted amount ${singleProj.moneyGoal}`}</p>
              <p>{`Deadline: ${singleProj.deadline}`}</p>

              <p>Money acquired</p>
              <div
                className="progress-bar"
                style={{
                  width: `${calculatePercentage(
                    singleProj.moneyAcquired,
                    singleProj.moneyGoal
                  )}%`,
                }}
              ></div>
              <p>{`${
                singleProj.moneyAcquired !== null ? singleProj.moneyAcquired : 0
              }/${singleProj.moneyGoal}`}</p>
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
