import React, {useRef, useState} from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import anImage from "../data/YAz_Trello.png";
import {FaPencilAlt} from "react-icons/fa";
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import "@reach/dialog/styles.css";

const Task = ({ task, index, state, setState, column, focusAddTask }) => {
  console.log(task);
  const isDragDisabled = !(task.named !== undefined && task.named === true); //condition for a task to be draggable
  const taskNameRef = useRef();
  const [showDialog, setShowDialog] = React.useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const open = () => {
    setShowDialog(true);
    setModalContent(task.content);
    setModalDescription(!task.details?"":!task.details.description?"":task.details.description);
  };

  const close = () => {
    setState({...state, tasks: {...state.tasks, [task.id]: {...task, content: modalContent, details: {...task.details, description: modalDescription}}}});
    setShowDialog(false);
  };


  // const setTaskName = (e) => {
  //   e.preventDefault();
  //   alert("wow");
  //   console.log("state", state);
    
  // }

  const onEnter = (e) => {
    // e.preventDefault();
    e.stopPropagation();
    // alert(`e.target.value:${e.target.value === ""}...`);
    //console.log(`e.target.value = `, e.target.value);
    if (e.charCode === 13 && e.target.value !== "") {
      setState({...state, tasks:{...state.tasks, [task.id]: {...task, named: true, content: e.target.value}}});
      focusAddTask();
    }
    else if (e.charCode === 13) {
      e.preventDefault();
    }
  }

  const deleteNewTask = (e) => {
    e.preventDefault();
    console.log("tasks", state.tasks[`"${task.id}"`]);
    const newState = {...state}
     delete state.tasks[task.id];

     newState.columns[column.id].taskIds = newState.columns[column.id].taskIds.filter(aTask => aTask != task.id); //aTask != task.id
     console.log(`state = `, newState);
     setState(newState);
  }

  return (
    <>
    <Draggable
      draggableId={task.id}
      index={index}
      isDragDisabled={isDragDisabled} //property for a task to be draggable
    >
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          // innerRef={provided.innerRef} /*deprecated*/
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          isDragDisabled={isDragDisabled} //to allow style for a non draggable task
        >
          {/* <Handle {...provided.dragHandleProps}/> */}
          {task.id === task.content ? (
            <form style={{width:"100%"}} onSubmit={(e)=> e.preventDefault()}>
            {/* <> */}
              <input
                ref={taskNameRef}
                style={{ height: "40px", border:"none", width: "98%", paddingLeft:"5px" }}
                placeholder="Enter the task name..."
                name="taskName"
                onKeyPress={(e)=>onEnter(e)}
                autoComplete="off"
                autoFocus
              />
              <button style={{color:"grey", width:"15px", display:"flex", justifyContent:"center", marginTop:"5px"}} onClick={(e)=>deleteNewTask(e)}>X</button>
              {/* </> */}
            </form>
          ) : (
            <TaskDiv style={{display:"flex", justifyContent:"stretch", position:"relative", width:"100%", backgroundColor:"inherit"}}>
                {task.details && task.details.image_url && <img src={anImage} style={{width:"40px"}}/>}
                <div style={{ margin: "3px" }}> {task.content}</div>
                <EditButton onClick={open}><FaPencilAlt/></EditButton>
            </TaskDiv>
          )}
        </Container>
      )}
    </Draggable>
    <DialogOverlay
      style={{ background: "hsla(0, 100%, 100%, 0.5)", width: "80vw" }}
      isOpen={showDialog}
      onDismiss={close}
    >
      <DialogContent
        aria-label="Adding a task"
        style={{ boxShadow: "0px 10px 50px hsla(0, 0%, 0%, 0.33)",
                border: "solid 3px hsla(0, 0%, 0%, 0.5)", 
                borderRadius: "10px",
                width: "30vw",
                height: "50vh"
              }}
        content={task.content}
      >
        <h3>
          Task Details
        </h3>
        <form style={{height:"80%"}}>
          <div style={{display:"flex", flexDirection:"column", justifyContent:"space-between", height:"100%"}}>
            <h4> Task Name</h4>
            {/* <input style={{width:"200px", height:"50px"}} placeholder="Task Name" type="text" name="taskName" required autoComplete="off" value={modalValue} onChange={(e)=>{setModalValue(e.target.value)}}/> */}
            <input style={{width:"200px", height:"50px"}} placeholder="Task Name" type="text" name="taskName" required autoComplete="off" value={modalContent} onChange={(e)=>{setModalContent(e.target.value)}}/>
            <h4> Description</h4>
            <textarea style={{height:"300px"}} placeholder="description..." type="text" name="typeDescripton" value={modalDescription} onChange={(e)=>{setModalDescription(e.target.value)}}/>
            <h4> Activity</h4>
            <input style={{height:"100px"}} placeholder="write a comment..." type="text" name="typeComment"/>
          </div>
        </form>

        <button style={{margin:"10px 0px"}} onClick={close}>Close</button>
      </DialogContent>
    </DialogOverlay>
    </>
  );
};

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${(props) =>
    props.isDragDisabled
      ? "lightgrey"
      : props.isDragging
      ? "lightgreen"
      : "white"};

  display: flex;
  justify-content: left;
`;

const EditButton = styled.div`
  position:absolute; 
  top:-6px;
  left:95%;
  color:grey;
  width:15px;
  border:none; 
  background-color:inherit;
  display:none;
  &:hover{
    cursor: pointer;
  }
`;

const TaskDiv = styled.div`
  display:flex;
  justify-content:stretch;
  position:relative; 
  width:100%;
  background-color:inherit;
  &:hover {
    ${EditButton} {
      display:inline;
    }
  }
`;

// const Handle = styled.div`
//   width: 20px;
//   height: 20px;
//   background-color: orange;
//   border-radius: 4px;
//   margin-right: 8px;
// `;

export default Task;
