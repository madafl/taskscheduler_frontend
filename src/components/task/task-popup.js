import React, { useEffect, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { ro } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import DataService from "../../services/http-request";
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
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBInput,
  MDBTextArea,
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

  const [task, setTask] = useState(props.task);
  const [dependentTasks, setDependentTasks] = useState([]);
  const [dependencies, setDependencies] = useState([]);

  const [startDate, setStartDate] = useState(new Date()); //
  const [endDate, setEndDate] = useState(new Date()); //

  const [statusAlert, setStatusAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState("error");
  const [titleAlert, setTitleAlert] = useState("");
  const [quoteAlert, setQuoteAlert] = useState("");
  const [colorAlert, setColorAlert] = useState("");

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
  useEffect(() => {
    setTask(props.task);
    if (props.project_id && dependentTasks.length === 0) {
      retrieveDependentTasks();
    }
  }, [props.task]);

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
      };
      console.log(data);
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
  };
  const handleDependenciesChange = selectedOption => {
    const array = [];
    selectedOption.map(option => {
      array.push(option.value);
    });
    setDependencies(array);
    console.log(dependencies);
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
                          rezultat important sau cu o analiza de stadiu."
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
                    name="colors"
                    options={dependentTasks}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={handleDependenciesChange}
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
                </MDBTabsPane>
              </MDBTabsContent>
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color="danger" onClick={props.toggleShow}>
                Renunta
              </MDBBtn>
              {task.name !== "" ? (
                <MDBBtn onClick={saveTask}>Adauga</MDBBtn>
              ) : (
                <MDBBtn onClick={saveTask} disabled>
                  Adauga
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
