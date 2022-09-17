import React, {useState, useRef, useEffect, useContext} from "react";
import {UserContext} from "../context/UserContext";
import {BoardContext} from "../context/BoardContext";
import styled, {keyframes} from "styled-components";
import Column from "../components/Column";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import Header from "../components/Header";
import BoardSelector from "../components/BoardSelector";
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import { usePersistedState } from "../hooks/usePersistedState";
import "@reach/dialog/styles.css";
import {useParams} from "react-router-dom";
import { FiLoader } from "react-icons/fi";
import BoardImage  from "../images/BoardBackground.jpg";

const Board = () => {;
  // const [persistedBoardId, setPersistedBoardId] = usePersistedState(-1, "boardId");
  const initialBoardState = {};
  // const [boardState, setBoardState] = useState(initialBoardState);
  const {boardState, setBoardState} = useContext(BoardContext);
  const {userState, actions} = useContext(UserContext);
  const [showDialog, setShowDialog] = React.useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);
  const dialogButtonRef = useRef();
  const {boardId} = useParams();
  const [loading, setLoading] = useState(true);

  console.log(`params.... = `, boardId);


  useEffect(()=> {
    console.log(`Board_useEffect_1_${boardId}`);
    // setLoading(true);
    //async
    // const res = await fetch(`/api/get-board/${boardId}`);
    // const json = await res.json();
    // const {board} = json;
    // setBoardState(board);
    // setPersistedBoardId(board._id);

    if (boardId) {
      console.log(`boradId before fetch = `, boardId);
      fetch(`/api/get-board/${boardId}`)
      .then((res) => res.json())
      .then((data)=> {
          console.log(`board...userEffect_1 = `, data.board);
          setBoardState(data.board);
      });
    }



    // if (boardState !== initialBoardState && boardState._id === boardId)
    //   setLoading(false);

    }, [boardState._id, boardId]);

    // useEffect(async()=>{
    //   console.log("Board_useEffect_2_boardName");
    //   console.log(`boardId = `, boardId);
    //   console.log(`boardState._id = `, boardState._id);
    //   console.log('boardState.boardName', boardState.boardName);
    //   await actions.updateBoard(boardState, userState);
    //   setBoardNameIsUpdating(true);
    //   if (boardState.boardName)
    //     setBoardNameIsUpdating(false);
    // }, [boardState.boardName])

    // useEffect(async()=> {
    //   console.log("Board_useEffect_3_boardState");
    //   setLoading(true);
    //   await actions.updateBoard(boardState, userState);
    //   setLoading(false);
    //   console.log(`boardId = `, boardId);
    //   console.log(`boardState._id = `, boardState._id);
    //   console.log('boardState.boardName', boardState.boardName);

    // }, [boardState.tasks, boardState.columns, boardState.columnOrder,  boardState.userIdsWithAccess]);

    useEffect (()=> {
      console.log(`Board_useEffect_4_boardState: ${boardState._id}`);
      console.log(`loading ${loading}`);
      if (boardState && boardState._id && boardState.id != undefined)
        actions.updateBoard(boardState, userState);
      
      console.log(`useEffect_4_boardState = `, boardState);
      if (boardState !== initialBoardState && boardState.boardName  && boardState.columns && boardState.tasks && boardState._id === boardId && boardState.columnOrder) {
        setLoading(false);
        console.log("loading false");
      }
    }, [boardState]);
      

  const onDragStart = async start => {
    const homeIndex = boardState.columnOrder.indexOf(start.source.droppableId);
    console.log("homeIndex", homeIndex);

    const newBoardState = {...boardState, homeIndex}; 
    setBoardState(newBoardState);
    await actions.updateBoard(newBoardState, userState);
  }

  // const onDragUpdate = update => {
  //   const { destination } = update;
  //   const opacity = destination 
  //     ? destination.index / Object.keys(state.tasks).length 
  //     : 0;
  //   document.body.style.backgroundColor = `rgba(153, 141, 217, ${opacity})`;
  // };

  const onDragEnd = async result => {

    setBoardState({
      ...boardState,
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
      const newColumnOrder = Array.from(boardState.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newBoardState = {
        ...boardState,
        columnOrder: newColumnOrder, 
      }

      setBoardState(newBoardState);
      await actions.updateBoard(newBoardState, userState);
      return;
    }

    // const column = boardState.columns[source.droppableId];
    const start = boardState.columns[source.droppableId];
    const finish = boardState.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newBoardState = {
        ...boardState,
        columns: {
          ...boardState.columns,
          [newColumn.id]: newColumn,
        },
      };

      setBoardState(newBoardState);
      await actions.updateBoard(newBoardState, userState);
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

    const newBoardState = {
      ...boardState,
      columns: {
        ...boardState.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    setBoardState(newBoardState);
    await actions.updateBoard(newBoardState, userState);
  };

  const addColumn = async () => {
    console.log("in add column");
    const newColumnId = `column-${Object.keys(boardState.columnOrder).length+1}`;
    const newColumn = {id: newColumnId, title: newColumnId, taskIds: []};

    const newBoardState = {...boardState, columns: {...boardState.columns, [newColumn.id]: newColumn}, columnOrder: [...boardState.columnOrder, newColumn.id]};

    setBoardState(newBoardState);
    await actions.updateBoard(newBoardState, userState);
    open();
  }

  return (
    (loading || boardState === initialBoardState) ? (
    <SpinnerWrapper>
      <LoaderDiv>
        <FiLoader />
      </LoaderDiv>
    </SpinnerWrapper>
    ): (
    <>
      <Header/>
      <BoardSelector boardId={boardId}/>
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
                  boardState.columnOrder.map((columnId, index) => {
                    const column = boardState.columns[columnId];
                    const tasks = column.taskIds.map(
                      taskId => boardState.tasks[taskId]
                    );
                      // console.log(`tasks man = `, tasks);
                      // console.log(`board state man = `, boardState);
                      const isDropDisabled = false;  //index < boardState.homeIndex; //disable going backwards
                      return <Column key={column.id} column={column} tasks={tasks} isDropDisabled={isDropDisabled} index={index} boardState={boardState} setBoardState={setBoardState}/>
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
  )
};

const BoardArea = styled.div`
  display: flex;
  /* background-image: url(${BoardImage});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover; */
`;

const Container = styled.div`
  display:flex;
`;

const AddColumnButton = styled.button`
  height: 40px;
  width: 100px;
  margin: 10px;
`;

const SpinnerWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;


const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoaderDiv = styled.div`
  font-size: 50px;
  color: grey;
  display: flex;
  justify-content: center;
  align-items: center;
  /* width: 100%;
  height: 100%; */
  animation: ${rotate} infinite 4s linear;
`;

const BoardNameSection = styled.div`
  width: 100vw;
  height: 50px;
  font-size: 20px;
  display: flex;
  align-items: center;
  background-color: cadetblue;
`;

const BoardNamesLabel = styled.label`
  margin: 0px 15px;
`;

const SelectBoard = styled.select`
  width: 200px;
  height: 30px;
`;

const EditButton = styled.div`
  /* position:absolute; 
  top:-6px;
  left:95%; */
  color:black;
  width:15px;
  border:none; 
  background-color:inherit;
  margin-left: 20px;
  /* display:none; */
  &:hover{
    cursor: pointer;
  }
`;

const BoardRenameDiv = styled.div`
`;

const BoardRenameInput = styled.input`
  width: 200px;
  height: 24px;
  /* display: none; */
  padding-left: 5px;
`;

const CancelEditButton = styled.button`
  height: 20px;
  color: red;
  margin:0px 5px;
  font-weight: bold;
  vertical-align: bottom;
`;

export default Board;