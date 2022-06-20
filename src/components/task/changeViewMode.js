import React, { useEffect, useState } from "react";
import { ViewMode } from "gantt-task-react";
import Select from "react-select";
import "gantt-task-react/dist/index.css";
import {
  MDBBtn,
  MDBBtnGroup,
  MDBSwitch,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";

const ChangeViewMode = ({
  onViewModeChange,
  onViewListChange,
  isChecked,
  team,
  goToUserProfile,
}) => {
  return (
    <>
      <MDBRow>
        <MDBCol sm="10">
          <MDBBtnGroup className="mt-3">
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
            <MDBBtn onClick={() => onViewModeChange(ViewMode.Month)}>
              Luna
            </MDBBtn>
          </MDBBtnGroup>
        </MDBCol>
        <MDBCol sm="2">
          <Select
            className="basic-single team-select mt-3"
            classNamePrefix="select"
            options={team}
            onChange={goToUserProfile}
            placeholder="Echipa"
          />
        </MDBCol>
      </MDBRow>
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
