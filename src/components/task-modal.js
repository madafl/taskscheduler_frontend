import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { ro } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("ro", ro);



const TaskPopup = props => {

    const onChange = (dates) => {
        const [start, end] = dates;
        props.setStartDate(start);
        props.setEndDate(end);
      };

    return (
        <div>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
            Create Task
            </button>

            <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                
                <div class="modal-body">
                    {props.submitted ? (
                    <h4>You submitted successfully!</h4>
                ) : (
                    <div>
                    <div class="form-group">
                        <label for="title">Titlu</label>
                        <input type="text" class="form-control" id="title" aria-describedby="title" onChange={props.handleInputChange} placeholder="Adauga un titlu" name="title" />
                    </div>
                    <div className="form-group">
                    <label for="title">Descriere</label>
                    <textarea
                        className="form-control"
                        required
                        value={props.task.description}
                        onChange={props.handleInputChange}
                        name="description"
                    />
                    </div>
                    <div className="form-group">
                    <label for="dateInterval">Interval</label>
                    <DatePicker
                    selectsRange={true}
                    startDate={props.startDate}
                    endDate={props.endDate}
                    onChange={onChange}
                    dateFormat="d MMMM yyyy "
                    shouldCloseOnSelect={false}
                    name="dateRange"
                    locale="ro"
                    withPortal
                    />
                    <div>
                        <label for="progress" class="form-label">Progres {props.task.progress}%</label>
                        <input type="range" class="form-range" id="progress" min="0" max="100" name="progress" step="5" onChange={props.handleInputChange}></input>
                    </div>
                    </div>
                    <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Renunta</button>
                    {props.task.description !== "" ? 
                        <button onClick={props.saveTask} className="btn btn-success" >
                        Submit
                        </button>
                        :  
                        <button onClick={props.saveTask} className="btn btn-success" disabled >
                        Submit
                        </button>
                    }
                </div>
                    </div>
                    )}
                </div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default TaskPopup;