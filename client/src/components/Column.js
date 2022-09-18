import React, {memo, useRef, useContext} from "react";
import styled from "styled-components";
import {Droppable, Draggable} from "react-beautiful-dnd";
import Task from "./Task";
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import "@reach/dialog/styles.css";
import {UserContext} from "../context/UserContext";

const Column = ({column, tasks, isDropDisabled, index, boardState, setBoardState}) => {
const [showDialog, setShowDialog] = React.useState(false);
const {userState, actions} = useContext(UserContext);
const open = () => setShowDialog(true);
const close = () => setShowDialog(false);
const addTaskBtnRef = useRef();
const columnNameRef = useRef();

  const allTasksAreNamed = () => {
    return !tasks.some(aTask => (aTask == undefined || aTask.named == undefined || !aTask.named));
  }



  const addTask = async() => {
    const newTaskId = `task-${Object.keys(boardState.tasks).length+1}`;
    const newTask = {id: newTaskId, content: newTaskId, details:{image_url: "../../client/public/favicon.ico"}};
    addTaskBtnRef.current.disabled = true;

    const newBoardState = {...boardState, tasks: {...boardState.tasks, [newTaskId]: newTask }, columns: {...boardState.columns, [column.id]: {...column, taskIds: [...column.taskIds, newTaskId]}}};

    setBoardState(newBoardState);
    await actions.updateBoard(newBoardState, userState);
  }

  const focusAddTask = () => {
    addTaskBtnRef.current.disabled = false;
    addTaskBtnRef.current.focus();
  }

  const onEnter = async (e) => {
    e.stopPropagation();
    if (e.charCode === 13 && e.target.value !== "") {
      const newBoardState = {...boardState, columns:{...boardState.columns, [column.id]: {...column, named: true, title: e.target.value}}};
      setBoardState(newBoardState);
      await actions.updateBoard(newBoardState, userState);
    }
    else if (e.charCode === 13) {
      e.preventDefault();
    }
  }

  const deleteNewColumn = async(e) => {
    e.preventDefault();
    const newBoardState = {...boardState};
     delete boardState.columns[column.id];

     newBoardState.columnOrder = newBoardState.columnOrder.filter(aColumn => aColumn != column.id); //aTask != task.id
     setBoardState(newBoardState);
     await actions.updateBoard(newBoardState, userState);
  }

   return (
    <>
    <Draggable draggableId={column.id} index={index}>
      {provided => (
        <Container
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          {(column.named == undefined || !column.named ) ? (
            <form style={{display:"flex", flexDirection:"column", margin:"8px"}} onSubmit={(e)=> e.preventDefault()}>
            {/* <> */}
              <input
                ref={columnNameRef}
                style={{ height: "40px", border:"none", paddingLeft:"5px"}}
                placeholder="Enter column name..."
                name="taskName"
                onKeyPress={(e)=>onEnter(e)}
                autoComplete="off"
                autoFocus
              />
              <button style={{color:"grey", width:"15px", display:"flex", justifyContent:"center", marginTop:"5px"}} title="delete column" onClick={(e)=>deleteNewColumn(e)}>X</button>
              {/* </> */}
            </form>
          ) : (
         <>
          <Title {...provided.dragHandleProps}> {column.title}</Title>
          <Droppable 
            droppableId={column.id} 
            type="task"
            isDropDisabled={isDropDisabled}
            
          >
            {(provided, snapshot) => (
              <TaskList
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver = {snapshot.isDraggingOver}
              > 
                   {tasks.map((task, index) => task && <Task key={task.id} task={task} index={index} setBoardState={setBoardState} boardState={boardState} column={column} focusAddTask={focusAddTask}/>)} 
                  {/* <MemoInnerList tasks={tasks}/> */}
                  {/* <div>{tasks.length}</div> */}
                  {provided.placeholder}
              </TaskList>
            )}
          </Droppable>
          <div style={{alignSelf:"center", width:"100px"}}>
            <AddTaskButton onClick={addTask} ref={addTaskBtnRef} disabled={!allTasksAreNamed()}>Add a task</AddTaskButton>
          </div>
        </>
       )}
        </Container>

      )}
    </Draggable>
    </>
   )
}

export default Column;

const Container = styled.div`
  margin: 8px;
  border: 3px solid lightgrey;
  background-color: gold;
  border-radius: 2px;
  width: 220px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  padding: 8px;
  text-align: center;
`;

const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDraggingOver ? 'skyBlue' : 'inherit')};
  flex-grow: 1;
  min-height: 100px;
`;

const AddTaskButton = styled.button`
  width: 80%;
  margin: 5px;
  box-sizing: border-box;
  align-self: center;
  border: none;
  background-color: inherit;
  color: grey;
  &:hover {
    background-color: lightgrey;
  }
`;
