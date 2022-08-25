import React from "react";
import styled from "styled-components";
import {Draggable} from "react-beautiful-dnd";


const Task = ({task, index}) => {
  
  const isDragDisabled = task.id === 'task-1'; //condition for a task to be draggable

  return (
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
        <div> {task.content}</div>
      </Container>
      )}
    </Draggable>
  )
}

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${props => (
      props.isDragDisabled
        ? 'lightgrey'
        : props.isDragging 
          ? 'lightgreen' 
          : 'white')};

  display: flex;
  justify-content: left;
`;

// const Handle = styled.div`
//   width: 20px;
//   height: 20px;
//   background-color: orange;
//   border-radius: 4px;
//   margin-right: 8px; 
// `;

export default Task;