import React, { useEffect } from "react";
import CreateProject from "./create-project";
import DataService from "../services/http-request";
import { Link } from "react-router-dom";
//start end name id progress type hideChildren membri

const AllProjects = props => {
  const [projects, setProjects] = React.useState([]);

  useEffect(() => {
    retrieveProjects();
  }, []);

  const retrieveProjects = () => {
    DataService.getProjects()
      .then(response => {
        setProjects(response.data.projects);
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
      {projects !== [] ? (
        <div className="row">
          {projects.map((project, index) => (
            <div className="col-sm-6">
              <div className="card" key={index}>
                <h5 className="card-title m-3">{project.name}</h5>
                <div className="card-body">
                  <p className="card-text"></p>
                  <div className="progress">
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated active"
                      role="progressbar"
                      aria-valuenow="24"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{ width: `${project.progress}%` }}
                    >
                      {project.progress}%
                    </div>
                  </div>
                  <Link
                    to={`/project/${project._id}`}
                    className="btn btn-primary mt-3"
                    key={project._id}
                  >
                    Deschide
                  </Link>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-3">
            <CreateProject user={props.user} />
          </div>
        </div>
      ) : (
        <div>
          <CreateProject user={props.user} />
        </div>
      )}
    </div>
  );
};

export default AllProjects;
