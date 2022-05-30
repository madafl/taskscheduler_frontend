import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import DataService from "../../services/http-request";
import EmailChips from "../email-chips";
import ReactJsAlert from "reactjs-alert";
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
  MDBRange,
  MDBRadio,
  MDBIcon,
} from "mdb-react-ui-kit";
import AllProjects from "./all-projects";

//start end name id progress type hideChildren membri
const CreateProject = props => {
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

  const toggleShow = () => setBasicModal(!basicModal);

  let initialProjectState = {
    name: "",
    start: "",
    end: "",
    progress: 0,
    type: "project",
    hideChildren: false,
    members: [],
  };
  const [project, setProject] = useState(initialProjectState);
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
    if (project !== "") {
      var data = {
        name: project.name,
        start: startDate,
        end: endDate,
        progress: project.progress,
        type: "project",
        project_owner: props.user.email,
        emails: emails,
        status: status,
      };

      DataService.createProject(data)
        .then(response => {
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
    }
  };
  const handleStatusChange = e => {
    setStatus(e.target.value);
  };

  return (
    <>
      <MDBBtn onClick={toggleShow}>Adauga</MDBBtn>
      <MDBModal show={basicModal} setShow={setBasicModal} tabIndex="-1">
        <MDBModalDialog size="md">
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle className="m-1">Adauga un proiect</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody className="m-1">
              <label>Titlu</label>
              <div className="w-100">
                <MDBInput
                  className="w-100"
                  id="name"
                  type="text"
                  name="name"
                  onChange={handleInputChange}
                  value={project.name}
                />
              </div>
              <label className="mt-2">Interval</label>
              <DatePicker
                className="form-control"
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={onChange}
                dateFormat="d MMMM yyyy "
                shouldCloseOnSelect={false}
                // name="dateRange"
                locale="ro"
                withPortal
              />
              <label className="mt-2">{`Progres ${project.progress}%`}</label>
              <MDBRange
                defaultValue={0}
                id="progress"
                name="progress"
                // label={`Progres ${project.progress} %`}
                onChange={handleInputChange}
                min="0"
                max="100"
                step="5"
              />
              <label>Tip</label>
              <MDBInput
                className="demo-material-purple"
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
                current_user_email={props.user.email}
              />
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="grey" onClick={toggleShow}>
                Renunta
              </MDBBtn>
              <MDBBtn onClick={saveProject}>Creeaza proiect</MDBBtn>
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
