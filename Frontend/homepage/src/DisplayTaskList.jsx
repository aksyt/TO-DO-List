import React from 'react'
function DisplayTaskList({backendData})
{
    return (<>
        {
            
             (typeof backendData==='undefined')?
               (<p>Loading...</p>)
             :
             (
               backendData.map((t,i)=>(<p key={i}>{t.task} <b>{t.index}</b></p>))
             )
        }
        </>
    )
}
export default DisplayTaskList;
