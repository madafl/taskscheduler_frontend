import React, { useEffect, useState } from "react";
import DataService from "../../services/http-request.js";
import { useParams } from "react-router-dom";
import {
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCardTitle,
  MDBCardText,
  MDBCol,
} from "mdb-react-ui-kit";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Graphs = () => {
  const { id } = useParams(); //id-ul proiectului
  const [tasks, setTasks] = useState([]); // toate taskurile proiectului
  const labels_by_status = ["In lucru", "In asteptare", "Finalizat"];
  const [tasks_by_status, set_tasks_by_status] = useState([]);
  const [labels_by_member, set_labels_by_member] = useState([]); // username from db
  const [tasks_by_member, set_tasks_by_member] = useState([]);

  const retrieveTasks = () => {
    var todo = 0;
    var doing = 0;
    var done = 0;
    DataService.getTasksByProjectId(id)
      .then(response => {
        response.data[1].map(task => {
          if (task.type === "task") {
            if (task.progress === 0) {
              todo += 1;
            } else if (task.progress > 0 && task.progress < 100) {
              doing += 1;
            } else {
              done += 1;
            }
          }
        });
        set_tasks_by_status([todo, doing, done]);
        setTasks(response.data[1]);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const groupTasksByMember = () => {
    DataService.groupTasksByMember(id)
      .then(response => {
        const count_array = [];
        const labels_array = [];
        response.data.map(member => {
          count_array.push(member.count);
          labels_array.push(member.user);
        });
        set_labels_by_member(labels_array);
        set_tasks_by_member(count_array);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const data_tasks_by_status = {
    labels: labels_by_status,
    datasets: [
      {
        label: "Taskuri",
        data: tasks_by_status,
        backgroundColor: "#5FA8C9",
      },
    ],
  };
  const options = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: { ticks: { stepSize: 1 } },
    },
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const data_tasks_by_member = {
    labels: labels_by_member,
    datasets: [
      {
        label: "Taskuri",
        data: tasks_by_member,
        backgroundColor: "#5FA8C9",
      },
    ],
  };
  useEffect(() => {
    retrieveTasks();
    groupTasksByMember();
  }, []);
  return (
    <MDBRow className="mt-4">
      <MDBCol sm="6">
        <MDBCard style={{ maxWidth: "95%" }}>
          <MDBCardBody>
            <MDBCardTitle>Numarul taskurilor in functie de status</MDBCardTitle>
            <MDBCardText className="mt-3">
              <Bar data={data_tasks_by_status} options={options} />
            </MDBCardText>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
      <MDBCol sm="6">
        <MDBCard style={{ maxWidth: "95%" }}>
          <MDBCardBody>
            <MDBCardTitle>Numarul taskurilor pe membru</MDBCardTitle>
            <MDBCardText className="mt-3">
              <Bar data={data_tasks_by_member} options={options} />
            </MDBCardText>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  );
};

export default Graphs;
