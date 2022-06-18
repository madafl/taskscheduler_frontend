import React, { useEffect, useState } from "react";
import TaskPopup from "./task-popup";
import "react-datepicker/dist/react-datepicker.css";

const EditTask = props => {
  const [basicModal, setBasicModal] = useState(false);
  const toggleShow = () => {
    setBasicModal(!basicModal);
    props.setEditing(!props.editing);
  };

  useEffect(() => {
    if (props.editing) {
      setBasicModal(true);
    }
  }, [props.editing]);

  return (
    <div>
      {props.user ? (
        <div className="submit-form">
          <TaskPopup
            task={props.task}
            minStartDate={props.minStartDate}
            maxEndDate={props.maxEndDate}
            toggleShow={toggleShow}
            basicModal={basicModal}
            setBasicModal={setBasicModal}
            project_name={props.project.name}
            project_id={props.project.id}
            user={props.user}
            editing={props.editing}
            setEditing={props.setEditing}
            team={props.team}
          />
        </div>
      ) : (
        <div>Trebuie sa fii autentificat pentru a accesa aceasta pagina.</div>
      )}
    </div>
  );
};

export default EditTask;
