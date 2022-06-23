import React, { useState, useEffect } from "react";
import DataService from "../../services/http-request";
import ChangeViewMode from "./changeViewMode";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import AddTask from "./add-task";
import TasksSettings from "./tasks-settings";
import { useParams, useLocation } from "react-router-dom";
import ReactJsAlert from "reactjs-alert";
import EditTask from "./edit-task";

const AllTasks = props => {
  const { id } = useParams(); //id-ul proiectului
  const location = useLocation(); // folosit pentru a obtine date start si date end din proiect
  const [tasks, setTasks] = useState([]); // toate taskurile proiectului
  const [project, setProject] = useState([]); // proiectul
  const [view, setView] = React.useState(ViewMode.Day); // modul de vizualizare al taskurilor (day, week, month)
  const [isChecked, setIsChecked] = React.useState(true);
  const [showEditDeletePopup, setShowEditDeletePopup] = useState(false); // afisare popup la dubluClick pe task
  const [task, setTask] = useState({}); // taskul selectat
  const [showGantt, setShowGantt] = useState(false); // afisare gantt
  const [editing, setEditing] = useState(false); // editare task
  const [team, setTeam] = useState([]); // echipa proiectului

  // Alerta
  const [statusAlert, setStatusAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState("error");
  const [titleAlert, setTitleAlert] = useState("");
  const [quoteAlert, setQuoteAlert] = useState("");
  const [colorAlert, setColorAlert] = useState("");

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
              // project_owner_id: pr.project_owner_id,
              hideChildren: false,
              members: pr.members,
              styles: {
                progressColor: "#16db93",
                progressSelectedColor: "#12C281",
              },
            };
            // cand adaug proiectul in state, mapez membrii si apelez getUserEmail pentru a obtine emailul lor=> functia va adauga emailul in team
            setProject(newProject);
            getEmailsForTeamMembers(pr.project_owner_id);
            pr.members.map(member => {
              getEmailsForTeamMembers(member);
            });
            return tasks.push(newProject);
          });

          response.data[1].map(task => {
            if (task.type === "task") {
              const newTask = {
                start: new Date(task.start),
                end: new Date(task.end),
                name: task.name,
                description: task.description,
                id: task._id,
                type: task.type,
                status: task.status,
                progress: Number(task.progress),
                styles: {
                  backgroundColor: "#DCDCDC",
                  backgroundSelectedColor: "#c9c9c9",
                  progressColor: "#16db93",
                  progressSelectedColor: "#12C281",
                },
                project: id,
                dependencies: task.dependencies,
                user_info: task.user_info.user_id,
                assigned_user: task.user_info.assigned_user,
              };
              return tasks.push(newTask);
            } else {
              const newTask = {
                start: new Date(task.start),
                end: new Date(task.end),
                name: task.name,
                description: task.description,
                id: task._id,
                type: task.type,
                status: task.status,
                progress: Number(task.progress),
                project: id,
                dependencies: task.dependencies,
                user_info: task.user_info.user_id,
              };
              return tasks.push(newTask);
            }
          });
          setShowGantt(true);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
  // afiseaza taskurile proiectului sau nu
  const handleExpanderClick = task => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));
  };
  // modificarea datestart sau datened a taskului
  const handleTaskChange = task => {
    if (task.project) {
      const [start, end] = [task.start, task.end];
      if (
        project.start.getTime() > start.getTime() ||
        project.end.getTime() < end.getTime()
      ) {
        setTitleAlert("Eroare");
        setQuoteAlert(
          "Taskul nu poate fi plasat in afara perioadei de desfasurare a proiectului!"
        );
        setColorAlert("#D00000");
        setTypeAlert("error");
        setStatusAlert(true);
      } else {
        let newTasks = tasks.map(t => (t.id === task.id ? task : t));
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
        setTasks(newTasks);
      }
    }
  };
  const handleProgressChange = task => {
    let newTasks = tasks.map(t => {
      if (t.id === task.id) {
        const data = {
          task_id: task.id,
          progress: task.progress,
          project_id: project.id,
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
    const data = {
      task_id: task.id,
      project_id: project.id,
    };
    DataService.deleteTask(data)
      .then(response => {
        setShowEditDeletePopup(false);
        if (response.status === 200) {
          setTasks(tasks.filter(t => t.id !== task.id));
          setTitleAlert("Succes");
          setQuoteAlert("Taskul a fost sters cu succes!");
          setTypeAlert("success");
          setStatusAlert(true);
          setColorAlert("#0CCA4A");
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
  const handleEditTask = task => {
    setEditing(!editing);
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

  const getEmailsForTeamMembers = id => {
    DataService.getUserById(id)
      .then(response => {
        const teamForSelect = {
          label: response.data,
          value: id,
        };
        team.push(teamForSelect); // to use in assign person to task
      })
      .catch(e => {
        console.log(e);
      });
  };
  const goToUserProfile = selectedOption => {
    return (window.location.href = `/stats/${selectedOption.value}`);
  };

  return (
    <div onClick={getEl}>
      <div>
        <ChangeViewMode
          onViewModeChange={viewMode => setView(viewMode)}
          onViewListChange={setIsChecked}
          isChecked={isChecked}
          project={project}
          team={team}
          goToUserProfile={goToUserProfile}
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
                onExpanderClick={handleExpanderClick}
                locale={"ro-RO"}
              />

              <AddTask
                user={props.user} // pt user id la post
                minStartDate={location.state.project.start} // data de inceput a proiectului pt datepicker
                maxEndDate={location.state.project.end} // data de sfarsit a proiectului pt datepicker
                project={project} // poriectul - id pt deepndent tasks si nume pt afisare
                team={team}
              />
              <EditTask
                user={props.user}
                minStartDate={location.state.project.start}
                maxEndDate={location.state.project.end}
                editing={editing}
                setEditing={setEditing}
                task={task}
                project={project}
                team={team}
              />
            </div>
          ) : (
            <AddTask
              user={props.user}
              minStartDate={location.state.project.start}
              maxEndDate={location.state.project.end}
              project={project}
              team={team}
            />
          )}
          {showEditDeletePopup ? (
            <TasksSettings
              showEditDeletePopup={showEditDeletePopup}
              task={task}
              clickedElementPosition={clickedElementPosition}
              clickedElement={clickedElement}
              handleTaskDelete={handleTaskDelete}
              handleEditTask={handleEditTask}
            />
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
        </div>
      </div>
    </div>
  );
};

export default AllTasks;
