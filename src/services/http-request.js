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
  getTasksByUserId(id) {
    const token = localStorage.getItem("token");
    return http.get(`/tasks/user/${id}`, {
      headers: {
        Authorization: `${JSON.parse(token)}`,
      },
    });
  }
  //http://localhost:5000/api/route/task?title=test&body=testbody&name=mada
  createTask(data) {
    const token = localStorage.getItem("token");
    return http.post(`/task`, data, {
      headers: { Authorization: `${JSON.parse(token)}` },
    });
  }
  updateTask(data) {
    const token = localStorage.getItem("token");
    return http.put(`/task?task_id=${data.id}`, data, {
      headers: { Authorization: `${JSON.parse(token)}` },
    });
  }
  deleteTask(data) {
    const token = localStorage.getItem("token");
    return http.delete(
      `/task?task_id=${data.task_id}&project_id=${data.project_id}`,
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
  login(data, user_id) {
    return http.post(
      //  `/login?email=${data.email}&password=${data.password}`,
      `/login?email=${data.email}`,
      data
    );
  }
  getUserById(id) {
    return http.get(`/user/${id}`);
  }
  changePassword(data, user_id) {
    const token = localStorage.getItem("token");
    return http.post(`/user/changepassword?user_id=${user_id}`, data, {
      headers: {
        Authorization: `${JSON.parse(token)}`,
      },
    });
  }
  // PROJECTS
  getProjects() {
    const token = localStorage.getItem("token");
    return http.get("/projects", {
      headers: {
        Authorization: `${JSON.parse(token)}`,
      },
    });
  }
  getProjectById(id) {
    return http.get(`/project/${id}`);
  }
  createProject(data) {
    const token = localStorage.getItem("token");
    return http.post(`/project`, data, {
      headers: { Authorization: `${JSON.parse(token)}` },
    });
  }
  updateProject(data) {
    const token = localStorage.getItem("token");
    return http.put(`/project?&project_id=${data._id}`, data, {
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
  groupTasksByMember(id) {
    const token = localStorage.getItem("token");
    return http.get(`/project/members/${id}`, {
      headers: {
        Authorization: `${JSON.parse(token)}`,
      },
    });
  }
}
export default new DataService();
