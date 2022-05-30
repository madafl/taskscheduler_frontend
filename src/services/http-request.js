import http from "../http-common";

class DataService {
  // TASKS
  getAllTasks() {
    return http.get("/tasks");
  }
  getTask(id) {
    return http.get(`/task/${id}`);
  }
  getTasksByProjectId(id) {
    return http.get(`/project/${id}`);
  }
  //http://localhost:5000/api/route/task?title=test&body=testbody&name=mada
  createTask(data) {
    const token = localStorage.getItem("token");

    return http.post(
      `/task?title=${data.title}&body=${data.body}&name=${data.name}&start=${data.start}&end=${data.end}&progress=${data.progress}&project_id=${data.project_id}`,
      data,
      { headers: { Authorization: `${JSON.parse(token)}` } }
    );
  }
  updateTask(data) {
    return http.put(
      `/task?title=${data.text}&task_id=${data.task_id}&name=${data.name}`,
      data
    );
  }
  deleteTask(data) {
    const token = localStorage.getItem("token");
    return http.delete(
      `/task?task_id=${data.id}&name=${data.name}`,
      {
        headers: {
          Authorization: `${JSON.parse(token)}`,
        },
      },
      data
    );
  }
  updateDateProgressTask(data, updated_element) {
    const token = localStorage.getItem("token");
    return http.put(
      `/task/update?task_id=${data.task_id}&updated_element=${updated_element}`,
      data,
      {
        headers: {
          Authorization: `${JSON.parse(token)}`,
        },
      }
    );
  }
  // USER
  createUser(data) {
    return http.post(
      `/register?username=${data.username}&email=${data.email}&password=${data.password}`,
      data
    );
  }
  login(data) {
    return http.post(
      //  `/login?email=${data.email}&password=${data.password}`,
      `/login?email=${data.email}`,
      data
    );
  }
  getUserById(id) {
    return http.get(`/user/${id}`);
  }

  getProjects() {
    const token = localStorage.getItem("token");
    return http.get("/projects", {
      headers: {
        Authorization: `${JSON.parse(token)}`,
      },
    });
  }
  // PROJECTS
  // getProjectById(id) {
  //   return http.get(`/project/${id}`);
  // }
  createProject(data) {
    return http.post(
      `/project?name=${data.name}&start=${data.start}&end=${data.end}&progress=${data.progress}&type=${data.type}`,
      data
    );
  }
  editProject(data) {
    const token = localStorage.getItem("token");
    return http.put(`/project?&project_id=${data.project_id}`, data, {
      headers: {
        Authorization: `${JSON.parse(token)}`,
      },
    });
  }
  deleteProject(data) {
    const token = localStorage.getItem("token");
    return http.delete(
      `/project?project_id=${data.project_id}`,
      {
        headers: {
          Authorization: `${JSON.parse(token)}`,
        },
      },
      data
    );
  }
  find(filter) {
    const token = localStorage.getItem("token");
    return http.get(`/projects?filter=${filter}`, {
      headers: {
        Authorization: `${JSON.parse(token)}`,
      },
    });
  }
}
export default new DataService();
