import React, {useState, useRef, useEffect} from "react";
import styled from "styled-components";
import initialData from "../data/initial-data";
import Column from "../components/Column";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import Header from "../components/Header";
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import { usePersistedState } from "../hooks/usePersistedState";
import "@reach/dialog/styles.css";

const Board = () => {
  // const state = initialData;
  // const [state, setState] = useState(initialData);
  const [state, setState] = usePersistedState(initialData, "board");
  const [showDialog, setShowDialog] = React.useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);
  const dialogButtonRef = useRef();

  useEffect(() => {
      console.log(`state = `, state);
  }, [state]);
  

  // const onDragStart = () => {
  //   document.body.style.color = "orange";
  //   document.body.style.transition = "background-color 0.2s ease";
  // };

  const onDragStart = start => {
    const homeIndex = state.columnOrder.indexOf(start.source.droppableId);
    console.log("homeIndex", homeIndex);
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
    
    const { destination, source, draggableId, type} = result;

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

    if (type === "column") {
      const newColumnOrder = Array.from(state.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...state,
        columnOrder: newColumnOrder, 
      }

      setState(newState);
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

  const addColumn = () => {
    console.log("in add column");
    const newColumnId = `column-${Object.keys(state.columnOrder).length+1}`;
    const newColumn = {id: newColumnId, title: newColumnId, taskIds: []};

    setState({...state, columns: {...state.columns, [newColumn.id]: newColumn}, columnOrder: [...state.columnOrder, newColumn.id]});
    open();
  }

  console.log("in DragDrop", state.columnOrder);
  return (
    <>
      <Header/>
      <BoardArea>
      <DragDropContext
        // onDragStart={onDragStart}
        // onDragUpdate={onDragUpdate}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <Droppable 
          droppableId="all-columns" 
          direction="horizontal"
          type="column"
        >
          {provided => (
            <Container
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {
                state.columnOrder.map((columnId, index) => {
                  const column = state.columns[columnId];
                  const tasks = column.taskIds.map(
                    taskId => state.tasks[taskId]
                  );
                    const isDropDisabled = false;  //index < state.homeIndex; //disable going backwards
                    return <Column key={column.id} column={column} tasks={tasks} isDropDisabled={isDropDisabled} index={index} state={state} setState={setState}/>
                  })
              }
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>
      <div>
      <AddColumnButton onClick={addColumn}> Add Column</AddColumnButton>
        <Dialog aria-label="Adding a column" style={{ color: "black", width: "120px",border: "solid 3px hsla(0, 0%, 0%, 0.5)" }} isOpen={showDialog} onDismiss={close} initialFocusRef={dialogButtonRef}>
          <div style={{width: "95%", display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
            <input type="text" placeholder="Column Name" />
            <button style={{margin:"10px 0px"}} onClick={close}>Close</button>
          </div>
        </Dialog>
      </div>
      </BoardArea>
    </>

  )
};

const BoardArea = styled.div`
  display: flex;
`;

const Container = styled.div`
  display:flex;
`;

const AddColumnButton = styled.button`
  height: 40px;
  width: 100px;
  margin: 10px;
`

export default Board;