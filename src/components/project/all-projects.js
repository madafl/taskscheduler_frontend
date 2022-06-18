import React, { useEffect, useState } from "react";
import CreateProject from "./create-project";
import DataService from "../../services/http-request";
import { Link } from "react-router-dom";
import EditProject from "./edit-project";
import Select from "react-select";
import {
  MDBRow,
  MDBCol,
  MDBProgress,
  MDBProgressBar,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBIcon,
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";

const AllProjects = props => {
  const [basicModal, setBasicModal] = useState(false);
  const [openedModal, setOpenedModal] = useState("");
  const [projects, setProjects] = useState([]);
  const [editProject, setEditProject] = useState(false);
  const [selectedOption, setSelectedOption] = useState({
    label: "Toate proiectele",
    value: "all",
  });
  const selectOptions = [
    {
      label: "Toate proiectele",
      value: "all",
    },
    { label: "Proiectele mele", value: "mine" },
    { label: "Proiecte din care fac parte", value: "shared" },
    { label: "Proiecte active", value: "active" },
    { label: "Proiecte inactive", value: "inactive" },
    { label: "Proiecte complete", value: "completed" },
  ];

  const toggleShow = modal_id => {
    setBasicModal(!basicModal);
    setOpenedModal(modal_id);
  };

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
  const handleProjectDelete = id => {
    var data = {
      project_id: id,
    };
    DataService.deleteProject(data)
      .then(response => {
        if (response.status === 200) {
          setProjects(projects.filter(p => p.id !== id));
          refreshProjects();
        }
      })
      .catch(e => {
        if (e.response.status === 401) {
          console.log(e.response.status);
        } else {
          console.log(e.response.status);
        }
      });
  };
  const refreshProjects = () => {
    retrieveProjects();
  };
  const find = filter => {
    DataService.find(filter)
      .then(response => {
        setProjects(response.data.projects);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const handleChange = e => {
    setSelectedOption(e);
    if (e.value === "all") {
      refreshProjects();
    } else {
      find(e.value);
    }
  };

  return (
    <>
      {projects === [] ? (
        <div className="mt-2">
          <CreateProject user={props.user} refreshProjects={refreshProjects} />
        </div>
      ) : (
        <MDBRow>
          <div className="mt-2">
            <CreateProject
              user={props.user}
              refreshProjects={refreshProjects}
            />
            <Select
              options={selectOptions}
              value={selectedOption}
              onChange={handleChange}
              className=" filter mt-2 mb-2"
            />
          </div>
          {projects.map((project, index) => (
            <MDBCol md="6" className="mt-2" key={index}>
              <MDBCard className="mt-2 me-2">
                <MDBCardBody>
                  <MDBCardTitle>{project.name}</MDBCardTitle>
                  {/* <MDBCardText >Text</MDBCardText> */}
                  <MDBProgress className="mt-4" height="20">
                    <MDBProgressBar
                      width={project.progress}
                      valuemin={0}
                      valuemax={100}
                      {...(project.progress === 100
                        ? { bgColor: "success" }
                        : {})}
                    >
                      {Math.floor(project.progress)} %
                    </MDBProgressBar>
                  </MDBProgress>
                  <Link
                    to={`/project/${project._id}`}
                    state={{ project: project }}
                    className="btn btn-primary mt-3 me-3"
                    key={project._id}
                  >
                    Deschide
                  </Link>

                  <Link
                    to={`/graphs/${project._id}`}
                    className="position-absolute top-0 end-0 mt-3"
                    state={{ project: project }}
                  >
                    <MDBIcon fas icon="chart-pie fa-lg mt-2 chart-pie" />
                  </Link>
                  {project.project_owner_id === props.userId ? (
                    <>
                      <EditProject
                        project={project}
                        user={props.user}
                        editProject={editProject}
                        setEditProject={setEditProject}
                      />
                      <MDBIcon
                        fas
                        icon="trash-alt fa-lg"
                        onClick={() => toggleShow("modal" + project._id)}
                        className="position-absolute bottom-0 end-0 m-3 mb-4"
                      />
                      {openedModal === "modal" + project._id && basicModal ? (
                        <MDBModal
                          show={basicModal}
                          setShow={setBasicModal}
                          tabIndex="-1"
                          id={"modal" + project._id}
                        >
                          <MDBModalDialog>
                            <MDBModalContent>
                              <MDBModalHeader>
                                <MDBBtn
                                  className="btn-close"
                                  color="none"
                                  onClick={() =>
                                    toggleShow("modal" + project._id)
                                  }
                                ></MDBBtn>
                              </MDBModalHeader>
                              <MDBModalBody>
                                <h4>
                                  Esti sigur ca vrei sa stergi proiectul{" "}
                                  <b>{project.name}</b> ?
                                </h4>
                              </MDBModalBody>
                              <MDBModalFooter>
                                <MDBBtn
                                  color="grey"
                                  onClick={() =>
                                    toggleShow("modal" + project._id)
                                  }
                                >
                                  Renunta
                                </MDBBtn>
                                <MDBBtn
                                  color="danger"
                                  onClick={() =>
                                    handleProjectDelete(project._id)
                                  }
                                >
                                  Sterge
                                </MDBBtn>
                              </MDBModalFooter>
                            </MDBModalContent>
                          </MDBModalDialog>
                        </MDBModal>
                      ) : null}
                    </>
                  ) : null}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          ))}
        </MDBRow>
      )}
    </>
  );
};

export default AllProjects;
