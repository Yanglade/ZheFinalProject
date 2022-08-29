import React, {useRef} from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import anImage from "../data/YAz_Trello.png";

const Task = ({ task, index, state, setState, column, focusAddTask }) => {
  console.log(task);
  const isDragDisabled = !(task.named !== undefined && task.named === true); //condition for a task to be draggable
  const taskNameRef = useRef();

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

  const deleteNewTask = async (e) => {
    // e.preventDefault();
    console.log("tasks", state.tasks[`"${task.id}"`]);
     delete state.tasks[task.id];
     const newState = state;
     state.columns[column.id].taskIds = await state.columns[column.id].taskIds.filter(aTask => false); //aTask != task.id
     console.log(`state = `, state);
     setState(state);
  }

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
          {task.id === task.content ? (
            <form onSubmit={()=> {return false}}>
            {/* <> */}
              <input
                ref={taskNameRef}
                style={{ height: "40px", border:"none", outline:"none" }}
                placeholder="Enter the task name..."
                name="taskName"
                onKeyPress={(e)=>onEnter(e)}
                autoComplete="off"
                autoFocus
              />
              <button style={{color:"grey", border:"none"}} onClick={(e)=>deleteNewTask(e)}>X</button>{task.id}
              {/* </> */}
            </form>
          ) : (
            <>
              {task.details && task.details.image_url && <img src={anImage} />}
              <div style={{ margin: "3px" }}> {task.content}</div>
            </>
          )}
        </Container>
      )}
    </Draggable>
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

// const Handle = styled.div`
//   width: 20px;
//   height: 20px;
//   background-color: orange;
//   border-radius: 4px;
//   margin-right: 8px;
// `;

export default Task;
