import http from "../http-common";

class DataService{
    getAll() {
        return http.get("/tasks");
    } 
    get(id){
      return http.get(`/id/${id}`);
    }
    createUser(data) {
        return http.post(`/register?username=${data.username}&email=${data.email}&password=${data.password}`,data)
    }

    login(data) {
      return http.post(`/login?username=${data.username}&password=${data.password}`, data)
    }
    //http://localhost:5000/api/route/task?title=test&body=testbody&name=mada
    createTask(data) {
      const token = localStorage.getItem('token');
      return http.post(`/task?title=${data.title}&body=${data.body}&name=${data.name}&start=${data.start}&end=${data.end}&progress=${data.progress}`, data, { headers :  {'Authorization': `${JSON.parse(token)}`}});
    }
  // http://localhost:5000/api/v1/restaurants/review?text=very good soup22&review_id=61d424f2afb6c9114a0a2073&user_id=1234&name=madafl
    updateTask(data) {
        console.log(data)
        return http.put(`/task?title=${data.text}&task_id=${data.task_id}&name=${data.name}`, data);
    }

    deleteTask(id, name) {
        return http.delete(`/task?id=${id}&name=${name}`);
    }
   

}

export default new DataService();