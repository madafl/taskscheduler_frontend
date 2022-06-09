import React, { useState } from "react";
import DatePicker from "react-datepicker";
import DataService from "../../services/http-request";
import EmailChips from "../email-chips";
import ReactJsAlert from "reactjs-alert";
import { decodeToken } from "react-jwt";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBInput,
  MDBRadio,
} from "mdb-react-ui-kit";

//start end name id progress type hideChildren membri
const CreateProject = props => {
  const token = localStorage.getItem("token");
  const decodedToken = decodeToken(token);
  const user_id = decodedToken.token;
  let initialProjectState = {
    name: "",
    start: new Date(),
    end: new Date(),
    progress: 0,
    type: "project",
    project_owner: user_id,
    hideChildren: false,
    emails: [],
    status: "active",
  };
  const [project, setProject] = useState(initialProjectState);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [basicModal, setBasicModal] = useState(false);
  const [emails, setEmails] = useState([]);
  const [status, setStatus] = useState("active");
  const [statusAlert, setStatusAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState("error");
  const [titleAlert, setTitleAlert] = useState("");
  const [quoteAlert, setQuoteAlert] = useState("");
  const [colorAlert, setColorAlert] = useState("");
  const [members, setMembers] = useState([]); // emailuri membrii din proiect

  const toggleShow = () => setBasicModal(!basicModal);

  const handleInputChange = event => {
    const value = event.target.value;
    setProject({ ...project, [event.target.name]: value });
  };
  const onChange = dates => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  const saveProject = () => {
    var data = {
      name: project.name,
      start: startDate,
      end: endDate,
      progress: project.progress,
      type: "project",
      project_owner: user_id,
      emails: emails,
      status: status,
    };
    console.log(project);
    DataService.createProject(data)
      .then(response => {
        console.log(response);
        setTitleAlert("Succes");
        setQuoteAlert("Proiectul a fost creat.");
        setTypeAlert("success");
        setStatusAlert(true);
        setColorAlert("#0CCA4A");
        props.refreshProjects();
        toggleShow();
        setProject(initialProjectState);
      })
      .catch(e => {
        if (e.response.status === 418) {
          setQuoteAlert(
            "Emailul introdus este corect? \n" + e.response.data.error
          );
          setColorAlert("#D00000");
          setStatusAlert(true);
          setTitleAlert("Eroare!");
          setTypeAlert("error");
        } else {
          console.log(e.response);
        }
      });
  };
  const handleStatusChange = e => {
    setStatus(e.target.value);
  };

  return (
    <>
      <MDBBtn className="mt-2 mb-2" onClick={toggleShow}>
        Adauga
      </MDBBtn>
      <MDBModal show={basicModal} setShow={setBasicModal} tabIndex="-1">
        <MDBModalDialog size="md">
          <MDBModalContent>
            <MDBModalHeader className="modal-header-diy">
              <MDBModalTitle>Adauga un proiect</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <div className="modal-body-diy">
              <MDBModalBody>
                <label>Titlu</label>
                <div className="w-100">
                  <MDBInput
                    className="w-100 mt-1"
                    id="name"
                    type="text"
                    name="name"
                    onChange={handleInputChange}
                    value={project.name}
                    label="Adauga un titlu"
                  />
                </div>
                <label className="mt-2">Interval</label>
                <DatePicker
                  className="form-control mt-1"
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={onChange}
                  dateFormat="d MMMM yyyy "
                  shouldCloseOnSelect={false}
                  locale="ro"
                  withPortal
                />
                <label className="mt-2">Tip</label>
                <MDBInput
                  className="mt-1"
                  label="Proiect"
                  id="type"
                  name="type"
                  type="text"
                  disabled
                />
                <label className="me-2 mt-2">Status</label>
                <div>
                  <MDBRadio
                    name="active"
                    id="active"
                    value="active"
                    label="Activ"
                    inline
                    checked={status === "active" ? true : false}
                    onChange={handleStatusChange}
                  />
                  <MDBRadio
                    name="inactive"
                    id="inactive"
                    value="inactive"
                    label="Inactiv"
                    inline
                    checked={status === "inactive" ? true : false}
                    onChange={handleStatusChange}
                  />
                  <MDBRadio
                    name="completed"
                    id="completed"
                    value="completed"
                    label="Complet"
                    inline
                    checked={status === "completed" ? true : false}
                    onChange={handleStatusChange}
                  />
                </div>
                <label className="mt-2">Echipa</label>
                <EmailChips
                  emails={emails}
                  setEmails={setEmails}
                  setProject={setProject}
                  current_user_email={props.user.email}
                  setMembers={setMembers}
                />
              </MDBModalBody>
            </div>
            <MDBModalFooter>
              <MDBBtn color="grey" onClick={toggleShow}>
                Renunta
              </MDBBtn>
              {project.name !== "" ? (
                <MDBBtn onClick={saveProject}>Creeaza proiect</MDBBtn>
              ) : (
                <MDBBtn onClick={saveProject} disabled>
                  Creeaza proiect
                </MDBBtn>
              )}
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
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

export default CreateProject;
