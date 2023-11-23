import { useState } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/main-page.css";

const MainPage = () => {
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

  return (
    <>
      <div>
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
    </>
  );
};

export default MainPage;
