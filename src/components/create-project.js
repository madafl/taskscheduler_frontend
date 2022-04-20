import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import DataService from "../services/http-request";
//start end name id progress type hideChildren membri
const CreateProject = props => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [projects, setProjects] = React.useState([]);
  const [submitted, setSubmitted] = useState(false);
  let initialProjectState = {
    title: "",
    dateRange: ["", ""],
    progress: 0,
    type: "project",
    hideChildren: false,
    members: [],
  };
  const [project, setProject] = useState(initialProjectState);
  const handleInputChange = event => {
    const value = event.target.value;
    setProject({ ...project, [event.target.name]: value });
    console.log(event.target.name, value);
  };
  const onChange = dates => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  const saveTask = () => {
    if (project !== "") {
      var data = {
        title: project.title,
        start: startDate,
        end: endDate,
        progress: project.progress,
        type: "project",
        hideChildren: false,
        members: {
          username: props.user.username,
        },
      };
      DataService.createProject(data)
        .then(response => {
          // setSubmitted(true);
          setTimeout(window.location.reload(false), 3000);
        })
        .catch(e => {
          console.log(e);
        });
    }
  };

  return (
    <div>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Creeaza un proiect
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Modal title
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <label>Titlu</label>
              <input
                type="text"
                className="form-control"
                id="title"
                aria-describedby="title"
                placeholder="Titlu"
                name="title"
                onChange={handleInputChange}
              />
              <label>Interval</label>
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
              <label className="form-label">Progres {project.progress}%</label>
              <input
                type="range"
                className="form-range"
                id="progress"
                min="0"
                max="100"
                name="progress"
                step="5"
                onChange={handleInputChange}
                value={project.progress}
              ></input>
              <select
                className="form-control"
                id="type"
                name="type"
                disabled
                defaultValue="project"
              >
                <option value="project">Proiect</option>
                <option value="task">Task</option>
                <option value="milestone">Reper</option>
              </select>
              {/* <p>Alege un fundal</p> */}
              <p>Adauga membri</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Renunta
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={saveTask}
              >
                Creeaza proiect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
