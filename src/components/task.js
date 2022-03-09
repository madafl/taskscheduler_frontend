import React, { useState, useEffect } from "react";
import DataService from "../services/http-request";
import { Link, useParams } from "react-router-dom";
// import { useJwt, decodeToken } from "react-jwt";

const Restaurant = props => {
  const {id} = useParams(); //to use the id wildcard
  const initialTaskState = {
    id: null,
    title: "",
    body: "",
  };
  const [task, setTask] = useState(initialTaskState);
  
  const getTask = id => {
    DataService.get(id)
      .then(response => {
        setTask(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  
  useEffect(() => {
    getTask(id);
  }, [id, props]);

//   const deleteTask = (reviewId, index) => {
//     //index= pozitia din array pe care e reviewul sters
//     DataService.deleteReview(reviewId, props.user.username)
//       .then(response => {
//         setTask((prevState) => {
//           prevState.reviews.splice(index, 1)
//           return({
//             ...prevState
//           })
//         })
//       })
//       .catch(e => {
//         console.log(e);
//       });
//   };

  return (
    <div>
      {task ? (
        <div>
          <h5>{task.title}</h5>
          <p>
            <strong>Body </strong>{task.body}<br/>
          </p>
          { props.user.username !== "" ?
            (<Link to={"/tasks/" + id + "/add"} className="btn btn-success">
              Add Task
            </Link>) : (
                <div >
                
                  <Link to={"/login"} className="btn btn-success">
                    Intra in cont pentru a posta un task.
                  </Link>
              </div>
            )}
            <hr></hr>
          <h4 className="top-margin"> Tasks </h4>
        </div>
      ) : (
        <div>
          <br />
          <p>No restaurant selected.</p>
        </div>
      )}
    </div>
  );
};

export default Restaurant;