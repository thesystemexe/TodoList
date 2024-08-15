import React, { useEffect, useState } from "react";
import "./task.css";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";

function Task() {
  const [task, setTask] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [done, setDone] = useState([]);

  const handleTask = async (e) => {
    e.preventDefault();
    let result = await fetch("http://localhost:5000/create/", {
      method: "POST",
      body: JSON.stringify({ task }),
      headers: {
        "Content-type": "application/json",
      },
    });
    result = await result.json();

    console.log(result);
    setTask("");
    getData();
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let allData = await fetch("http://localhost:5000/list/");
    allData = await allData.json();
    if (allData) {
      setTaskList(allData);
    } 
  };

  const handleDelete = async (_id) => {
    let deleteTask = await fetch(`http://localhost:5000/delete/${_id}`, {
      method: "delete",
    });
    deleteTask = await deleteTask.json();
    if (deleteTask) {
      getData();
    }
  };

  const handleDone = async (id) => {
    let doneTask = await fetch(`http://localhost:5000/find/${id}`);
    doneTask = await doneTask.json();
    let newDoneTask = { task: doneTask.task, id: doneTask._id };
    console.log(newDoneTask);
    setDone([...done, newDoneTask]);
  };

  return (
    <>
      <div className="container">
        <div>
          <h1 style={{ fontFamily: "Comic neue" }}>Welcome to TodoApp</h1>
        </div>
        <div className="input-div">
          <input
            type="text"
            placeholder="Add a new task"
            className="task-input"
            value={task}
            onChange={(e) => {
              setTask(e.target.value);
            }}
          />
          <button className="btn" onClick={handleTask}>
            <AddIcon className="add-icon" />
          </button>
        </div>
        <div>
          <h3 className="totalTask-head">Tasks to do - {taskList.length}</h3>
          {taskList.map((item) => {
            const { _id, task } = item;
            return (
              <div key={_id} className="taskList">
                <p className="tasks">{task}</p>
                <button className="done-btn" onClick={() => handleDone(_id)}>
                  <DoneIcon className="done-icon" />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(_id)}
                >
                  <DeleteIcon className="delete-icon" />
                </button>
              </div>
            );
          })}
        </div>
        <div>
          Here gonna be completed
          {done.map((item) => {
            const { task, _id } = item;
            return (
              <div key={_id} className="taskList">
                <p className="tasks">{task}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Task;
