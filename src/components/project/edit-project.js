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
  MDBRadio,
  MDBIcon,
} from "mdb-react-ui-kit";
// import diff from "deep-diff";

//start end name id progress type hideChildren membri
const EditProject = props => {
  const [project, setProject] = useState(props.project); //project.members idurile emailurilor
  const [startDate, setStartDate] = useState(new Date(project.start));
  const [endDate, setEndDate] = useState(new Date(project.end));
  const [basicModal, setBasicModal] = useState(false);
  const [emails, setEmails] = useState([]); // emailurile introduse
  const [status, setStatus] = useState(props.project.status);
  const [statusAlert, setStatusAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState("error");
  const [titleAlert, setTitleAlert] = useState("");
  const [quoteAlert, setQuoteAlert] = useState("");
  const [colorAlert, setColorAlert] = useState("");
  const [members, setMembers] = useState([]); // emailuri membrii din proiect
  ///get user email by id to display in chips
  useEffect(() => {
    project.members.map(id => {
      DataService.getUserById(id)
        .then(response => {
          setMembers(members => [...members, response.data]);
        })
        .catch(e => {
          console.log(e);
        });
      return members;
    });
  }, []);

  const toggleShow = () => {
    setBasicModal(!basicModal);
    props.setEditProject(true);
  };
  const handleInputChange = event => {
    const value = event.target.value;
    setProject({ ...project, [event.target.name]: value });
  };
  const onChange = dates => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    setProject({ ...project, start: start, end: end });
  };
  // check if added email is project owner email already checked in email-chips
  const updateProject = () => {
    setProject({ ...project, members: members });
    DataService.updateProject(project)
      .then(response => {
        if (response.status === 200) {
          setQuoteAlert("Proiectul a fost actualizat!\n");
          setColorAlert("#0CCA4A");
          setStatusAlert(true);
          setTitleAlert("Succes!");
          setTypeAlert("success");
          setTimeout(window.location.reload(false), 3000);
        }
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
    setProject({ ...project, status: e.target.value });
  };

  return (
    <>
      <MDBIcon
        fas
        icon="edit fa-lg"
        className="position-absolute top-0 end-0 m-3 mt-4"
        onClick={toggleShow}
      />
      {props.editProject ? (
        <MDBModal show={basicModal} setShow={setBasicModal} tabIndex="-1">
          <MDBModalDialog size="md">
            <MDBModalContent>
              <MDBModalHeader className="modal-header-diy">
                <MDBModalTitle className="m-1">
                  Editeaza proiectul <b>{project.name}</b>
                </MDBModalTitle>
                <MDBBtn
                  className="btn-close"
                  color="none"
                  onClick={toggleShow}
                ></MDBBtn>
              </MDBModalHeader>
              <MDBModalBody>
                <label>Titlu</label>
                <div className="w-100">
                  <MDBInput
                    className="w-100 mt-1"
                    id="name"
                    type="text"
                    name="name"
                    onChange={handleInputChange}
                    defaultValue={project.name}
                  />
                </div>
                <label className="mt-2">Interval</label>
                <DatePicker
                  className="form-control mt-2"
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={onChange}
                  dateFormat="d MMMM yyyy "
                  shouldCloseOnSelect={false}
                  name="dateRange"
                  locale="ro"
                  withPortal
                />
                <label className="mt-2">Tip</label>
                <MDBInput
                  className="mt-2"
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
                  emails={members}
                  setEmails={setEmails}
                  setProject={setProject}
                  project={project}
                  current_user_email={props.user.email}
                  setMembers={setMembers}
                />
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn color="grey" onClick={toggleShow}>
                  Renunta
                </MDBBtn>
                <MDBBtn onClick={updateProject}>Salveaza</MDBBtn>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      ) : null}
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

export default EditProject;
