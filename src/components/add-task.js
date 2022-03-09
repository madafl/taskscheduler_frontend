import React, { useState, useEffect} from "react";
import DataService from "../services/http-request";
import { Link, useParams, useLocation, useNavigate} from "react-router-dom";
import TaskPopup from "./task-modal"


const AddTask = props => {
  const location = useLocation()
  let navigate = useNavigate();

  let initialTaskState={
      title: "",
      description: "",
      dateRange: ["",""],
      progress: 0,
  };

  const [task, setTask] = useState(initialTaskState);
  const [submitted, setSubmitted] = useState(false);
  

  const onProgressChange = event=> {
      setTask({progress: event.target.value});
  }
  
  // const [dateRange, setDateRange] = useState(['','']);
  // const [startDate, endDate] = dateRange;
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  

  const handleInputChange = event => {
    const value  =  event.target.value;
    setTask({ ...task, [event.target.name]: value });
    
  };

  const saveTask = () => {
    if (task !== ""){

      var data = {
        title: task.title,
        body: task.description,
        name: props.user.username,
        // dateRange: dateRange,
        start: startDate,
        end: endDate,
        progress: task.progress
      };
        DataService.createTask(data)
          .then(response => {
            setSubmitted(true);
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
        <TaskPopup handleInputChange={handleInputChange} task={task} saveTask={saveTask} startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} submitted={submitted} onProgressChange={onProgressChange}/>
      </div>
      ) : (
      <div>
        Please log in.
      </div>
      )}

    </div>
  );
};

export default AddTask;