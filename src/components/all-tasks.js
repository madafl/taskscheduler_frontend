import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect} from "react";
import DataService from "../services/http-request";
import ChangeViewMode from "./changeViewMode";
import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import AddTask from "./add-task";
import { createPopper } from '@popperjs/core';
import TasksSettings from "./tasks-settings";
import {bootstrap, Modal} from 'bootstrap';
import TaskPopup from "./task-popup";

const AllTasks = props => {
  const [tasks, setTasks] = useState([]);
  const [rendered, setRendered] = useState(false);
  const [view, setView] = React.useState(ViewMode.Day);
  const [isChecked, setIsChecked] = React.useState(true);
  const [show, setShow] = useState(false);
  const [taskId, setTaskId] = useState('');
  const [clickedElementPosition, setClickedElementPosition] = useState({left:'',right:'', top:'', bottom:'', x:'', y:''});
  
    const retrieveTasks = () => {
        DataService.getAll()
        .then(response => {
          response.data.tasks.map((task) => {
            const newTask = {
              start: new Date(task.start),
              end: new Date(task.end),
              name: task.name,
              id: task._id,
              type: task.type, // project, milestone, task  
              progress: Number(task.progress),
              styles: 
              {
                backgroundColor:task.backgroundColor,
                backgroundSelectedColor: task.backgroundColor,
                progressColor:task.progressColor,
                progressSelectedColor: task.progressColor,
              },
              // isDisabled: false, //cant be modified 
              // project: "Project 1", // proiectul de care apartine?
              // dependencies:[],
              // hideChildren: false,
              // displayOrder: 2,

            };
          return tasks.push(newTask);
          })
          setRendered(true);
          })
        .catch(e => {
        console.log(e);
        });
    };

    
    useEffect(() => {
      retrieveTasks();
    },[]);
      
    const handleTaskChange = (task) => {
      let newTasks = tasks.map((t) => (t.id === task.id ? task : t)); // newTask este taskul modificat 
      setTasks(newTasks);
    }
    const handleTaskDelete = (task) => {
      const conf = window.confirm("Are you sure about " + task.name + " ?");
      if (conf) {
        setTasks(tasks.filter((t) => t.id !== task.id));
      }
      return conf;
    }
    const handleProgressChange = (task) => {
      setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
      console.log("On progress change Id:" + task.id);
    }
    const handleDoubleClick = (task) => {
      setShow(!show);
      setTaskId(task.id);
    }
    const getEl = (e) => {
      const element = e.target;
      const parentTag = element.parentNode.tagName;
      const parentClass = element.parentNode.className;
      const parent2Class = element.parentNode.parentNode.className;
      
      if (element.tagName === "rect" && parentTag === "g" && parentClass.baseVal === '' && parent2Class.baseVal !== 'handleGroup') {
      var pos =  e.target.getBoundingClientRect();
      var left = pos.left;
      var top = pos.top;
      var right= pos.right;
      var bottom = pos.bottom;
      var x = pos.x;
      var y = pos.y;
      setClickedElementPosition({left:left, top:top, right:right, bottom:bottom, x:x, y:y});
      } else {
          return null;
      }
    }
  

  return (
    <div>
      { rendered  ? (
        <div>
          <ChangeViewMode onViewModeChange={(viewMode) => setView(viewMode)}/>
          <hr></hr>
          { tasks ? (
          <div onClick={getEl}>
            <Gantt tasks={tasks} 
            viewMode={view} 
            onDateChange={handleTaskChange} 
            onDelete={handleTaskDelete} 
            onProgressChange={handleProgressChange}
            listCellWidth={isChecked ? "155px" : ""}
            onDoubleClick={handleDoubleClick}
            />
            <AddTask user = {props.user}/>
            {show ? ( <TasksSettings show = {show} id = {taskId} clickedElementPosition={clickedElementPosition}/>) : (null)} 
          </div>
          ) : (
          <AddTask user = {props.user}/>
          )}
        </div>
       ) : (
        <AddTask user = {props.user}/>
      ) }
    </div>  
      
       
    
  );
}

// function getStartEndDateForProject(tasks, projectId) {
//   const projectTasks = tasks.filter((t) => t.project === projectId);
//   let start = projectTasks[0].start;
//   let end = projectTasks[0].end;

//   for (let i = 0; i < projectTasks.length; i++) {
//     const task = projectTasks[i];
//     if (start.getTime() > task.start.getTime()) {
//       start = task.start;
//     }
//     if (end.getTime() < task.end.getTime()) {
//       end = task.end;
//     }
//   }
//   return [start, end];
// }
export default AllTasks;
 