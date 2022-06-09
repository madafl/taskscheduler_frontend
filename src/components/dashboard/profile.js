import React, { useEffect, useState } from "react";
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
} from "mdb-react-ui-kit";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import DataService from "../../services/http-request";

// get all projects for user and put them in a gantt diagram
// cards - numbers of active projects,
// number of todo cards

const Profile = props => {
  const [basicActive, setBasicActive] = useState("tab1");
  const handleBasicClick = value => {
    if (value === basicActive) {
      return;
    }

    setBasicActive(value);
  };

  const [projects, setProjects] = useState([]);
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
    <>
      {console.log(projects)}
      <MDBTabs pills className="mb-3 mt-2">
        <MDBTabsItem>
          <MDBTabsLink
            className="profile-tabs"
            onClick={() => handleBasicClick("tab1")}
            active={basicActive === "tab1"}
          >
            Proiecte
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink
            className="profile-tabs"
            onClick={() => handleBasicClick("tab2")}
            active={basicActive === "tab2"}
          >
            Statistici
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>
        <MDBTabsPane show={basicActive === "tab1"}>Tab 1 content</MDBTabsPane>
        <MDBTabsPane show={basicActive === "tab2"}>Tab 2 content</MDBTabsPane>
      </MDBTabsContent>
    </>
  );
};

export default Profile;
