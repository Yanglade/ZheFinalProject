import React, {useState, useRef, useEffect, useContext} from "react";
import {UserContext} from "../context/UserContext";
import styled, {keyframes} from "styled-components";
import Column from "../components/Column";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import Header from "../components/Header";
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import { usePersistedState } from "../hooks/usePersistedState";
import "@reach/dialog/styles.css";
import {useParams, useNavigate} from "react-router-dom";
import { FiLoader } from "react-icons/fi";
import {FaPencilAlt} from "react-icons/fa";

const Board = () => {;
  const [persistedBoardId, setPersistedBoardId] = usePersistedState(-1, "boardId");
  const initialBoardState = {};
  const [boardState, setBoardState] = useState(initialBoardState);
  const [showDialog, setShowDialog] = React.useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);
  const dialogButtonRef = useRef();
  const {boardId} = useParams();
  const [loading, setLoading] = useState();
  const {userState, actions} = useContext(UserContext);
  const selectBoardRef = useRef();
  const inputBoardRenameRef = useRef();
  const boardRenameDivRef = useRef();
  const editButtonRef = useRef();
  const [isEditing, setIsEditing] = useState(false);
  const [boardName, setBoardName] = useState();
  const [boardNameIsUpdating, setBoardNameIsUpdating] = useState(false);
  const navigate = useNavigate();

  console.log(`params.... = `, boardId);


  useEffect(async()=> {
    console.log("Board_useEffect_1_boardId");
    setLoading(true);
    const res = await fetch(`/api/get-board/${boardId}`);
    const json = await res.json();
    const {board} = json;
    console.log(`board...userEffect_1 = `, board);

    setBoardState(board);
    setPersistedBoardId(board._id);
    if (boardState !== initialBoardState && boardState._id === boardId)
      setLoading(false);

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
      console.log("Board_useEffect_4_boardState");
      setLoading(true);
      setBoardNameIsUpdating(true);
      if (boardState._id)
        actions.updateBoard(boardState, userState);
      if (boardState !== initialBoardState && boardState._id === boardId)
        setLoading(false);
      if (boardState.boardName)
        setBoardNameIsUpdating(false);
    }, [boardState]);

    const editBoardName = () => {
      setIsEditing(true);
    }

    const boardSelection = (e) => {
      console.log(`Board selection: ${e.target.selectedIndex}`);
      console.log("boardName", userState.boardsForUser[e.target.selectedIndex].boardName);
      setBoardState(userState.boardsForUser[e.target.selectedIndex]);
      navigate(`/board/${userState.boardsForUser[e.target.selectedIndex]._id}`);
    }

    const cancelEdit = () => {
        
        inputBoardRenameRef.current.placeholder = boardState.boardName;
        inputBoardRenameRef.current.value = "";
        setIsEditing(false);
        setBoardName(boardState.boardName);
    }

    const onEnter = async (e) => {
      // e.preventDefault();
      e.stopPropagation();

      if (e.charCode === 13 && e.target.value !== "") {
        setIsEditing(false);

        const newBoardState = {...boardState, boardName: boardName};
        setBoardState(newBoardState);
        //await actions.updateBoard(newBoardState, userState);
      }
      else if (e.charCode === 13) {
        e.preventDefault();
      }
    }
      

  const onDragStart = start => {
    const homeIndex = boardState.columnOrder.indexOf(start.source.droppableId);
    console.log("homeIndex", homeIndex);
    setBoardState({
      ...boardState,
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
  };

  const addColumn = () => {
    console.log("in add column");
    const newColumnId = `column-${Object.keys(boardState.columnOrder).length+1}`;
    const newColumn = {id: newColumnId, title: newColumnId, taskIds: []};

    setBoardState({...boardState, columns: {...boardState.columns, [newColumn.id]: newColumn}, columnOrder: [...boardState.columnOrder, newColumn.id]});
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
      <BoardNameSection>
        {boardNameIsUpdating ? (
          <>
            <LoaderDiv>
              <FiLoader />
            </LoaderDiv>
        </>
        ):(
        <>
        <BoardNamesLabel htlmfor="boardNames">Boards:</BoardNamesLabel>
        {
          (!isEditing) ? (
            <>
              <SelectBoard ref={selectBoardRef} onChange={(e)=>boardSelection(e)} name="boardNames" id="boardNames">
                { 
                  userState.boardsForUser.map(board => {
                    if (board._id === boardId)
                      return <option key={board._id} value={board.boardName} selected>{board.boardName}</option>
                    else
                      return <option key={board._id} value={board.boardName}>{board.boardName}</option>
                  })
                }
              </SelectBoard>
              <EditButton ref={editButtonRef} onClick={editBoardName} title="Rename the board"><FaPencilAlt/></EditButton>
            </>
          ): (
            <>
              <BoardRenameDiv ref={boardRenameDivRef} >
                <BoardRenameInput ref={inputBoardRenameRef} onChange={(e)=>setBoardName(e.target.value)} onKeyPress={(e)=>onEnter(e)} placeholder={boardState.boardName}  autoFocus/>
                <CancelEditButton onClick={cancelEdit} title="Cancel rename">X</CancelEditButton>
              </BoardRenameDiv>
            </>
          )
        }
        </>
        )}
      </BoardNameSection>
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