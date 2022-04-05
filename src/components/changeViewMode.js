import React from 'react';
import { ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";

const ChangeViewMode = ({
    onViewModeChange,
    onViewListChange,
    isChecked
  }) => {
    return (
      <div className="ViewContainer">
        <button
          onClick={() => onViewModeChange(ViewMode.QuarterDay)}
        >
          Quarter of Day
        </button>
        <button
          onClick={() => onViewModeChange(ViewMode.HalfDay)}
        >
          Half of Day
        </button>
        <button  onClick={() => onViewModeChange(ViewMode.Day)}>
          Day
        </button>
        <button
          onClick={() => onViewModeChange(ViewMode.Week)}
        >
          Week
        </button>
        <button
          className="Button"
          onClick={() => onViewModeChange(ViewMode.Month)}
        >
          Month
        </button>
  
        
      </div>
    );
  };

export default ChangeViewMode;
