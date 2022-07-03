import React, { useEffect, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { ro } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import DataService from "../../services/http-request";
import ReactJsAlert from "reactjs-alert";
import { Link } from "react-router-dom";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBInput,
  MDBTextArea,
  MDBBadge,
  MDBRange,
  MDBPopover,
  MDBPopoverBody,
  MDBPopoverHeader,
  MDBIcon,
} from "mdb-react-ui-kit";
registerLocale("ro", ro);

const TaskPopup = props => {
  const [fillActive, setFillActive] = useState("tab1"); // taburi
  const handleFillClick = value => {
    if (value === fillActive) {
      return;
    }
    setFillActive(value);
  };

  const [task, setTask] = useState(props.task); // taskul de editat
  const [dependentTasks, setDependentTasks] = useState([]); // taskurile dependente de pus in select
  const [dependencies, setDependencies] = useState([]); // id-urile taskurilor selectate ce vor fi adaugate in db
  const [defaultDependencies, setDefaultDependencies] = useState([]); // pt edit task=> taskurile dependente
  const [startDate, setStartDate] = useState(""); //
  const [endDate, setEndDate] = useState(""); //
  const [assignedUserEmail, setAssignedUserEmail] = useState({}); // assigned_user pentru afisarea in select => assignedUserEmail.value idul de trimis in db

  const [statusAlert, setStatusAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState("error");
  const [titleAlert, setTitleAlert] = useState("");
  const [quoteAlert, setQuoteAlert] = useState("");
  const [colorAlert, setColorAlert] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const retrieveDependentTasks = () => {
    DataService.getTasksByProjectId(props.project_id)
      .then(response => {
        response.data[1].map(task => {
          const newTask = {
            label: task.name,
            value: task._id,
          };
          return dependentTasks.push(newTask);
        });
      })
      .catch(e => {
        console.log(e);
      });
  };
  const retrieveDependentSelectedTasks = () => {
    if (props.project_id !== undefined && task.dependencies !== undefined) {
      DataService.getTasksByProjectId(props.project_id)
        .then(response => {
          const array = [];
          task.dependencies.map(d => {
            response.data[1].map(task => {
              if (d === task._id) {
                const newTask = {
                  label: task.name,
                  value: task._id,
                };
                return array.push(newTask);
              }
            });
          });
          setDefaultDependencies(array);
        })
        .catch(e => {
          console.log(e);
        });
    }
  };

  useEffect(() => {
    setTask(props.task);
    if (props.project_id !== undefined && dependentTasks.length === 0) {
      retrieveDependentTasks();
      retrieveDependentSelectedTasks();
    }
    if (props.editing && task.user_info !== "") {
      getUserEmail();
    }
    if (props.editing) {
      setStartDate(new Date(task.start));
      setEndDate(new Date(task.end));
    } else {
      setStartDate(new Date());
      setEndDate(new Date());
    }
    if (task.assigned_user !== undefined) {
      getAssignedUserEmail();
    }
    if (task.dependencies !== []) {
      setDependencies(task.dependencies);
      retrieveDependentSelectedTasks();
    }
    if (!props.basicModal) {
      setAssignedUserEmail({ label: "", value: "" });
      setDefaultDependencies({
        label: "",
        value: "",
      });
    }
  }, [props.task, props.editing, task.assigned_user]);

  const handleInputChange = event => {
    const value = event.target.value;
    setTask({ ...task, [event.target.name]: value });
  };
  const onChange = dates => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const saveTask = () => {
    if (assignedUserEmail.value === "") {
      setQuoteAlert("Alegeti persoana care se ocupa de task.\n");
      setColorAlert("#D00000");
      setStatusAlert(true);
      setTitleAlert("Eroare");
      setTypeAlert("error");
    } else {
      if (props.editing) {
        var data = {};

        if (task.type === "task") {
          data = {
            id: task.id,
            name: task.name,
            description: task.description,
            start: startDate,
            end: endDate,
            progress: task.progress,
            type: task.type,
            dependencies: dependencies,
            backgroundColor: task.backgroundColor,
            progressColor: task.progressColor,
            project_id: props.project_id,
            assigned_user: assignedUserEmail.value,
          };
        } else {
          data = {
            id: task.id,
            name: task.name,
            description: task.description,
            start: startDate,
            end: startDate,
            progress: task.progress,
            type: task.type,
            dependencies: dependencies,
            project_id: props.project_id,
          };
        }
        DataService.updateTask(data)
          .then(response => {
            if (response.status === 200) {
              setQuoteAlert("Taskul a fost actualizat!\n");
              setColorAlert("#0CCA4A");
              setStatusAlert(true);
              setTitleAlert("Succes!");
              setTypeAlert("success");
            }
            setTimeout(window.location.reload(false), 3000);
          })
          .catch(e => {
            console.log(e);
          });
      } else {
        const data = {
          name: task.name,
          description: task.description,
          start: startDate,
          end: endDate,
          progress: task.progress,
          type: task.type,
          dependencies: dependencies,
          backgroundColor: task.backgroundColor,
          progressColor: task.progressColor,
          project_id: props.project_id,
          assigned_user: assignedUserEmail.value,
        };
        DataService.createTask(data)
          .then(response => {
            if (response.status === 200) {
              setQuoteAlert("Taskul a fost creat cu succes!\n");
              setColorAlert("#0CCA4A");
              setStatusAlert(true);
              setTitleAlert("Succes!");
              setTypeAlert("success");
            }

            setTimeout(window.location.reload(false), 3000);
          })
          .catch(e => {
            console.log(e);
          });
      }
    }
  };

  const handleDependenciesChange = selectedOption => {
    // daca selectedOption.value === task.id
    const array = [];
    const arrayIds = [];
    selectedOption.map(option => {
      if (task.id !== option.value) {
        const new_dependency = {
          label: option.label,
          value: option.value,
        };
        arrayIds.push(option.value);
        array.push(new_dependency);
      } else {
        setTitleAlert("Eroare");
        setQuoteAlert("Task-ul nu poate depinde de el insusi!");
        setColorAlert("#D00000");
        setTypeAlert("error");
        setStatusAlert(true);
      }
    });
    setDefaultDependencies(array);
    setDependencies(arrayIds);
  };
  const getUserEmail = () => {
    DataService.getUserById(task.user_info)
      .then(response => {
        setUserEmail(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const getAssignedUserEmail = () => {
    DataService.getUserById(task.assigned_user)
      .then(response => {
        const new_user = {
          label: response.data,
          value: task.assigned_user,
        };
        setAssignedUserEmail(new_user);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const handleAssignedUserChange = selectedOption => {
    setAssignedUserEmail({
      label: selectedOption.label,
      value: selectedOption.value,
    });
  };

  return (
    <div>
      <MDBModal
        show={props.basicModal}
        setShow={props.setBasicModal}
        tabIndex="-1"
      >
        <MDBModalDialog size="xl">
          <MDBModalContent>
            <MDBModalHeader className="modal-header-diy">
              {props.editing ? (
                <MDBModalTitle>
                  Editeaza taskul <b>{task.name}</b>
                </MDBModalTitle>
              ) : (
                <MDBModalTitle>Adauga un task</MDBModalTitle>
              )}

              <MDBBtn
                className="btn-close"
                color="none"
                onClick={props.toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBTabs fill className="mb-3">
                <MDBTabsItem>
                  <MDBTabsLink
                    onClick={() => handleFillClick("tab1")}
                    active={fillActive === "tab1"}
                  >
                    General
                  </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                  <MDBTabsLink
                    onClick={() => handleFillClick("tab2")}
                    active={fillActive === "tab2"}
                  >
                    Date
                  </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                  <MDBTabsLink
                    onClick={() => handleFillClick("tab3")}
                    active={fillActive === "tab3"}
                  >
                    Caracteristici
                  </MDBTabsLink>
                </MDBTabsItem>
              </MDBTabs>
              <MDBTabsContent>
                <MDBTabsPane show={fillActive === "tab1"}>
                  <label>Titlu</label>
                  <MDBInput
                    id="name"
                    aria-describedby="name"
                    onChange={handleInputChange}
                    name="name"
                    value={task.name}
                    className="mt-1"
                  />
                  <div>
                    <label className="mt-2">Descriere</label>
                    <MDBTextArea
                      name="description"
                      rows={4}
                      value={task.description}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </MDBTabsPane>
                <MDBTabsPane show={fillActive === "tab2"}>
                  <div>
                    <label className="me-2">Tip</label>
                    <MDBPopover
                      btnChildren={<MDBIcon icon="info-circle " size="lg" />}
                      dismiss
                      placement="right"
                      size="sm"
                    >
                      <MDBPopoverHeader>Ajutor</MDBPopoverHeader>
                      <MDBPopoverBody>
                        <p className="help">
                          <b>Task</b> - Activitate derulata in timpul
                          proiectului.
                        </p>
                        <p className="help">
                          <b>Reper de referinta (milestone)</b> - Este un
                          eveniment intermediar important care survine in cursul
                          realizarii unei activitati, asociat cu obtinerea unui
                          rezultat important sau cu o analiza de stadiu.
                        </p>
                      </MDBPopoverBody>
                    </MDBPopover>
                    <select
                      className="form-control mt-3"
                      id="type"
                      name="type"
                      onChange={handleInputChange}
                      defaultValue={props.editing ? task.type : "task"}
                    >
                      <option value="task">Task</option>
                      <option value="milestone">Reper</option>
                    </select>

                    <div className="mt-2 me-3"></div>
                  </div>
                  <label className="mt-3">Interval</label>
                  {task.type === "task" ? (
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
                      minDate={new Date(props.minStartDate)}
                      maxDate={new Date(props.maxEndDate)}
                    />
                  ) : (
                    <DatePicker
                      className="form-control mt-2"
                      dateFormat="d MMMM yyyy "
                      selected={startDate}
                      onChange={date => setStartDate(date)}
                      withPortal
                    />
                  )}

                  <label className="mt-3">Progres {task.progress} %</label>
                  <MDBRange
                    id="progress"
                    min="0"
                    max="100"
                    name="progress"
                    step="5"
                    onChange={handleInputChange}
                    value={task.progress}
                  />
                </MDBTabsPane>
                <MDBTabsPane show={fillActive === "tab3"}>
                  <label className="form-label"> Depinde de: </label>
                  <Select
                    isMulti
                    name="dependencies"
                    options={dependentTasks}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={handleDependenciesChange}
                    value={defaultDependencies}
                  />

                  <label className="form-label mt-2">Proiect</label>
                  <select
                    className="form-select"
                    aria-label="Disabled select example"
                    disabled
                    defaultValue={1}
                  >
                    <option value="1">{props.project_name}</option>
                  </select>
                  <label className="form-label mt-2">Persoana desemnata</label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    value={assignedUserEmail}
                    options={props.team}
                    onChange={handleAssignedUserChange}
                  />
                </MDBTabsPane>
              </MDBTabsContent>
            </MDBModalBody>

            <MDBModalFooter>
              {props.editing ? (
                <h6 className="">
                  Task creat de
                  <Link to={`/stats/${task.user_info}`}>
                    <MDBBadge pill className="mx-2 mt-2">
                      {/* Emailul utilizatorului care a creat taskul => task.user_info.user_id {props.user.email} */}
                      {userEmail}
                    </MDBBadge>
                  </Link>
                </h6>
              ) : null}
              <MDBBtn color="danger" onClick={props.toggleShow}>
                Renunta
              </MDBBtn>
              {task.name !== "" ? (
                <MDBBtn onClick={saveTask}>Salveaza</MDBBtn>
              ) : (
                <MDBBtn onClick={saveTask} disabled>
                  Salveaza
                </MDBBtn>
              )}
              {/* <MDBBtn onClick={saveTask}>Adauga</MDBBtn> */}
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
    </div>
  );
};

export default TaskPopup;
