import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataService from "../../services/http-request";

const Register = props => {
  let navigate = useNavigate();
  const initialUserState = {
    username: "",
    email: "",
    password: "",
  };

  const [user, setUser] = useState(initialUserState);
  const [submitted, setSubmitted] = useState(false);
  const [ showPassword, setShowPassword] = useState(false);

  const handleInputChange = event => {
    const [username, value ] = [event.target.id, event.target.value]; // name/ id = value from the input
    setUser({ ...user, [username]: value });
    console.log(user);
  };

  const handleSubmit = () => {
    if ( user.username === "" || user.password === "") 
    {
      alert("Completati numele de utilizator si parola.")
    } else {
      var data = {
        username: user.username,
        email:user.email,
        password: user.password,
      };
      console.log(data);
      DataService.createUser(data)
        .then(response => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        })
    navigate('/', { replace: true }) 
    alert("Cont creat cu succes!")
    }
   
  }
  const handleShowPassword = () => {
    setShowPassword((prevShowPassword)=>!prevShowPassword)
  }
  return (
    <div className="submit-form ">
     {/* {submitted ? ( */}
     <div>
       <div>
        <h4>Creeaza un cont</h4> 
       </div>
        <div className="form-group">
          <label htmlFor="username">Nume de utilizator</label>
          <input
            type="text"
            className="form-control"
            id="username"
            required
            //value={user.username}
            onChange={handleInputChange}
            name="username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            required
            //value={user.username}
            onChange={handleInputChange}
            name="email"
          />
        </div>
        <div> 
          <div className="form-group icon-inside">
            <label htmlFor="password">Password</label>
            <i className={showPassword ? "fa fa-eye-slash fa-2x" : "fa fa-eye fa-2x"} onClick={handleShowPassword }></i> 
            <input 
              className="form-control"
              id="password"
              required
              value={user.password}
              onChange={handleInputChange}
              name="password" type={showPassword ? "text" : "password" }
            />
            
          </div>
          <Link to={"/login"} className="btn btn-success btn-login">
            Login
          </Link>
          <button onClick={handleSubmit} className="no-dec-link btn btn-success">
              Creeaza cont
          </button> 
        </div>   
    </div>
     {/* ) :(
      <p> Back to the future</p>
     )} */}
    </div>
  );
};

export default Register;