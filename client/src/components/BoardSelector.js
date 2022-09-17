import React, {useState, useRef, useEffect, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../context/UserContext";
import {BoardContext} from "../context/BoardContext";
import styled, {keyframes} from "styled-components";
import {FaPencilAlt} from "react-icons/fa";
import { FiLoader } from "react-icons/fi";

const BoardSelector = ({boardId}) => {
  const initialBoardState = {};
  const {userState, actions} = useContext(UserContext);
  const {boardState, setBoardState} = useContext(BoardContext);
  const [boardName, setBoardName] = useState();
  const inputBoardRenameRef = useRef();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [boardNameIsUpdating, setBoardNameIsUpdating] = useState(false);

  useEffect(()=> {
    setBoardNameIsUpdating(true)

    if (boardState.boardName)
      setBoardNameIsUpdating(false);


  }, [boardState.boardName])


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
      
      await actions.updateBoard(newBoardState, userState);
    }
    else if (e.charCode === 13) {
      e.preventDefault();
    }
  }

  return (
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
              <SelectBoard onChange={(e)=>boardSelection(e)} name="boardNames" id="boardNames">
                { 
                  userState.boardsForUser.map(board => {
                    if (board._id === boardId)
                      return <option key={board._id} value={board.boardName} selected>{board.boardName}</option>
                    else
                      return <option key={board._id} value={board.boardName}>{board.boardName}</option>
                  })
                }
              </SelectBoard>
              <EditButton onClick={editBoardName} title="Rename the board"><FaPencilAlt/></EditButton>
            </>
          ): (
            <>
              <BoardRenameDiv>
                <BoardRenameInput ref={inputBoardRenameRef} onChange={(e)=>setBoardName(e.target.value)} onKeyPress={(e)=>onEnter(e)} placeholder={boardState.boardName}  autoFocus/>
                <CancelEditButton onClick={cancelEdit} title="Cancel rename">X</CancelEditButton>
              </BoardRenameDiv>
            </>
          )
        }
        </>
        )}
      </BoardNameSection>
  )
}

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

export default BoardSelector;