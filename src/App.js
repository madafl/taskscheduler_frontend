import React, {useEffect} from "react";
import {Routes, Route, Link, useNavigate  } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Register from "./components/auth/register";
import { decodeToken } from "react-jwt";
import Login from "./components/auth/login";
import AllTasks from "./components/all-tasks";
import Task from "./components/task";

function App() {
  let navigate = useNavigate();
  const initialUserState = {
    username: "",
    email: "",
    password: "",
  };
  const [token, setToken] = React.useState(localStorage.getItem('token'));
  const [user, setUser] = React.useState(initialUserState);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  
  async function login(user) {
    setUser(user);
    setIsLoggedIn(true)
  }

  async function logout() {
    localStorage.clear();
    setUser(initialUserState);
    navigate('/', { replace: true })
   
  }
  useEffect(() => {
    if (token !== null){
      setIsLoggedIn(true);
      const decodedToken = decodeToken(token);
      setUser({username : decodedToken.username});
    } else {
      setIsLoggedIn(false);
    }
  }, [token]);


  return (
    // <div className="wrapper">
    <div>
     {/* <nav className="navbar navbar-expand top"> */}
     
     <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="navbar-left">
            <a className="navbar-brand" href="/">
              Task Scheduler
            </a>
            <a className="navbar-brand" href="/tasks">
              All tasks
            </a>
          </div>
          <div className="collapse navbar-collapse navbar-right" id="navbarNavDropdown">
          <ul className="navbar-nav">
                { user.username !== "" ? (
                <div className="align-dropdown">
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i className="fa-solid fa-user"></i> {user.username}
                  </a>
                  <div className="dropdown-menu align-dropdown" aria-labelledby="navbarDropdownMenuLink">
                    <a onClick={logout} className="dropdown-item" style={{cursor:'pointer'}}  href="http://localhost:3000/">
                      Logout {user.username}
                    </a>
                  </div>
              </li>
              </div>
                ) : (            
                  <div className="">
                      <li className="nav-item active">
                  <Link to={"/register"} className="nav-link">
                    Register
                  </Link>
                </li>
                  <Link to={"/login"} className="nav-link">
                    Login
                  </Link>
                  </div>
                )}
            </ul>
          </div>
      </nav>

      {/* <div className="container-fluid mt-3 component "> */}
      <div className="container-fluid mt-3">
        <Routes>
          {/* <Route path="/" element={<Calendar />}/> */}
          <Route path="/login" element= {<Login login={login} user ={user}/>}/>
          <Route path="/register" element= {<Register />}/>
          <Route path="/tasks" element={<AllTasks user ={user} login={login}/>} />
          <Route path="/id/:id" element={<Task user ={user} login={login}/>} /> 
         {/* <Route path="/tasks/:id/add" element={<AddTask user = {user} isLoggedIn={isLoggedIn}/>} /> */}
          {/* <Route path="/add" element={<AddTask user = {user} isLoggedIn={isLoggedIn}/>} /> */}
           
          <Route path="*" element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
          /> 
        </Routes>
      </div>
      
    </div>
  );
}

export default App;