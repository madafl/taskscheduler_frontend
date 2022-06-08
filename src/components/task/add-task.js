import React, { useState } from "react";
import TaskPopup from "./task-popup";
import { MDBBtn } from "mdb-react-ui-kit";

const AddTask = props => {
  let initialTaskState = {
    name: "",
    description: "",
    progress: 0,
    type: "task",
    dependencies: [],
    backgroundColor: "#AEB8C2",
    progressColor: "#8282F5",
    start: new Date(),
    end: new Date(),
  };
  const [task, setTask] = useState(initialTaskState);
  const [basicModal, setBasicModal] = useState(false);

  const toggleShow = () => {
    setBasicModal(!basicModal);
  };

  return (
    <div>
      {props.user ? (
        <div className="submit-form">
          <MDBBtn onClick={toggleShow} className="mt-3">
            Adauga
          </MDBBtn>
          <TaskPopup
            task={task} // task gol
            minStartDate={props.minStartDate} // data de inceput a proiectului pt datepicker
            maxEndDate={props.maxEndDate} // data de sfarsit a proiectului pt datepicker
            toggleShow={toggleShow} //pt modal
            basicModal={basicModal} // pt modal
            setBasicModal={setBasicModal} // pt modal
            project_name={props.project.name} // numele proiectului
            project_id={props.project.id} // id-ul proiectului
            user={props.user} // userul logat pt post
            editing={false} // adauga nu editeaza
          />
        </div>
      ) : (
        <div>Trebuie sa fii autentificat pentru a accesa aceasta pagina.</div>
      )}
    </div>
  );
};

export default AddTask;
