import React, { useEffect, useState } from "react";
import ReactJsAlert from "reactjs-alert";
import {
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBRow,
  MDBCardTitle,
  MDBCol,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBBtn,
  MDBTabsPane,
} from "mdb-react-ui-kit";
import PasswordChecklist from "react-password-checklist";
import DataService from "../../services/http-request";
import userImg from "../../assets/user.png";

const Profile = props => {
  const [user, setUser] = useState(props.user);
  const [validPassword, setValidPassword] = useState(true);
  const [basicActive, setBasicActive] = useState("tab1");
  const [statusAlert, setStatusAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState("error");
  const [titleAlert, setTitleAlert] = useState("");
  const [quoteAlert, setQuoteAlert] = useState("");
  const [colorAlert, setColorAlert] = useState("");

  const initialPasswordState = {
    current_password: "",
    new_password: "",
    confirm_password: "",
  };
  const [password, setPassword] = useState(initialPasswordState);

  useEffect(() => {
    setUser(props.user);
  }, [props]);
  const handleBasicClick = value => {
    if (value === basicActive) {
      return;
    }

    setBasicActive(value);
  };

  const handlePasswordChange = event => {
    const [id, value] = [event.target.id, event.target.value];
    setPassword({ ...password, [id]: value });
  };

  const changePassword = () => {
    if (password.current_password === "" || password.new_password === "") {
      setTitleAlert("Parola nu a fost schimbata");
      setQuoteAlert("Completati toate campurile!");
      setTypeAlert("error");
      setColorAlert("#D00000");
      setStatusAlert(true);
    } else if (password.new_password !== password.confirm_password) {
      setTitleAlert("Parola nu a fost schimbata");
      setQuoteAlert("Parolele nu corespund");
      setColorAlert("#D00000");
      setTypeAlert("error");
      setStatusAlert(true);
    } else if (!validPassword) {
      setTitleAlert("Parola nu a fost schimbata");
      setQuoteAlert(
        "Parola trebuie sa aiba  minim 8 caractere, cel putin un caracter special si un numar."
      );
      setColorAlert("#D00000");
      setTypeAlert("error");
      setStatusAlert(true);
    } else {
      DataService.changePassword(password, props.userId)
        .then(response => {
          if (response.status === 200) {
            setTitleAlert("Succes");
            setQuoteAlert(response.data.message);
            setTypeAlert("success");
            setStatusAlert(true);
            setColorAlert("#0CCA4A");
            setPassword(initialPasswordState);
            setValidPassword(!validPassword);
          }
        })
        .catch(e => {
          setTitleAlert("Parola nu a fost schimbata");
          setQuoteAlert(e.response.data.message);
          setColorAlert("#D00000");
          setTypeAlert("error");
          setStatusAlert(true);
        });
    }
  };
  const checkPasswordValidity = isValid => {
    setValidPassword(isValid);
  };
  const refreshInputs = () => {};

  return (
    <>
      <MDBRow>
        <MDBCol className="mt-5 d-flex align-items-center justify-content-center">
          <MDBCard className="edit-profile-card">
            <MDBCardBody className="edit-profile-body">
              <MDBRow>
                <MDBCol size="4" className="col-example ">
                  <MDBCardTitle className="mb-2"></MDBCardTitle>
                  <div>
                    <img
                      src={userImg}
                      className="edit-ptofile-userImg"
                      alt="..."
                    />
                  </div>
                </MDBCol>
                <MDBCol sm="8" className="col-example ">
                  <div className="mb-2 mx-2">
                    <MDBTabs className="mb-3">
                      <MDBTabsItem>
                        <MDBTabsLink
                          onClick={() => handleBasicClick("tab1")}
                          active={basicActive === "tab1"}
                        >
                          Profil
                        </MDBTabsLink>
                      </MDBTabsItem>
                      <MDBTabsItem>
                        <MDBTabsLink
                          onClick={() => handleBasicClick("tab2")}
                          active={basicActive === "tab2"}
                        >
                          Schimba parola
                        </MDBTabsLink>
                      </MDBTabsItem>
                    </MDBTabs>

                    <MDBTabsContent>
                      <MDBTabsPane show={basicActive === "tab1"}>
                        <MDBInput
                          label="Nume de utilizator"
                          id="username"
                          name="username"
                          type="text"
                          className="mt-5 edit-profile-input p-2 "
                          value={user.username}
                          disabled
                        />
                        <MDBInput
                          label="Email"
                          id="email"
                          type="email"
                          className="mt-5 edit-profile-input p-2"
                          disabled
                          value={props.user.email}
                        />
                      </MDBTabsPane>
                      <MDBTabsPane show={basicActive === "tab2"}>
                        <MDBInput
                          label="Parola curenta"
                          id="current_password"
                          type="password"
                          className="mt-4 p-2"
                          required
                          onChange={handlePasswordChange}
                        />
                        <MDBInput
                          label="Parola noua"
                          id="new_password"
                          type="password"
                          className="mt-3 p-2"
                          required
                          onChange={handlePasswordChange}
                        />
                        <MDBInput
                          label="Confirma parola"
                          id="confirm_password"
                          type="password"
                          className="mt-3 p-2"
                          onChange={handlePasswordChange}
                        />
                        <PasswordChecklist
                          className="no-display"
                          rules={[
                            "minLength",
                            "number",
                            "specialChar",
                            "match",
                          ]}
                          minLength={8}
                          value={password.new_password}
                          valueAgain={password.confirm_password}
                          onChange={isValid => checkPasswordValidity(isValid)}
                          messages={{
                            minLength:
                              "Parola trebuie sa aiba minim 8 caractere.",
                            specialChar:
                              "Parola trebuie sa contina cel putin un caracter special.",
                            number:
                              "Parola trebuie sa contina cel putin un numar.",
                            match: "Parolele nu corespund.",
                          }}
                        />
                        <MDBBtn
                          className="mt-3"
                          color="grey"
                          onClick={refreshInputs}
                        >
                          Renunta
                        </MDBBtn>
                        <MDBBtn className="mt-3 mx-3" onClick={changePassword}>
                          Salveaza
                        </MDBBtn>
                      </MDBTabsPane>
                    </MDBTabsContent>
                  </div>
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
      <ReactJsAlert
        status={statusAlert}
        type={typeAlert}
        title={titleAlert}
        color={colorAlert}
        quotes={true}
        quote={quoteAlert}
        Close={() => setStatusAlert(false)}
      />
    </>
  );
};

export default Profile;
