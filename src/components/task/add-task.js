import React, { useState } from "react";
import DataService from "../../services/http-request";
import { useLocation, useNavigate } from "react-router-dom";
import TaskPopup from "./task-popup";

const AddTask = props => {
  const location = useLocation();
  let navigate = useNavigate();

  let initialTaskState = {
    title: "",
    description: "",
    dateRange: ["", ""],
    progress: 0,
    type: "task",
    status: "todo",
    dependencies: [],
    backgroundColor: "#AEB8C2",
    progressColor: "#8282F5",
    projectId: props.projectId,
  };

  const [task, setTask] = useState(initialTaskState);
  const [submitted, setSubmitted] = useState(false);

  const handleBackgroundChange = color => {
    setTask({ ...task, backgroundColor: color.hex });
  };
  const handleProgressChange = color => {
    setTask({ ...task, progressColor: color.hex });
  };

  const onProgressChange = event => {
    setTask({ ...task, progress: event.target.value });
  };

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleInputChange = event => {
    const value = event.target.value;
    setTask({ ...task, [event.target.name]: value });
  };

  const saveTask = () => {
    if (task !== "") {
      var data = {
        title: task.title,
        description: task.description,
        name: props.user.username,
        start: startDate,
        end: endDate,
        progress: task.progress,
        type: task.type,
        status: task.status,
        dependencies: task.dependencies,
        backgroundColor: task.backgroundColor,
        progressColor: task.progressColor,
        projectId: task.projectId,
      };
      DataService.createTask(data)
        .then(response => {
          setSubmitted(true);
          setTimeout(window.location.reload(false), 3000);
        })
        .catch(e => {
          console.log(e);
        });
    }
  };

  return (
    <div>
      {props.user ? (
        <div className="submit-form">
          <TaskPopup
            handleInputChange={handleInputChange}
            task={task}
            saveTask={saveTask}
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            submitted={submitted}
            onProgressChange={onProgressChange}
            handleBackgroundChange={handleBackgroundChange}
            handleProgressChange={handleProgressChange}
          />
        </div>
      ) : (
        <div>Please log in.</div>
      )}
    </div>
  );
};

export default AddTask;
