import React, { useEffect, useState } from "react";
import "./task.css";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

function Task() {
  const [task, setTask] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [done, setDone] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const handleTask = async (e) => {
    e.preventDefault();
    if (task === "") {
      setIsEmpty(true);
      return false;
    }

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
    setIsEmpty(false);
    getData();
  };

  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      handleTask(e);
    }
  };

  useEffect(() => {
    getData();
    getDoneList();
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

  const handleDone = async (id, task) => {
    handleDelete(id);
    let doneTask = await fetch("http://localhost:5000/doneTask/", {
      method: "POST",
      body: JSON.stringify({ task }),
      headers: {
        "Content-type": "application/json",
      },
    });
    doneTask = await doneTask.json();
    getDoneList();
  };

  const getDoneList = async () => {
    let doneList = await fetch("http://localhost:5000/doneList/");
    doneList = await doneList.json();
    if (doneList) {
      setDone(doneList);
    }
  };

  const handleDoneDelete = async (id) => {
    let doneDelete = await fetch(`http://localhost:5000/deletedone/${id}`, {
      method: "delete",
    });
    doneDelete = await doneDelete.json();
    if (doneDelete) {
      getDoneList();
    }
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
            onKeyDown={handleKeyDown}
          />
          <button className="btn" onClick={handleTask}>
            <AddIcon className="add-icon" />
          </button>
        </div>
        {isEmpty && <p>Huh, trying to be lazy ?</p>}
        <div>
          <h3 className="totalTask-head">Tasks to do - {taskList.length}</h3>
          {taskList.map((item) => {
            const { _id, task } = item;
            return (
              <div key={_id} className="taskList">
                <p className="tasks">{task}</p>
                <div className="task-done-list-btn">
                  <button
                    className="done-btn"
                    onClick={() => handleDone(_id, task)}
                  >
                    <DoneIcon className="done-icon" />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(_id)}
                  >
                    <DeleteIcon className="delete-icon" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div>
          <h3 className="totalTask-head">Done - {done.length}</h3>
          {done.map((doneTask) => {
            const { _id, task } = doneTask;
            return (
              <div key={_id} className="taskList">
                <p className="done-tasks">{task}</p>
                <button
                  className="cancel-btn"
                  onClick={() => handleDoneDelete(_id)}
                >
                  <CloseIcon className="cancel-icon" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Task;
