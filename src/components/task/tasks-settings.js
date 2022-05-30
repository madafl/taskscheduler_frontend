import React, { useState, useEffect, useRef } from "react";
import { MDBBtn } from "mdb-react-ui-kit";

const TasksSettings = props => {
  const task = props.task;

  var stylesTooltipPopup = {
    position: "absolute",
    top: Number(props.clickedElementPosition.y - 45) + "px",
    left: props.clickedElementPosition.x + "px",
    zIndex: 9999,
  };

  return (
    <>
      {props.showEditDeletePopup ? (
        <>
          <div
            id="tooltip"
            role="tooltip"
            style={stylesTooltipPopup}
            className="settings"
          >
            <div>
              <MDBBtn
                className="m-1"
                size="sm"
                color="danger"
                onClick={() => props.handleTaskDelete(task)}
              >
                Sterge
              </MDBBtn>
              <MDBBtn
                className="m-1"
                size="sm"
                // onClick={() => props.editTask(task.id)}
              >
                Editeaza
              </MDBBtn>
            </div>
            <div id="arrow" data-popper-arrow></div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default TasksSettings;
