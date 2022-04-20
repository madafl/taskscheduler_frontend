import React, { useState, useEffect, useRef } from "react";
import { usePopper } from "react-popper";

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
              <button
                type="button"
                className="btn btn-danger btn-sm mr-3 settings"
                onClick={() => props.handleTaskDelete(task)}
              >
                Sterge
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm settings"
                onClick={() => props.editTask(task.id)}
              >
                Editeaza
              </button>
            </div>
            <div id="arrow" data-popper-arrow></div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default TasksSettings;
