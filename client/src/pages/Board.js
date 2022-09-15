import React, {useState, useRef, useEffect, useContext} from "react";
import {UserContext} from "../context/UserContext";
import styled, {keyframes} from "styled-components";
import Column from "../components/Column";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import Header from "../components/Header";
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import { usePersistedState } from "../hooks/usePersistedState";
import "@reach/dialog/styles.css";
import {useParams} from "react-router-dom";
import { FiLoader } from "react-icons/fi";
import {FaPencilAlt} from "react-icons/fa";

const Board = () => {;
  // const [state, setState] = useState(initialData);
  const [persistedBoardId, setPersistedBoardId] = usePersistedState(-1, "boardId");
  // const [boardState, setBoardState] = usePersistedState(initialData, "board-1");
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

  // const {searchParams} = useSearchParams();

  console.log(`params.... = `, boardId);
  // console.log(`searchParams = `, searchParams);

  // useEffect(() => {
  //     console.log(`state = `, state);
  // }, [state]);
  

  // const onDragStart = () => {
  //   document.body.style.color = "orange";
  //   document.body.style.transition = "background-color 0.2s ease";
  // };

  // const updateBoardStates = async (board) => {
  //   setBoardState(board);
  //   setPersistedBoardId(board._id);
  //   if (boardState !== initialBoardState) {
  //     setLoading(false);

  //   }
  // }

  useEffect(async()=> {
    console.log("UseEffect8s8s8s88s8s8s8s8s8s88s8");
    setLoading(true);
    const res = await fetch(`/api/get-board/${boardId}`);
    const json = await res.json();
    const {board} = json;
    // console.log("data==================", board);
    // console.log("boardState==================", boardState);
    setBoardState(board);
    setPersistedBoardId(board._id);
    if (boardState !== initialBoardState)
      setLoading(false);

    }, [boardState._id, userState]);

    const editBoardName = () => {
      inputBoardRenameRef.current.placeholder = selectBoardRef.current.value;
      inputBoardRenameRef.current.value = "";
      selectBoardRef.current.style.display = "none";
      boardRenameDivRef.current.style.display = "inline";
      inputBoardRenameRef.current.focus();
      editButtonRef.current.style.display = "none";

    }

    const boardSelection = () => {
      console.log("boardSelection!!!!!");
      inputBoardRenameRef.current.placeholder = selectBoardRef.current.value;
      inputBoardRenameRef.current.value = "";
    }

    const cancelEdit = () => {
        inputBoardRenameRef.current.placeholder = selectBoardRef.current.value;
        inputBoardRenameRef.current.value = "";
        boardRenameDivRef.current.style.display = "none";
        selectBoardRef.current.style.display = "inline";
        editButtonRef.current.style.display = "inline";
    }

    const onEnter = (e) => {
      // e.preventDefault();
      e.stopPropagation();
      // alert(`e.target.value:${e.target.value === ""}...`);
      //console.log(`e.target.value = `, e.target.value);
      if (e.charCode === 13 && e.target.value !== "") {
        boardRenameDivRef.current.style.display = "none";
        selectBoardRef.current.style.display = "inline";
        editButtonRef.current.style.display = "inline";
        const newBoardState = {...boardState, boardName: e.target.value};
        setBoardState(newBoardState);
        actions.updateBoard(newBoardState, userState);
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

  console.log("boardState.+.+.+" +`loading${loading}`, boardState);
  return (
    (loading || boardState == initialBoardState) ? (
    <SpinnerWrapper>
      <LoaderDiv>
        <FiLoader />
      </LoaderDiv>
    </SpinnerWrapper>
    ): (
    <>
      <Header/>
      <BoardNameSection>
        <BoardNamesLabel htlmfor="boardNames">Boards:</BoardNamesLabel>
        <SelectBoard ref={selectBoardRef} onChange={boardSelection} name="boardNames" id="boardNames">
          { 
            userState.boardsForUser.map(board => <option key={board._id} value={board.boardName}>{board.boardName}</option>)
          }
        </SelectBoard>
        <BoardRenameDiv ref={boardRenameDivRef} >
          <BoardRenameInput ref={inputBoardRenameRef} onKeyPress={(e)=>onEnter(e)} placeholder={boardState.boardName}/>
          <CancelEditButton onClick={cancelEdit} title="Cancel rename">X</CancelEditButton>
        </BoardRenameDiv>
        <EditButton ref={editButtonRef} onClick={editBoardName} title="Rename the board"><FaPencilAlt/></EditButton>
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
  display: none;
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