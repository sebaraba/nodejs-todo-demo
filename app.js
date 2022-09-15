//dependencies required for the app
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

const todoRepository = require('./model/TodoRepository')

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//render css files
app.use(express.static("public"));

//post route for adding new task 
app.post("/addtask", async function(req, res) {
    var newTask = req.body.newtask;
    //add the new task from the post route
    await todoRepository.create(newTask);

    res.redirect("/");
});

app.post("/removetask", async function(req, res) {
    var completeTaskId = req.body.check;
    //check for the "typeof" the different completed task, then add into the complete task
    if (typeof completeTaskId === "string") {
        await todoRepository.edit(completeTaskId, {completed: true})
    } else if (typeof completeTaskId === "object") {
        for (var i = 0; i < completeTaskId.length; i++) {
            await todoRepository.edit(completeTaskId[i], {completed: true})
        }
    }
    
    res.redirect("/");
});

//render the ejs and display added task, completed task
app.get("/", async function(req, res) {
    const openTasks = await todoRepository.getAll(false);
    const completeTasks = await todoRepository.getAll(true);

    res.render("index", { task: openTasks, complete: completeTasks });
});

//set app to listen on port 3000
app.listen(process.env.PORT || 3000, function() {
    console.log("server is running on port ", process.env.PORT || 3000);
});