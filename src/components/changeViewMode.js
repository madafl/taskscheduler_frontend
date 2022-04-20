import React from "react";
import { ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";

const ChangeViewMode = ({ onViewModeChange, onViewListChange, isChecked }) => {
  return (
    <div className="btn-group" role="group">
      <input
        type="radio"
        className="btn-check"
        name="btnradio"
        id="btnradio"
        autoComplete="off"
        onClick={() => onViewModeChange(ViewMode.Hour)}
      />
      <label className="btn btn-outline-primary" htmlFor="btnradio">
        Ora
      </label>
      <input
        type="radio"
        className="btn-check"
        name="btnradio"
        id="btnradio1"
        autoComplete="off"
        onClick={() => onViewModeChange(ViewMode.QuarterDay)}
      />
      <label className="btn btn-outline-primary" htmlFor="btnradio1">
        Quarter Of Day
      </label>

      <input
        type="radio"
        className="btn-check"
        name="btnradio"
        id="btnradio2"
        autoComplete="off"
        onClick={() => onViewModeChange(ViewMode.HalfDay)}
      />
      <label className="btn btn-outline-primary" htmlFor="btnradio2">
        Half a Day
      </label>

      <input
        type="radio"
        className="btn-check"
        name="btnradio"
        id="btnradio3"
        autoComplete="off"
        onClick={() => onViewModeChange(ViewMode.Day)}
      />
      <label className="btn btn-outline-primary" htmlFor="btnradio3">
        Zi
      </label>
      <input
        type="radio"
        className="btn-check"
        name="btnradio"
        id="btnradio4"
        autoComplete="off"
        onClick={() => onViewModeChange(ViewMode.Week)}
      />
      <label className="btn btn-outline-primary" htmlFor="btnradio4">
        Saptamana
      </label>
      <input
        type="radio"
        className="btn-check"
        name="btnradio"
        id="btnradio5"
        autoComplete="off"
        onClick={() => onViewModeChange(ViewMode.Month)}
      />
      <label className="btn btn-outline-primary" htmlFor="btnradio5">
        Luna
      </label>
    </div>
    // <div
    //   class="btn-group"
    //   role="group"
    //   aria-label="Basic radio toggle button group"
    // >
    //   <input
    //     type="radio"
    //     class="btn-check"
    //     name="btnradio"
    //     id="btnradio1"
    //     autoComplete="off"
    //     onClick={() => onViewModeChange(ViewMode.QuarterDay)}
    //   >
    //     Quarter Of Day{" "}
    //   </input>
    //   <label class="btn btn-outline-primary" for="btnradio1"></label>

    //   <input
    //     type="radio"
    //     class="btn-check"
    //     name="btnradio"
    //     id="btnradio1"
    //     autoComplete="off"
    //     onClick={() => onViewModeChange(ViewMode.HalfDay)}
    //   >
    //     <label class="btn btn-outline-primary" for="btnradio1">
    //       Half Of Day
    //     </label>
    //   </input>
    //   <input
    //     type="radio"
    //     class="btn-check"
    //     name="btnradio"
    //     id="btnradio1"
    //     autoComplete="off"
    //     defaultChecked
    //     onClick={() => onViewModeChange(ViewMode.Day)}
    //   />
    //   <label class="btn btn-outline-primary" for="btnradio1">
    //     Zi
    //   </label>
    //   <input
    //     type="radio"
    //     class="btn-check"
    //     name="btnradio"
    //     id="btnradio1"
    //     autoComplete="off"
    //     onClick={() => onViewModeChange(ViewMode.Week)}
    //   />
    //   <label class="btn btn-outline-primary" for="btnradio1">
    //     Saptamana
    //   </label>
    //   <input
    //     type="radio"
    //     class="btn-check"
    //     name="btnradio"
    //     id="btnradio1"
    //     autoComplete="off"
    //     onClick={() => onViewModeChange(ViewMode.Month)}
    //   />
    //   <label class="btn btn-outline-primary" for="btnradio1">
    //     Luna
    //   </label>
    // </div>
  );
};

export default ChangeViewMode;
