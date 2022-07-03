import React, { useEffect, useState } from "react";
import PasswordChecklist from "react-password-checklist";
import { useNavigate } from "react-router-dom";
import DataService from "../../services/http-request";
import {
  MDBInput,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBContainer,
  MDBIcon,
  MDBInputGroup,
  MDBTypography,
} from "mdb-react-ui-kit";
import ReactJsAlert from "reactjs-alert";
import { decodeToken } from "react-jwt";

const Login = props => {
  let navigate = useNavigate();
  const [statusAlert, setStatusAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState("error");
  const [titleAlert, setTitleAlert] = useState("");
  const [quoteAlert, setQuoteAlert] = useState("");
  const [colorAlert, setColorAlert] = useState("");
  const [validPassword, setValidPassword] = useState(true);

  const initialUserState = {
    username: "",
    email: "",
    password: "",
  };
  const [user, setUser] = useState(initialUserState);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (props.user.email !== "") {
      navigate("/");
    }
  });

  const handleInputChange = event => {
    const [name, value] = [event.target.name, event.target.value];
    setUser({ ...user, [name]: value });
  };

  const login = () => {
    var data = {
      email: user.email,
      password: user.password,
    };
    if (data.email === "" || data.password === "") {
      setTitleAlert("Eroare la conectare");
      setQuoteAlert("Completati toate campurile!");
      setTypeAlert("error");
      setColorAlert("#D00000");
      setStatusAlert(true);
    } else if (isEmail(user.email) === false) {
      setTitleAlert("Eroare la conectare");
      setQuoteAlert("Introduceti un email valid.");
      setColorAlert("#D00000");
      setTypeAlert("error");
      setStatusAlert(true);
    } else {
      DataService.login(data)
        .then(response => {
          if (response.data.user) {
            const token = response.data.token;
            const decodedToken = decodeToken(token);
            localStorage.setItem("token", JSON.stringify(token)); // id user
            localStorage.setItem("user", JSON.stringify(response.data.user)); // email si username
            props.login(response.data.user);
            props.setUserId(decodedToken.token); // id-ul utilizatorului pt ca la redirect to /projects sa exite userid si sa apara butoanele de edit si delete
            navigate("/projects", { replace: true });
          }
        })
        .catch(e => {
          if (e.response.status === 500) {
            setTitleAlert("Eroare la conectare.");
            setColorAlert("#D00000");
            setQuoteAlert(e.response.data.message);
            setStatusAlert(true);
          } else {
            console.log(e);
          }
        });
    }
  };
  const checkPasswordValidity = isValid => {
    setValidPassword(isValid);
  };

  const signup = () => {
    if (user.username === "" || user.password === "" || user.email === "") {
      setTitleAlert("Contul nu a putut fi creat");
      setQuoteAlert("Completati toate campurile!");
      setTypeAlert("error");
      setColorAlert("#D00000");
      setStatusAlert(true);
    } else if (isEmail(user.email) === false) {
      setTitleAlert("Contul nu a putut fi creat");
      setQuoteAlert("Introduceti un email valid.");
      setColorAlert("#D00000");
      setTypeAlert("error");
      setStatusAlert(true);
    } else if (validPassword === false) {
      setTitleAlert("Contul nu a putut fi creat");
      setQuoteAlert("Parola nu respecta criteriile.");
      setColorAlert("#D00000");
      setTypeAlert("error");
      setStatusAlert(true);
    } else {
      var data = {
        username: user.username,
        email: user.email,
        password: user.password,
      };
      DataService.createUser(data)
        .then(response => {
          if (response.status === 200) {
            setTitleAlert("Succes");
            setQuoteAlert(response.data.message);
            setTypeAlert("success");
            setStatusAlert(true);
            setColorAlert("#0CCA4A");
            setUser(initialUserState);
            setValidPassword(!validPassword);
          }
        })
        .catch(e => {
          if (e.response.status === 500) {
            setTitleAlert("Contul nu a putut fi creat");
            setQuoteAlert(e.response.data.message);
            setColorAlert("#D00000");
            setTypeAlert("error");
            setStatusAlert(true);
          } else {
            console.log(e.response);
          }
        });
    }
  };

  const handleShowPassword = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };
  const activateClass = () => {
    document.querySelector(".cont").classList.toggle("s--signup");
  };
  const isEmail = email => {
    return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
  };
  return (
    <>
      <MDBContainer>
        <MDBRow className="d-flex justify-content-center mt-3">
          <MDBCol className="mt-4">
            <div className="cont">
              <div className="form sign-in">
                <div className="login-form ">
                  <MDBTypography blockquote>
                    <p>Autentificare</p>
                  </MDBTypography>
                  <label className="mt-2">Email</label>
                  <MDBInput
                    type="text"
                    id="loginemail"
                    required
                    value={user.email}
                    onChange={handleInputChange}
                    name="email"
                  />
                  <label className="mt-2">Parola</label>
                  <MDBInputGroup
                    noBorder
                    textAfter={
                      <MDBIcon
                        icon={showPassword ? "eye-slash fa-2x" : "eye fa-2x"}
                        onClick={handleShowPassword}
                      />
                    }
                  >
                    <input
                      className="form-control rounded "
                      type={showPassword ? "text" : "password"}
                      value={user.password}
                      onChange={handleInputChange}
                      id="loginpassword"
                      name="password"
                    />
                  </MDBInputGroup>
                </div>
                <MDBBtn className="mt-3" onClick={login}>
                  Login
                </MDBBtn>
              </div>
              <div className="sub-cont">
                <div className="img">
                  <div className="img__text m--up">
                    <h3>Nu ai un cont?</h3>
                    <p>Click pe butonul de mai jos pentru a creea unul!</p>
                  </div>
                  <div className="img__text m--in">
                    <h3>Ai deja un cont?</h3>
                    <p>Click pe butonul de mai jos pentru a te autentifica!</p>
                  </div>
                  <div className="img__btn" onClick={activateClass}>
                    <span className="m--up">Creeaza un cont</span>
                    <span className="m--in">Autentificare</span>
                  </div>
                </div>
                <div className="form sign-up">
                  <MDBTypography blockquote>
                    <p>Inregistrare</p>
                  </MDBTypography>
                  <label className="mt-2">Nume de utilizator</label>
                  <MDBInput
                    type="text"
                    id="username"
                    required
                    value={user.username}
                    onChange={handleInputChange}
                    name="username"
                  />
                  <label className="mt-2">Email</label>
                  <MDBInput
                    type="email"
                    id="email"
                    required
                    onChange={handleInputChange}
                    name="email"
                    value={user.email}
                  />
                  <label className="mt-2">Parola</label>
                  <MDBInputGroup
                    noBorder
                    textAfter={
                      <MDBIcon
                        icon={showPassword ? "eye-slash fa-2x" : "eye fa-2x"}
                        onClick={handleShowPassword}
                      />
                    }
                  >
                    <input
                      className="form-control rounded "
                      type={showPassword ? "text" : "password"}
                      value={user.password}
                      onChange={handleInputChange}
                      id="password"
                      name="password"
                    />
                  </MDBInputGroup>
                  <PasswordChecklist
                    rules={["minLength", "number", "specialChar"]}
                    minLength={8}
                    value={user.password}
                    onChange={isValid => checkPasswordValidity(isValid)}
                    messages={{
                      minLength: "Parola trebuie sa aiba minim 8 caractere.",
                      specialChar:
                        "Parola trebuie sa contina cel putin un caracter special.",
                      number: "Parola trebuie sa contina cel putin un numar.",
                    }}
                  />
                  <MDBBtn className="mt-3" onClick={signup}>
                    Creeaza cont
                  </MDBBtn>
                </div>
              </div>
            </div>
            <ReactJsAlert
              status={statusAlert}
              type={typeAlert}
              title={titleAlert}
              color={colorAlert}
              quotes={true}
              quote={quoteAlert}
              Close={() => setStatusAlert(false)}
            />
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
};

export default Login;
