import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../context/UserContext";
import styled, {keyframes} from "styled-components";
import {NavLink} from "react-router-dom";
import initialData from "../data/new-empty-board";
import { FiLoader } from "react-icons/fi";

const BoardOverview = () => {

  const {userState, actions} = useContext(UserContext);
  const [loading, setLoading] = useState();

  const createNewBoard = async () => {

    const postOptions = {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        ...initialData,
        userIdsWithAccess: [userState._id]
      })
    }

    try {
      const res = await fetch("/api/add-board", postOptions);
      const json = await res.json();
      
        const {status} = json;
        if (status === 200) {
          const {data} = json;

          try {
            const res = await fetch(`/api/get-boards-for-user/${userState._id}`);
            const json = await res.json();
            const {status} = json;

            if (status === 200) {
              const {boards} = json;
              actions.addABoardForUser(boards, userState);
            }
          }
          catch (err){
            console.log(err.message);
          }
        }
    }
    catch(err) {
      console.error(err.message);
    }
  }

  useEffect(()=> {
    setLoading(true)
    if (userState.boardsForUser)
      setLoading(false);

  }, [userState.boardsForUser]);

  return (
    
     loading ? (
      <BoardOverviewWrapper>
        <SpinnerWrapper>
          <LoaderDiv>
            <FiLoader />
          </LoaderDiv>
        </SpinnerWrapper>
      </BoardOverviewWrapper>
      ): (
        <BoardOverviewWrapper>
        <TitleDiv style={{fontWeight: "bold", textAlign:"center"}}>Board Overview</TitleDiv>
        {
        userState.boards.length ? (
          <>
            <div> You have {`${userState.boards.length}`} board(s):</div>
            <BoardsList>
              {
                userState.boardsForUser.map(board => {
                  return <NavLink key={board._id} to={`/board/${board._id}`}>{board.boardName}</NavLink>
                })
              }
            </BoardsList>
            <CreateButtonDiv>
              <CreateBoardBtn onClick={()=>createNewBoard()}>Create a new board</CreateBoardBtn>
            </CreateButtonDiv>
          </>
          )
          :
          <NoBoardsDiv>
            <div> You don't have any boards</div>
            <CreateBoardBtn onClick={()=>createNewBoard()}>Create a new board</CreateBoardBtn>
          </NoBoardsDiv>
        } 
        </BoardOverviewWrapper>
      )
  )
}

const TitleDiv = styled.div`

`;

const NoBoardsDiv = styled.div`
  margin-top: 30px;
  height: 30%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const CreateBoardBtn = styled.button`
  width: 100px;
`;

const BoardsList = styled.div`
  display: flex;
  flex-direction: column;
`;

const BoardOverviewWrapper = styled.div`
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 10px;
`;

const CreateButtonDiv = styled.div`
  display: flex;
  justify-content: center;
`;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
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
  animation: ${rotate} infinite 4s linear;
`;



export default BoardOverview;