const express = require("express");
const mongoose= require("mongoose");
const Task= require("./model/task_model.js");
const app= express();
app.use(express.json());

app.listen(3000,()=>{
    console.log('server is running on port 3000');
});
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
//mongoose connection between node and backend
mongoose.connect("mongodb+srv://aksyout:AKmAXixJ3K8DZvX3@backenddb.rum1tbd.mongodb.net/?retryWrites=true&w=majority&appName=BackendDB")
.then(()=>{ console.log("Connected to database");})
.catch(()=>{console.log("Connection failed");});

app.get('/api/tasks',async (req,res)=>{
    try{
        const taskList= await Task.find({}).sort({index:1});
        res.status(200).json(taskList);
    }
    catch(error)
    {
        res.status(500).json({message:error.message});
    }
});
app.post('/api/tasks', async (req,res)=>{
    try{
        const task= await Task.create(req.body);
        res.status(200).json(task);
    }catch(error)
    {
        res.status(500).json({message:error.message});
    }
});
app.delete('/api/tasks',async(req,res)=>{
    try{
    const task= await Task.deleteMany();
    res.status(200).json({ message: "All tasks deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting tasks", error: error.message });
    }
});
app.delete('/api/tasks/:id',async(req,res)=>{
    try{
        const deletedTask= await Task.findByIdAndDelete(req.params.id);
        await Task.updateMany({ index: { $gt: deletedTask.index } }, { $inc: { index: -1 } }); // Decrement index of tasks after the deleted tas
        res.status(200).json({ message: "Task deleted successfully" });
    }
    catch(error)
    {
        res.status(500).json({message:error.message});
    }
})

app.put('/api/task/:id',async (req,res)=>{
    
    const {id}=req.params;
    const task=await Task.findByIdAndUpdate(id,req.body);//update with whatever the user provides in the request body
   

    if(!task)
        {
            return res.status(404).json({message:"task not found"});
        }
        const updated_task=await Task.findById(id);
        res.status(200).json(updated_task);

});