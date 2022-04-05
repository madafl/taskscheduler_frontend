import React,{ useState, useEffect, useRef } from 'react';

const TasksSettings = props => {

  var styles={
    position: 'relative',
    top: (Number(props.clickedElementPosition.top) - 432) + 'px',
    left: (Number(props.clickedElementPosition.left) - 15) + 'px',
    bottom: props.clickedElementPosition.bottom + 'px',
    right: props.clickedElementPosition.right + 'px',
    x: props.clickedElementPosition.x + 'px',
    y: props.clickedElementPosition.y + 'px',
    zIndex: 9999,
  }

  const createPopper = () => {
    const popup = document.querySelector('#tooltip' + props.taskId);
    const tooltip = document.querySelector('#tooltip');
    createPopper(popup, tooltip, {
      placement: 'top',
    });
  }

  return (
    <>
      {props.show ? 
      <>
      <div id={`tooltip${props.id}`} aria-describedby="tooltip" className="displayOver"></div>
        <div id="tooltip" role="tooltip" style={styles}>
        <div>
            <button type="button btn-xs" className="btn btn-danger">Sterge</button>
            <button type="button btn-xs" className="btn btn-primary" data-dismiss="modal">Editeaza</button>
        </div>
        <div id="arrow" data-popper-arrow></div>
        </div>
      </>: (null)
    }
    </>
  )
}

export default TasksSettings;