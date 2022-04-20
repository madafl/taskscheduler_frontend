import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import DataService from "../services/http-request";
import ChangeViewMode from "./changeViewMode";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import AddTask from "./add-task";
import TasksSettings from "./tasks-settings";
import { useParams } from "react-router-dom";

const AllTasks = props => {
  const { id } = useParams(); //idul proiectului

  const [tasks, setTasks] = useState([]); // toate taskurile proiectului
  const [view, setView] = React.useState(ViewMode.Day); // modul de vizualizare al taskurilor (day, week, month)
  const [isChecked, setIsChecked] = React.useState(true);
  const [showEditDeletePopup, setShowEditDeletePopup] = useState(false); // afisare popup la dubluClick pe task
  const [task, setTask] = useState({}); // taskul selectat
  const [showGantt, setShowGantt] = useState(false); // afisare gantt
  const [clickedElement, setClickedElement] = useState(""); // elementul selectat
  const [clickedElementPosition, setClickedElementPosition] = useState({
    // pozitia elementului selectat
    left: "",
    right: "",
    top: "",
    bottom: "",
    x: "",
    y: "",
  });

  const retrieveTasks = () => {
    DataService.getTasksByProjectId(id)
      .then(response => {
        if (response.data.length === 0) {
          setShowGantt(false);
        } else {
          response.data.map(task => {
            const newTask = {
              start: new Date(task.start),
              end: new Date(task.end),
              name: task.name,
              id: task._id,
              type: task.type, // project, milestone, task
              progress: Number(task.progress),
              styles: {
                backgroundColor: task.backgroundColor,
                backgroundSelectedColor: task.backgroundColor,
                progressColor: task.progressColor,
                progressSelectedColor: task.progressColor,
              },
              // isDisabled: false, //cant be modified
              // project: "Project 1", // proiectul de care apartine?
              // dependencies:[],
              // hideChildren: false,
              // displayOrder: 2,
            };
            return tasks.push(newTask);
          });
          setShowGantt(true);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    retrieveTasks();
    const div = document.getElementById("root");
    div.addEventListener("click", e => {
      getEl(e);
    });
  }, []);

  const handleTaskChange = task => {
    let newTasks = tasks.map(t => (t.id === task.id ? task : t)); // newTask este taskul modificat
    setTasks(newTasks);
  };
  const handleTaskDelete = task => {
    var data = {
      id: task.id,
      name: props.user.username,
    };
    DataService.deleteTask(data)
      .then(response => {
        setTasks(tasks.filter(t => t.id !== task.id));
        setShowEditDeletePopup(false);
        if (response.status === 200) {
          alert("Taskul a fost sters cu succes!");
        }
      })
      .catch(e => {
        if (e.response.status === 401) {
          alert("Nu ai permisiunea sa stergi aceasta task!");
        } else {
        }
      });
  };
  const handleProgressChange = task => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));
  };
  const handleDoubleClick = task => {
    setTask(task);
    setShowEditDeletePopup(!showEditDeletePopup);
  };
  const getEl = e => {
    const element = e.target;
    const parentTag = element.parentNode.tagName;
    const parentClass = element.parentNode.className;
    const parent2Class = element.parentNode.parentNode.className;

    if (
      element.tagName === "rect" &&
      parentTag === "g" &&
      parentClass.baseVal === "" &&
      parent2Class.baseVal !== "handleGroup"
    ) {
      element.addEventListener("click", ({ clientX: x, clientY: y }) => {
        virtualElement.getBoundingClientRect = generateGetBoundingClientRect(
          x,
          y
        );
        setClickedElementPosition({ x: x, y: y });
      });
    } else if (element.classList.contains("settings")) {
      setShowEditDeletePopup(true);
    } else {
      setShowEditDeletePopup(false);
    }
  };

  function generateGetBoundingClientRect(x, y) {
    // pozitia cursorului
    return () => ({
      width: 0,
      height: 0,
      x: x,
      y: y,
    });
  }

  const virtualElement = {
    // virtual element va avea coordonatele cursorului
    getBoundingClientRect: generateGetBoundingClientRect(),
  };

  return (
    <div onClick={getEl}>
      <div>
        <ChangeViewMode onViewModeChange={viewMode => setView(viewMode)} />
        <hr></hr>
        <div>
          {showGantt ? (
            <div>
              <Gantt
                tasks={tasks}
                viewMode={view}
                onDateChange={handleTaskChange}
                onDelete={handleTaskDelete}
                listCellWidth={isChecked ? "155px" : ""}
                onDoubleClick={handleDoubleClick}
              />
              <AddTask user={props.user} projectId={id} />
            </div>
          ) : (
            <AddTask user={props.user} projectId={id} />
          )}
          {showEditDeletePopup ? (
            <TasksSettings
              showEditDeletePopup={showEditDeletePopup}
              task={task}
              clickedElementPosition={clickedElementPosition}
              clickedElement={clickedElement}
              handleTaskDelete={handleTaskDelete}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AllTasks;
