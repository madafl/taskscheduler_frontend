import React, { useEffect, useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBRow,
  MDBCardTitle,
  MDBTypography,
  MDBCardText,
  MDBCol,
} from "mdb-react-ui-kit";
import moment from "moment";
import { useParams, Link } from "react-router-dom";
import DataService from "../../services/http-request";

const Stats = props => {
  const { id } = useParams(); //id-ul utilizatorului
  const [numberOfProjects, setNumberOfProjects] = useState(0);
  const [dueSoonTasks, setDueSoonTasks] = useState([]);
  const [doingTasks, setDoingTasks] = useState(0);
  const [toDoTasks, setToDoTasks] = useState(0);
  const [project, setProject] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    retrieveData(); // todo, doing, due soon
    retrieveProjects(); // pt proiecte active
    getUser(); //pt email
  });
  //[props]

  const retrieveData = () => {
    DataService.getTasksByUserId(id)
      .then(response => {
        if (response.data.length === 0) {
          console.log("err");
        } else {
          let todo = 0;
          let doing = 0;
          let today = moment(new Date());
          response.data.map(task => {
            if (task.progress > 0 && task.progress < 100) {
              doing += 1;
            } else if (task.progress === 0) {
              todo += 1;
            }
            const end_date = moment(task.end);
            const number_of_days = end_date.diff(today, "days");

            if (
              number_of_days <= 3 &&
              number_of_days > 0 &&
              task.progress !== 100
            ) {
              const newTask = {
                name: task.name,
                start: task.start,
                end: task.end,
                progress: task.progress,
                description: task.description,
                projectId: task.projectId,
              };
              dueSoonTasks.push(newTask);
            }
          });
          setDoingTasks(doing);
          setToDoTasks(todo);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
  const retrieveProjects = () => {
    DataService.getProjects()
      .then(response => {
        let active = 0;
        response.data.projects.map(project => {
          if (project.progress > 0 && project.progress < 100) {
            active += 1;
          }
        });
        setNumberOfProjects(active);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const getProject = id => {
    DataService.getProjectById(id)
      .then(response => {
        setProject(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const getUser = () => {
    DataService.getUserById(id)
      .then(response => {
        setUser(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <>
      <h6 tag="div" className=" pb-3 mb-3 mt-3">
        <i>Utilizator: {user}</i>
      </h6>
      <MDBRow>
        <MDBCol sm="6">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle className="due-soon-tasks">
                Taskuri ce au termen limita mai putin de 3 zile
              </MDBCardTitle>
              <main className="leaderboard__profiles">
                {dueSoonTasks.map((task, index) => (
                  <article className="leaderboard__profile" key={index}>
                    <span className="leaderboard__name main-font-size">
                      {task.name}
                    </span>
                    <span className="description secondary-font-size">
                      {moment(task.end).format("DD-MM-YYYY")}{" "}
                    </span>
                    <Link
                      to={`/project/${task.projectId}`}
                      state={{ project: project }}
                      key={task.projectId}
                      onClick={() => getProject(task.projectId)}
                    >
                      <span className="leaderboard__value">
                        <span>Detalii</span>
                        <MDBIcon fas icon="angle-double-right mx-2" />
                      </span>
                    </Link>
                  </article>
                ))}
              </main>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol sm="2">
          <MDBCard className="mini-card ">
            <MDBCardBody>
              <MDBCardTitle className="main-font-size">
                Taskuri in lucru
              </MDBCardTitle>
              <MDBCardText className="mt-3 "></MDBCardText>
              <p className="profile-cards">{doingTasks}</p>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol sm="2">
          <MDBCard className="mini-card">
            <MDBCardBody>
              <MDBCardTitle className="main-font-size">
                Taskuri de facut
              </MDBCardTitle>
              <MDBCardText className="mt-3 ">
                <p className="profile-cards">{toDoTasks}</p>
              </MDBCardText>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol sm="2">
          <MDBCard className="mini-card">
            <MDBCardBody>
              <MDBCardTitle className="main-font-size">
                Proiecte active
              </MDBCardTitle>
              <MDBCardText className="mt-3 ">
                <p className="profile-cards">{numberOfProjects}</p>
              </MDBCardText>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </>
  );
};

export default Stats;
