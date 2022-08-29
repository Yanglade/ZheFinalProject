import React, {memo, useRef} from "react";
import styled from "styled-components";
import {Droppable, Draggable} from "react-beautiful-dnd";
import Task from "./Task";
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import "@reach/dialog/styles.css";

const Column = ({column, tasks, isDropDisabled, index, state, setState}) => {
const [showDialog, setShowDialog] = React.useState(false);
const open = () => setShowDialog(true);
const close = () => setShowDialog(false);
const addTaskBtnRef = useRef();

  // const InnerList = ({tasks}) => {
  //   return (
  //     tasks.map((task, index) => <Task key={task.id} task={task} index={index} />)
  //   )
  // }

  // const MemoInnerList = memo(InnerList);

  const allTasksAreNamed = () => {
    return !tasks.some(aTask => (aTask.named === undefined || !aTask.named));
  }



  const addTask = () => {
    console.log("in add task");
    const newTaskId = `task-${Object.keys(state.tasks).length+1}`;
    const newTask = {id: newTaskId, content: newTaskId, details:{image_url: "../../client/public/favicon.ico"}};
    addTaskBtnRef.current.disabled = true;
    // const newContent = `<div><img src='../../puclic/favicon.ico'/><label>${newTaskId}</label> </div>`;
    // const newTask = {id: newTaskId, content: newContent};


    //open();

    setState({...state, tasks: {...state.tasks, [newTaskId]: newTask }, columns: {...state.columns, [column.id]: {...column, taskIds: [...column.taskIds, newTaskId]}}});
  }

  const focusAddTask = () => {
    addTaskBtnRef.current.disabled = false;
    addTaskBtnRef.current.focus();
  }

   return (
    <>
    <Draggable draggableId={column.id} index={index}>
      {provided => (
        <Container
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <Title {...provided.dragHandleProps}> {column.title}</Title>
          <Droppable 
            droppableId={column.id} 
            // type={column.id === 'column-3' ? 'done': 'active'}
            type="task"
            isDropDisabled={isDropDisabled}
            
          >
            {(provided, snapshot) => (
              <TaskList
                // innerRef={provided.innerRef}
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver = {snapshot.isDraggingOver}
              > 
                  {tasks.map((task, index) => <Task key={task.id} task={task} index={index} setState={setState} state={state} column={column} focusAddTask={focusAddTask}/>)} 
                  {/* <MemoInnerList tasks={tasks}/> */}
                  {provided.placeholder}
              </TaskList>
            )}
          </Droppable>
          <div style={{alignSelf:"center", width:"100px"}}>
            <AddTaskButton onClick={addTask} ref={addTaskBtnRef} disabled={!allTasksAreNamed()}>Add a task</AddTaskButton>
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
                        width: "20vw"
                      }}
              >
                {/* <p>
                  The overlay styles are a white fade instead of the default black
                  fade.
                </p> */}
                <form>
                  <input placeholder="Task Name" type="text" name="taskName" required/>
                </form>

                <button style={{margin:"10px 0px"}} onClick={close}>Close</button>
              </DialogContent>
            </DialogOverlay>
          </div>
        </Container>

      )}
    </Draggable>
    </>
   )
}

export default Column;

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  background-color: white;
  border-radius: 2px;
  width: 220px;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
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
