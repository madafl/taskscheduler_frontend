import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { decodeToken } from "react-jwt";
import Login from "./components/auth/login";
import AllTasks from "./components/task/all-tasks";
import Task from "./components/task/all-tasks";
import AllProjects from "./components/project/all-projects";
import LandingPage from "./components/landing-page";
import Avatar from "react-avatar";
import Stats from "./components/dashboard/stats";

import Profile from "./components/dashboard/profile";
import Graphs from "./components/project/graphs";
import logo from "./assets/logo.png";

import {
  MDBBtn,
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBDropdownLink,
  MDBCollapse,
} from "mdb-react-ui-kit";

function App() {
  let navigate = useNavigate();
  const initialUserState = {
    username: "",
    email: "",
  };
  const [token, setToken] = React.useState(localStorage.getItem("token"));
  const [user, setUser] = React.useState(initialUserState);
  const [userStorage, setUserStorage] = React.useState(
    localStorage.getItem("user")
  );
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [showBasic, setShowBasic] = useState(false);
  const [userId, setUserId] = useState("");

  async function login(user) {
    setUser(user);
    setIsLoggedIn(true);
    navigate("/projects", { replace: true });
  }

  async function logout() {
    localStorage.clear();
    setUser(initialUserState);
    navigate("/", { replace: true });
  }
  useEffect(() => {
    if (token !== null && userStorage !== null) {
      const decodedToken = decodeToken(token);
      const user_json = JSON.parse(userStorage);
      setUserId(decodedToken.token); // id-ul userului
      setUser(user_json);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <MDBContainer fluid className="full-height">
      <MDBNavbar expand="lg" light bgColor="light">
        <MDBContainer fluid>
          <MDBNavbarBrand href="/">
            <img src={logo} height="40" alt="" loading="lazy" />
            Task Scheduler
          </MDBNavbarBrand>
          <MDBNavbarToggler
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setShowBasic(!showBasic)}
          >
            <MDBIcon icon="bars" fas />
          </MDBNavbarToggler>
          <MDBCollapse navbar show={showBasic}>
            <MDBNavbarNav className="mr-auto mb-2 mb-lg-0">
              {isLoggedIn ? (
                <MDBNavbarItem>
                  <MDBNavbarLink active aria-current="page" href="/projects">
                    Proiecte
                  </MDBNavbarLink>
                </MDBNavbarItem>
              ) : null}
            </MDBNavbarNav>
            {user.username !== "" ? (
              <MDBDropdown className="mr-auto mb-2 mb-lg-0 w-auto float-right">
                <MDBDropdownToggle
                  tag="a"
                  className="nav-link"
                  style={{ cursor: "pointer" }}
                >
                  <Avatar
                    className="me-1"
                    name={user.username}
                    round={true}
                    size="30"
                    textSizeRatio={1.75}
                  />
                  {user.username}
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem>
                    <MDBDropdownLink href={`/stats/${userId}`}>
                      Statistici
                    </MDBDropdownLink>
                  </MDBDropdownItem>
                  <MDBDropdownItem>
                    <MDBDropdownLink href={`/profile/${userId}`}>
                      Profil
                    </MDBDropdownLink>
                  </MDBDropdownItem>
                  <MDBDropdownItem>
                    <MDBDropdownLink onClick={logout} href="/">
                      Logout
                    </MDBDropdownLink>
                  </MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            ) : (
              <MDBNavbarNav className="mr-auto mb-2 mb-lg-0 w-auto">
                <MDBNavbarItem>
                  <MDBNavbarLink href="/login">Login</MDBNavbarLink>
                </MDBNavbarItem>
              </MDBNavbarNav>
            )}
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>

      <Routes>
        {isLoggedIn ? (
          <Route
            path="/"
            element={<AllProjects user={user} userId={userId} />}
          />
        ) : (
          <Route path="/" element={<LandingPage />} />
        )}
        <Route
          path="/projects"
          element={<AllProjects user={user} userId={userId} />}
        />
        <Route
          path="/login"
          element={
            <Login
              user={user}
              login={login}
              setToken={setToken}
              setUserId={setUserId}
            />
          }
        />
        <Route path="/id/:id" element={<Task user={user} login={login} />} />
        <Route
          path="/project/:id"
          element={<AllTasks user={user} login={login} userId={userId} />}
        />
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <section className="error_section">
                <p className="error_section_subtitle">
                  Pagina nu a fost gasita!
                </p>
                <h1 className="error_title">
                  <p>404</p>
                  404
                </h1>
                <MDBBtn href={isLoggedIn ? "/projects" : "/"}>
                  Task Scheduler
                </MDBBtn>
              </section>
            </main>
          }
        />
        <Route
          path="/stats/:id"
          element={<Stats user={user} userId={userId} />}
        />
        <Route
          path="/profile/:id"
          element={<Profile user={user} userId={userId} />}
        />
        <Route
          path="/graphs/:id"
          element={<Graphs user={user} userId={userId} />}
        />
      </Routes>
    </MDBContainer>
  );
}

export default App;
