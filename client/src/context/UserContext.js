import React, {useReducer, useState} from 'react';
import { usePersistedState } from '../hooks/usePersistedState';

export const UserContext = React.createContext();

const initialState = {boards:[]};

const reducer = (userState, action) => {
  switch(action.type) {

    case 'test': {
      return {
        test: "successful"
      }
    }

    case 'set-user': {
      return {
        email: action.email,
        picture: action.picture,
        firstName: action.firstName,
        lastName: action.lastName,
        boards: action.boards,
        initials: action.initials,
        _id: action._id,
        boardsForUser: action.boardsForUser
      }
    }

    case 'update-board': {
      return {
        email: action.email,
        picture: action.picture,
        firstName: action.firstName,
        lastName: action.lastName,
        boards: action.boards,
        initials: action.initials,
        _id: action._id,
        boardsForUser: action.boardsForUser
      }
    }

    case 'add-a-board-for-user': {
      return {
        email: action.email,
        picture: action.picture,
        firstName: action.firstName,
        lastName: action.lastName,
        boards: action.boards,
        initials: action.initials,
        _id: action._id,
        boardsForUser: action.boardsForUser
      }
    }

    default: 
      throw new Error("Unrecognized type")
  }
}

const UserProvider = ({children}) => {
  
  const [userState, dispatch] = useReducer(reducer, initialState);

  const testFunction = ()=> {
    const action = {
      type: 'test'
    }

    dispatch(action);
  };

  const createUserAndReceiveInfo = async (user) => {
    let userId;
    let preAction;

    const postOptions = {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        email: user.email, 
        given_name: user.given_name,
        family_name: user.family_name,
        picture: user.picture
      })
    }

    try {
      const res = await fetch("/api/add-user", postOptions)
      const json = await res.json();
      
        const {status} = json;
        if (status === 200) {
          const {data} = json;

          //const action
           preAction= {
            type: "set-user",
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            picture: data.picture,
            boards: data.boards,
            initials: data.initials,
            _id: data._id
          }

          userId = data._id;

        }
      }
    catch(err) {
      console.error(err.message);
    }


    //getBoards available for the user
    try {
      const res = await fetch(`/api/get-boards-for-user/${userId}`);
      const json = await res.json();
      const {status} = json;
      if (status === 200) {
        const {boards} = json;

        const action = {
          ...preAction,
          boardsForUser: boards
        }

        dispatch(action);
      }

    }
    catch(err) {
      console.error("Error while fetching boards for the user", err.message);
    }
  };

  const updateBoard = async (board, aUserState) => {
    
    let userId;
    let preAction;

    const postOptions = {
      method: "PUT",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        ...board
      })
    }

    try {

      const res = await fetch("/api/update-board", postOptions)
      const json = await res.json();
      
      const {status} = json;
      if (status === 200) {
        const {board} = json;

        const newBoardsForUser = aUserState.boardsForUser.map(aboard => {
          if (aboard._id === board._id) {
            return board;
          }
          else {
            return aboard;
          }
        })

        const action = {
          type: "update-board",
          ...aUserState,
          boardsForUser: newBoardsForUser
        }

        dispatch(action);

      }
    }
    catch(err) {
      console.error(err.message);
    }
  }

  const addABoardForUser = (board, aUserState) => {
    
    const newBoardsForUser = [...aUserState.boardsForUser, board];

    const action = {
      type: "add-a-board-for-user",
      ...aUserState,
      boardsForUser: newBoardsForUser
    }

    dispatch(action);
  }

  return (
  <UserContext.Provider value = {{userState, actions: {
    createUserAndReceiveInfo,
    testFunction,
    updateBoard,
    addABoardForUser
    }}}>
    {children}
  </UserContext.Provider>
  );
}

export default UserProvider;