import React, { useState, useEffect } from "react";
import DataService from "../../services/http-request";
import ChangeViewMode from "./changeViewMode";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import AddTask from "./add-task";
import TasksSettings from "./tasks-settings";
import { useParams } from "react-router-dom";

const AllTasks = props => {
  const { id } = useParams(); //idul proiectului

  const [tasks, setTasks] = useState([]); // toate taskurile proiectului
  const [project, setProject] = useState([]); // proiectul
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
  let columnWidth = 60;
  if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }
  const retrieveTasks = () => {
    DataService.getTasksByProjectId(id)
      .then(response => {
        if (response.data.length === 0) {
          setShowGantt(false);
        } else {
          response.data[0].map(pr => {
            const newProject = {
              start: new Date(pr.start),
              end: new Date(pr.end),
              name: pr.name,
              id: pr._id,
              type: pr.type,
              progress: Number(pr.progress),
              hideChildren: false,
            };
            setProject(newProject);
            return tasks.push(newProject);
          });

          response.data[1].map(task => {
            const newTask = {
              start: new Date(task.start),
              end: new Date(task.end),
              name: task.name,
              id: task._id,
              type: task.type, // project, milestone, task
              progress: Number(task.progress),
              // styles: {
              //   backgroundColor: task.backgroundColor,
              //   backgroundSelectedColor: task.backgroundColor,
              //   progressColor: task.progressColor,
              //   progressSelectedColor: task.progressColor,
              // },
              // isDisabled: false, //cant be modified
              // project: project, // proiectul de care apartine?
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
  const handleTaskChange = task => {
    let newTasks = tasks.map(t => {
      if (t.id === task.id) {
        const data = {
          task_id: task.id,
          start: task.start,
          end: task.end,
        };
        DataService.updateDateProgressTask(data, "date")
          .then(response => {
            if (response.data.status === 200) {
              setTasks(newTasks);
            }
          })
          .catch(e => {
            console.log(e);
          });
        return task;
      } else {
        return t;
      }
    });
  };
  const handleProgressChange = task => {
    let newTasks = tasks.map(t => {
      if (t.id === task.id) {
        const data = {
          task_id: task.id,
          progress: task.progress,
        };
        DataService.updateDateProgressTask(data, "progress")
          .then(response => {
            if (response.data.status === 200) {
              setTasks(newTasks);
            }
          })
          .catch(e => {
            console.log(e);
          });
        return task;
      } else {
        return t;
      }
    });
  };
  useEffect(() => {
    retrieveTasks();
    const div = document.getElementById("root");
    div.addEventListener("click", e => {
      getEl(e);
    });
  }, []);

  const handleTaskDelete = task => {
    var data = {
      id: task.id,
      name: props.user.username,
    };
    DataService.deleteTask(data)
      .then(response => {
        setShowEditDeletePopup(false);
        if (response.status === 200) {
          setTasks(tasks.filter(t => t.id !== task.id));
          alert("Taskul a fost sters cu succes!");
        }
      })
      .catch(e => {
        if (e.response.status === 401) {
          alert("Nu ai permisiunea sa stergi aceast task!");
        } else {
          console.log(e);
        }
      });
  };

  // const handleProgressChange = task => {
  //   setTasks(tasks.map(t => (t.id === task.id ? task : t)));
  // };
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
        <ChangeViewMode
          onViewModeChange={viewMode => setView(viewMode)}
          onViewListChange={setIsChecked}
          isChecked={isChecked}
        />
        <hr></hr>
        <div>
          {showGantt && tasks.length !== 0 ? (
            <div>
              <Gantt
                tasks={tasks}
                viewMode={view}
                onDateChange={handleTaskChange}
                onProgressChange={handleProgressChange}
                onDelete={handleTaskDelete}
                listCellWidth={isChecked ? "155px" : ""}
                onDoubleClick={handleDoubleClick}
                columnWidth={columnWidth}
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
