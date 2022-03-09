import React from 'react';

const Calendar = props => {
  console.log(props.tasks);
    // props.tasks = [
    //     {
    //       id: 'Task 1',
    //       name: 'Redesign website',
    //       start: '2016-12-28',
    //       end: '2016-12-31',
    //       progress: 20,
    //       dependencies: 'Task 2, Task 3',
    //       custom_class: 'bar-milestone' // optional
    //     },
    //   ];
    const handleDateChange = event => {
      console.log(props.task)
   };

  return (
    <div>
     
    </div>
  )
}

export default Calendar;