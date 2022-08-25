import React, {memo} from "react";
import styled from "styled-components";
import {Droppable, Draggable} from "react-beautiful-dnd";
import Task from "./Task";

const Column = ({column, tasks, isDropDisabled, index}) => {

  const InnerList = ({tasks}) => {
    return (
      tasks.map((task, index) => <Task key={task.id} task={task} index={index} />)
    )
  }

  const MemoInnerList = memo(InnerList);

  // const addTask = () => {
  //   tasks.push()
  // }

   return (
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
                  {/* {tasks.map((task, index) => <Task key={task.id} task={task} index={index} />)} //YA */}
                  <MemoInnerList tasks={tasks}/>
                  {provided.placeholder}
              </TaskList>
            )}
          </Droppable>
          <AddTaskButton /*onClick={addTask}*/>Add a task</AddTaskButton>
        </Container>
      )}
    </Draggable>
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
`;
