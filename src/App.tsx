import "./App.css";
import Header from "./components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import MainPage from "./components/MainPage";
import MyProjects from "./components/MyProjects";
import UserProfile from "./components/UserProfile";
import RequireAuth from "./components/RequireAuth";
import ProjectSpecifications from "./components/ProjectSpecifications";
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* <Route path="/" element={<MainPage />} /> */}
        <Route path="/registration" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />

        <Route element={<RequireAuth />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/my_projects" element={<MyProjects />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/registration" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/proj_info" element={<ProjectSpecifications />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
