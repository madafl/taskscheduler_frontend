import React from "react";
import { ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { MDBBtn, MDBBtnGroup, MDBSwitch } from "mdb-react-ui-kit";

const ChangeViewMode = ({ onViewModeChange, onViewListChange, isChecked }) => {
  return (
    <>
      <MDBBtnGroup className="mt-3" aria-label="Basic example">
        <MDBBtn onClick={() => onViewModeChange(ViewMode.Hour)}>Ora</MDBBtn>
        <MDBBtn onClick={() => onViewModeChange(ViewMode.QuarterDay)}>
          Sfert de zi
        </MDBBtn>
        <MDBBtn onClick={() => onViewModeChange(ViewMode.HalfDay)}>
          Jumatate de zi
        </MDBBtn>
        <MDBBtn onClick={() => onViewModeChange(ViewMode.Day)}>Zi</MDBBtn>
        <MDBBtn onClick={() => onViewModeChange(ViewMode.Week)}>
          Saptamana
        </MDBBtn>
        <MDBBtn onClick={() => onViewModeChange(ViewMode.Month)}>Luna</MDBBtn>
      </MDBBtnGroup>
      <MDBSwitch
        defaultChecked={isChecked}
        onClick={() => onViewListChange(!isChecked)}
        id="display"
        label="Afiseaza doar taskurile"
      />
    </>
  );
};

export default ChangeViewMode;
