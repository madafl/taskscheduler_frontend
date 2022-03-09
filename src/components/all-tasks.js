import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import DataService from "../services/http-request";
import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import moment from 'moment';
// list of the rest from database

const AllTasks = props => {
  
    const [tasks, setTasks] = useState([]); // all restaurants
    
    useEffect(() => {
      retrieveTasks();
     
    });
    
    const retrieveTasks = () => {
        DataService.getAll()
        .then(response => {
            setTasks(response.data.tasks); 
        })
        .catch(e => {
        console.log(e);
        });
    };

    const convertDate = (date) => {
        const newDate = new Date(Date.parse(date));
        return newDate;
    }
    
    
    
    let tasks2 = [
      {
        start: new Date(2020, 1, 1),
        end: new Date(2020, 1, 2),
        name: 'Idea',
        id: 'Task 0',
        type:'task',
        progress: 45,
        isDisabled: true,
        styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
      },
      {
        start: new Date(2020, 1, 3),
        end: new Date(2020, 1,7),
        name: 'Idea2', 
        id: 'Task 1',
        type:'project',
        progress: 25,
        isDisabled: true,
        styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
      },
      {
      name:"task 1",
      body:"descriere task 1",
      start:new Date('03/09/22'),
      end:new Date('03/09/22'),
      progress:"50",
    
    }
  ];
  

  return (
    <div>
        <div className="row">
        <Gantt tasks={tasks2} />
      
        {tasks.map((task, index) => {
            // 2022-03-09T22:00:00.000Z
            // Mon Mar 07 2022 16:41:34 GMT+0200 (Eastern European Standard Time
            // new Date(Date.parse(task.date[0])) converting date
            return (
            <div className="col-lg-4 pb-1" key={index}>
                <div className="card">
                    
                <div className="card-body" >
                    <h5 className="card-title" >{task.name}</h5>
                    <p className="card-text">
                      {/* <strong>Descriere: </strong>{task.body}<br/> */}
                      <strong>Start: </strong>{moment.utc(task.start).format('MM/DD/YY')}<br/>
                      <strong>End: </strong>{moment.utc(task.end).format('MM/DD/YY')}<br/>
                      <strong>Progress: </strong>{task.progress}<br/>
                      {/* <strong>User Id: </strong>{task.user_info.user_id}<br/> */}
                    </p>
                    <div className="row">
                    </div>
                </div>
                </div>
                
            </div>
            );
        })}
        </div> 
    </div>
  );
}

export default AllTasks;
 