import React, {useRef, useState, useContext} from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import anImage from "../data/YAz_Trello.png";
import {FaAcquisitionsIncorporated, FaPencilAlt} from "react-icons/fa";
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import "@reach/dialog/styles.css";
import {UserContext} from "../context/UserContext";


const Task = ({ task, index, boardState, setBoardState, column, focusAddTask }) => {
  const isDragDisabled = !(task.named !== undefined && task.named === true); //condition for a task to be draggable
  const taskNameRef = useRef();
  const [showDialog, setShowDialog] = React.useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const {userState, actions} = useContext(UserContext);
  const [modalComments, setModalComments] = useState([]);

  const open = () => {
    setShowDialog(true);
    setModalContent(task.content);
    setModalDescription(!task.details?"":!task.details.description?"":task.details.description);
    setModalComments(!task.details?"":!task.details.comments?"":task.details.comments);
  };

  const close = async() => {
    const newBoardState = {...boardState, tasks: {...boardState.tasks, [task.id]: {...task, content: modalContent, details: {...task.details, description: modalDescription, comments: modalComments}}}};
    setBoardState(newBoardState);
    actions.updateBoard(newBoardState, userState);
    
    setShowDialog(false);
  };

  const onEnter = async(e) => {
    e.stopPropagation();

    if (e.charCode === 13 && e.target.value !== "") {
      const newBoardState = {...boardState, tasks:{...boardState.tasks, [task.id]: {...task, named: true, content: e.target.value}}}
      setBoardState(newBoardState);
      await actions.updateBoard(newBoardState, userState);
      focusAddTask();
    }
    else if (e.charCode === 13) {
      e.preventDefault();
    }
  }

  const deleteNewTask = async(e) => {
    e.preventDefault();
    const newBoardState = {...boardState}
     delete boardState.tasks[task.id];

     newBoardState.columns[column.id].taskIds = newBoardState.columns[column.id].taskIds.filter(aTask => aTask != task.id);
     setBoardState(newBoardState);
     await actions.updateBoard(newBoardState, userState);
  }

  const formatComment = (str) => {
    const newComment = `<div style={{width="95%"}}><div style="{{borderRadius="50%",backgroundColor="green", color:"white"}}"> ${userState.initials}</div>${str}</div>`;
    return newComment;
  }

  const onCommentsEnter = async(e) => {
    e.stopPropagation();
   
    if (e.charCode === 13 && e.target.value !== "") {
      const newComments = [...modalComments,formatComment(e.target.value) ];
      setModalComments(newComments);
    }
    else if (e.charCode === 13) {
      e.preventDefault();
    } 
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
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          isDragDisabled={isDragDisabled} //to allow style for a non draggable task
        >
          {/* <Handle {...provided.dragHandleProps}/> */}
          {task.id === task.content ? (
            <form style={{width:"100%"}} onSubmit={(e)=> e.preventDefault()}>
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
      style={{ background: "hsla(0, 100%, 100%, 0.5)", width: "100vw" }}
      isOpen={showDialog}
      onDismiss={close}
    >
      <DialogContent
        aria-label="Adding a task"
        style={{ boxShadow: "0px 10px 50px hsla(0, 0%, 0%, 0.33)",
                border: "solid 3px hsla(0, 0%, 0%, 0.5)", 
                borderRadius: "10px",
                width: "30vw",
                height: "80vh"
              }}
        content={task.content}
      >
        <h3>
          Task Details
        </h3>
        <form style={{height:"80%"}}>
          <div style={{display:"flex", flexDirection:"column", justifyContent:"space-between", height:"100%"}}>
            <h4> Task Name</h4>
            <input style={{width:"300px", height:"30px"}} placeholder="Task Name" type="text" name="taskName" required autoComplete="off" value={modalContent} onChange={(e)=>{setModalContent(e.target.value)}}/>
            <h4> Description</h4>
            <textarea style={{height:"150px"}} placeholder="description..." type="text" name="typeDescripton" value={modalDescription} onChange={(e)=>{setModalDescription(e.target.value)}}/>
            <h4>Comments</h4>
            <div style={{height: "300px", border: "1px solid grey", marginBottom:"3px"}} value={modalComments}>{modalComments}</div>
            <input style={{height: "75px"}} onKeyPress={(e)=>onCommentsEnter(e)} placeholder="write a comment..." type="text" name="typeComment"/>
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


export default Task;
