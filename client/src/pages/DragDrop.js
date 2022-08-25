import React, {useState} from "react";
import styled from "styled-components";
import initialData from "../data/initial-data";
import Column from "../components/Column";
import {DragDropContext} from "react-beautiful-dnd";

const DragDrop = () => {
  // const state = initialData;
  const [state, setState] = useState(initialData);

  // const onDragStart = () => {
  //   document.body.style.color = "orange";
  //   document.body.style.transition = "background-color 0.2s ease";
  // };

  const onDragStart = start => {
    const homeIndex = state.columnOrder.indexOf(start.source.droppableId);
    setState({
      ...state,
      homeIndex,
    });
  }

  // const onDragUpdate = update => {
  //   const { destination } = update;
  //   const opacity = destination 
  //     ? destination.index / Object.keys(state.tasks).length 
  //     : 0;
  //   document.body.style.backgroundColor = `rgba(153, 141, 217, ${opacity})`;
  // };

  const onDragEnd = result => {
    setState({
      ...state,
      homeIndex: null,
    });

    document.body.style.color = "inherit";
    document.body.style.backgroundColor = "inherit";
    
    const { destination, source, draggableId} = result;

    //check if there is no destination
    if (!destination) {
      return;
    }

    //check if item was drop to the same location
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // const column = state.columns[source.droppableId];
    const start = state.columns[source.droppableId];
    const finish = state.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      };

      setState(newState);
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    setState(newState);
  };

  console.log("in DragDrop", state.columnOrder);
  return (
    <>
      <DragDropContext
        // onDragStart={onDragStart}
        // onDragUpdate={onDragUpdate}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <Container>
        {
          state.columnOrder.map((columnId, index) => {
            const column = state.columns[columnId];
            const tasks = column.taskIds.map(
              taskId => state.tasks[taskId]
            );
              const isDropDisabled = false;  //index < state.homeIndex; //disable going backwards
              return <Column key={column.id} column={column} tasks={tasks} isDropDisabled={isDropDisabled}/>
            })
        }
        </Container>
      </DragDropContext>

    </>

  )
};

const Container = styled.div`
  display:flex;
`;

export default DragDrop;