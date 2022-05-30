import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { ro } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { SketchPicker, ChromePicker } from "react-color";

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
} from "mdb-react-ui-kit";

registerLocale("ro", ro);
//TODO : ADD PROJECT TO TASK
const TaskPopup = props => {
  // const [backgroundColor, setBackgroundColor] = useState("#AEB8C2");
  // const [backgroundSelectedColor, setBackgroundSelectedColor] = useState("");
  // const [progressColor, setProgressColor] = useState("#8282F5");
  const [displayBgColorPicker, setDisplayBgColorPicker] = useState(false);
  const [displayPgColorPicker, setDisplayPgColorPicker] = useState(false);
  // const [editorState, setEditorState] = useState(EditorState.createEmpty());
  // const [progressSelectedColor, setProgressSelectedColor] = useState("");
  const [edit, setEdit] = useState(false);
  const [basicModal, setBasicModal] = useState(false);
  const [fillActive, setFillActive] = useState("tab1");

  const handleFillClick = value => {
    if (value === fillActive) {
      return;
    }

    setFillActive(value);
  };

  const toggleShow = () => setBasicModal(!basicModal);
  const popoverRef = useRef();

  const onChange = dates => {
    const [start, end] = dates;
    props.setStartDate(start);
    props.setEndDate(end);
  };
  const handleBgClick = () => {
    setDisplayBgColorPicker(!displayBgColorPicker);
  };
  const handlePgClick = () => {
    setDisplayPgColorPicker(!displayPgColorPicker);
  };
  const handleBgClose = () => {
    setDisplayBgColorPicker(false);
  };
  const handlePgClose = () => {
    setDisplayPgColorPicker(false);
  };

  // const handleEditorStateChange = editorState => {
  //   const currentContent = editorState.getCurrentContent();
  //   const contentRaw = convertToRaw(currentContent);
  //   const value = draftToHtml(contentRaw);
  //   //setEditorState(value)
  // };

  return (
    <div>
      <MDBBtn onClick={toggleShow} className="mt-3">
        Adauga
      </MDBBtn>
      <MDBModal show={basicModal} setShow={setBasicModal} tabIndex="-1">
        <MDBModalDialog size="xl">
          <MDBModalContent>
            <MDBModalHeader>
              {edit ? (
                <MDBModalTitle>Editeaza</MDBModalTitle>
              ) : (
                <MDBModalTitle>Adauga</MDBModalTitle>
              )}

              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
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
                <MDBTabsItem>
                  <MDBTabsLink
                    onClick={() => handleFillClick("tab4")}
                    active={fillActive === "tab4"}
                  >
                    Aspect
                  </MDBTabsLink>
                </MDBTabsItem>
              </MDBTabs>

              <MDBTabsContent>
                <MDBTabsPane show={fillActive === "tab1"}>
                  <label>Titlu</label>
                  <MDBInput
                    id="title"
                    aria-describedby="title"
                    onChange={props.handleInputChange}
                    name="title"
                  />
                  {/* {edit ? (
                    // <Editor
                    //   editorState={editorState}
                    //   onEditorStateChange={handleEditorStateChange}
                    // />
                  ) : ( */}
                  <div>
                    <label>Descriere</label>
                    <MDBTextArea
                      name="description"
                      rows={4}
                      onChange={props.handleInputChange}
                    />
                  </div>
                  {/* // )} */}
                </MDBTabsPane>
                <MDBTabsPane show={fillActive === "tab2"}>
                  <label>Interval</label>
                  <DatePicker
                    className="form-control mt-1"
                    selectsRange={true}
                    startDate={props.startDate}
                    endDate={props.endDate}
                    onChange={onChange}
                    dateFormat="d MMMM yyyy "
                    shouldCloseOnSelect={false}
                    name="dateRange"
                    locale="ro"
                    withPortal
                  />
                  <label className="mt-3">Progres {props.task.progress}%</label>
                  <MDBRange
                    id="progress"
                    min="0"
                    max="100"
                    name="progress"
                    step="5"
                    onChange={props.handleInputChange}
                    value={props.task.progress}
                  />
                </MDBTabsPane>
                <MDBTabsPane show={fillActive === "tab3"}>
                  <div>
                    <label className="mx-3">Tip</label>
                    <MDBPopover
                      btnChildren="Ajutor"
                      dismiss
                      placement="right"
                      size="sm"
                    >
                      <MDBPopoverHeader>Ajutor</MDBPopoverHeader>
                      <MDBPopoverBody>
                        <p className="help">
                          <b>Proiect</b> - Grup de activitati.
                        </p>
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
                  </div>
                  <div>
                    <select
                      className="form-control mt-3"
                      id="type"
                      name="type"
                      onChange={props.handleInputChange}
                      defaultValue="task"
                    >
                      <option value="project" disabled>
                        Proiect
                      </option>
                      <option value="task">Task</option>
                      <option value="milestone">Reper</option>
                    </select>
                  </div>
                  <label className="form-label">Status</label>
                  <select
                    className="form-control"
                    id="status"
                    name="status"
                    onChange={props.handleInputChange}
                  >
                    <option value="todo">In asteptare</option>
                    <option value="doing">In lucru</option>
                    <option value="Done">Finalizat</option>
                  </select>
                  <label className="form-label"> Depinde de: </label>
                  <select
                    className="form-control"
                    id="dependencies"
                    name="dependencies"
                    onChange={props.handleInputChange}
                  >
                    <option value=""></option>
                    <option value="Task 0">Task 0</option>
                  </select>
                  <label className="form-label">Proiect</label>
                  <select
                    className="form-select"
                    aria-label="Disabled select example"
                    disabled
                    defaultValue={1}
                  >
                    {/* PUT PROJECT NAME HERE */}
                    <option value="1">{props.task.projectId}</option>
                  </select>
                </MDBTabsPane>
                <MDBTabsPane show={fillActive === "tab4"}>
                  <div>
                    <p>Selecteaza o culoare de fundal</p>
                    <div className="swatch" onClick={handleBgClick}>
                      <div
                        className="bgcolor"
                        style={{
                          backgroundColor: props.task.backgroundColor,
                        }}
                      />
                    </div>
                    {displayBgColorPicker ? (
                      <div className="popoverColorPicker">
                        <div className="cover" onClick={handleBgClose} />
                        <SketchPicker
                          color={props.task.backgroundColor}
                          onChange={props.handleBackgroundChange}
                        />
                      </div>
                    ) : null}
                    <p>
                      Selecteaza o culoare pentru a indica progresul taskului
                    </p>
                    <div className="swatch" onClick={handlePgClick}>
                      <div
                        className="progresscolor"
                        style={{
                          backgroundColor: props.task.progressColor,
                        }}
                      />
                    </div>
                    {displayPgColorPicker ? (
                      <div className="popoverColorPicker">
                        <div className="cover" onClick={handlePgClose} />
                        <SketchPicker
                          color={props.task.progressColor}
                          onChange={props.handleProgressChange}
                        />
                      </div>
                    ) : null}
                  </div>
                </MDBTabsPane>
              </MDBTabsContent>
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color="danger" onClick={toggleShow}>
                Renunta
              </MDBBtn>
              {props.task.title !== "" ? (
                <MDBBtn onClick={props.saveTask}>Adauga</MDBBtn>
              ) : (
                <MDBBtn onClick={props.saveTask} disabled>
                  Adauga
                </MDBBtn>
              )}
              {/* {props.submitted ? (
                <h4>Taskul a fost adaugat cu succes!</h4>
              ) : null} */}
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
};

export default TaskPopup;
