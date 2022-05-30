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
import diff from "deep-diff";

//start end name id progress type hideChildren membri
const EditProject = props => {
  const initialProject = props.project;
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
  const [members, setMembers] = useState([]);
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    project.members.map(id => {
      DataService.getUserById(id)
        .then(res => {
          setMembers(members => [...members, res.data]);
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
    setProject({ ...project, dateRange: [start, end] });
  };
  const editProject = () => {
    console.log(emails);
    var updated_values = diff(initialProject, project);
    if (updated_values) {
      var data;
      updated_values.map(value => {
        data = {
          project_id: project._id,
          ...data,
          [value.path[0]]: value.rhs,
          emails,
        }; // project_id, lable: valoarea noua
        return data;
      });
      console.log(data);
      DataService.editProject(data)
        .then(response => {
          console.log(response);
        })
        .catch(e => {
          console.log(e.response);
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
              <MDBModalHeader>
                <MDBModalTitle className="m-1">
                  Editeaza proiectul {project.name}
                </MDBModalTitle>
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
                    defaultValue={project.name}
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
                  name="dateRange"
                  locale="ro"
                  withPortal
                />
                <label className="mt-2">{`Progres ${project.progress}%`}</label>
                <MDBRange
                  id="progress"
                  name="progress"
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="5"
                  defaultValue={project.progress}
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
                  emails={members}
                  setEmails={setEmails}
                  current_user_email={props.user.email}
                />
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn color="grey" onClick={toggleShow}>
                  Renunta
                </MDBBtn>
                <MDBBtn onClick={editProject}>Salveaza</MDBBtn>
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
