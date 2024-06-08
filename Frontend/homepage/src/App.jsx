import React,{ useState,useEffect } from 'react'
import './App.css'
import axios from 'axios'
import DisplayTaskList from './DisplayTaskList.jsx'
import ToDoList from './ToDoList.jsx'
import Button from 'react-bootstrap/Button';
function App() {

  const [backendData,setBackendData]=useState([{}]);
  useEffect(()=>{
    axios.get('http://localhost:3000/api/tasks')
    .then(response=>{
      return response.data;
  })
  .then(data=>{setBackendData(data);
   // console.log(data);
  }
)
  .catch(error=>{console.log("error fetching data")});
},[]);

  return (
    <>
    <div className='app_container'> <ToDoList backendData={backendData} setBackendData={setBackendData}/></div>
    
    </>
  )
}

export default App
