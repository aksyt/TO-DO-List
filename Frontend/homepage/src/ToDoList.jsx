import React, {useState ,useEffect} from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
function ToDoList({backendData, setBackendData})
{
    const work_data=backendData.map(item => item.task);
    const [workList, setWorkList] = useState(work_data);
    const [newIndex, setNewIndex]= useState(backendData.length-1);
   // console.log(workList);
    const [newWork, setNewWork] = useState("");
    useEffect(() => {
        setWorkList(backendData.map(item => item.task));
    }, [backendData]);

    useEffect(()=>{
        setNewIndex(backendData.length);
    },[backendData])

    function handleInputChange(event){
        setNewWork(event.target.value);
    }
    function addWork()
    {
       setNewIndex(newIndex+1);
        if(newWork.trim().length>0)
            {
                axios.post('http://localhost:3000/api/tasks', { task: newWork ,index:newIndex})
                .then(response=>{
                    setWorkList([...workList,newWork]);
                    setBackendData([...backendData, response.data]);
                        setNewWork(""); // Clear input after adding
                    // console.log(workList);
                }
                )
                .catch(error=>{
                    console.log("error adding the element");
                });
                
      
            }
    }        
    function deleteWork(index)
    {
        const deletedTask=backendData[index];
        const updatedWork=backendData.filter((_,i)=>i!==index);
    
        axios.delete(`http://localhost:3000/api/tasks/${deletedTask._id}`)
        .then(response=> 
        {
            setBackendData(updatedWork);
           
        
        })
        .catch(error=>{console.log("Could not delete");})
    }
    function moveUp(index) {
        if (index > 0) {
            const taskToMove = backendData[index];
            const taskToSwap = backendData[index - 1];
            const updatedWork = [...backendData];
            [updatedWork[index - 1], updatedWork[index]] = [taskToMove, taskToSwap];
    
            // Update indices in the backend
            axios.put(`http://localhost:3000/api/task/${taskToMove._id}`, { index: taskToMove.index - 1 })
                .then(response => {
                    console.log("Field updated successfully for taskToMove");
                    taskToMove.index -= 1; // Update index locally
                    return axios.put(`http://localhost:3000/api/task/${taskToSwap._id}`, { index: taskToSwap.index + 1 });
                })
                .then(response => {
                    console.log("Field updated successfully for taskToSwap");
                    taskToSwap.index += 1; // Update index locally
                    console.log("Updating state...");
                    setBackendData(updatedWork); // Update state
                })
                .catch(error => {
                    console.log("Unable to update field:", error);
                });
        }
    }
    
    function moveDown(index)
    {
        if(index<workList.length-1)
            {   
                const taskToMove = backendData[index];
            const taskToSwap = backendData[index + 1];
            const updatedWork = [...backendData];
            [updatedWork[index], updatedWork[index+1]] = [taskToSwap, taskToMove];
    
            // Update indices in the backend
            axios.put(`http://localhost:3000/api/task/${taskToMove._id}`, { index: taskToMove.index + 1 })
                .then(response => {
                    console.log("Field updated successfully for taskToMove");
                    taskToMove.index += 1; // Update index locally
                    return axios.put(`http://localhost:3000/api/task/${taskToSwap._id}`, { index: taskToSwap.index - 1 });
                })
                .then(response => {
                    console.log("Field updated successfully for taskToSwap");
                    taskToSwap.index -= 1; // Update index locally
                    console.log("Updating state...");
                    setBackendData(updatedWork); // Update state
                })
                .catch(error => {
                    console.log("Unable to update field:", error);
                });
            }
    }
    return(
        <div className="outer_container">
        <div className="input_container">
            <h1>To Do List</h1>
            <input type="text" placeholder="Add a task..." value={newWork} onChange={handleInputChange}/>
            <button className="add_btn" onClick={addWork}>ADD</button>
            
        </div>
        <ul>
            {backendData.map((work,index)=>
            <li key={index} className="list_element"><div className="work_index">➤</div><span >{ work.task } </span>
            <button className="delete_btn" onClick={()=>deleteWork(index)}>Delete</button>
            <button className="move_btn" onClick={()=>moveUp(index)}>▲</button>
            <button className="move_btn" onClick={()=>moveDown(index)}>▼</button>
            </li>)}
        </ul>
        </div>
        
        
    )
}
export default ToDoList;