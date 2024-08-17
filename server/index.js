const express = require("express");
const Task = require("./db/tasks");
const Done = require("./db/donetasks");
require("./db/config");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
app.get("/list", async (req, resp) => {
  const db = await Task.find();
  resp.send(db);
});

app.post("/create", async (req, resp) => {
  const db = new Task(req.body);
  const result = await db.save();
  resp.send(result);
});

app.delete("/delete/:_id", async (req, resp) => {
  console.log(req.params);

  const result = await Task.deleteOne(req.params);
  resp.send(result);
});

app.get("/find/:_id", async (req, resp) => {
  const result = await Task.findOne(req.params);
  resp.send(result);
});

app.post("/doneTask/", async (req, resp) => {
  const done = await new Done(req.body);
  const result = await done.save();
  console.log(result);

  resp.send(result);
});

app.get("/doneList/", async (req, resp) => {
  const doneList = await Done.find();
  resp.send(doneList);
});

app.delete('/deletedone/:_id', async(req,resp)=>{
  const deleteDone = await Done.deleteOne(req.params)
  resp.send(deleteDone)
})

app.listen(5000);
