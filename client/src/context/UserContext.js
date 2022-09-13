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
      console.log(`action = `, action)
      return {
        email: action.email,
        picture: action.picture,
        firstName: action.firstName,
        lastName: action.lastName,
       // picture: action.picture,
        boards: action.boards,
        initials: action.initials,
        _id: action._id
      }
    }

    default: 
      throw new Error("Unrecognized type")
  }
}

const UserProvider = ({children}) => {
  
  const [userState, dispatch] = useReducer(reducer, initialState);
  const [persistedUser, setPersistedUser] = usePersistedState(userState, "persisted-user");
  const [boardsForUser, setBoardsForUser] = useState([]);

  const testFunction = ()=> {
    const action = {
      type: 'test'
    }

    dispatch(action);
  };

  const createUserAndReceiveInfo = async (user) => {

    //POST fetch call
    // const body = {
    //   email: user.email,
    //   name: user.name,
    //   picture: user.picture
    // }

    let userId;

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
        // console.log(`status = `, status);
        if (status === 200) {
          const {data} = json;
          console.log(`UserContext_data = `, data);
          const action = {
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

          setPersistedUser({
            _id: data._id
          });
      
          dispatch(action);

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
        setBoardsForUser(boards)
      }

    }
    catch(err) {
      console.error("Error while fetching boards for the user", err.message);
    }

    //Existing User, send back the user object from the database
    //User does not exist, create an ew user and send back the user object from the database
/*
    const action = {
      type: "set-user",
      email: user.email,
      given_name: user.given_name,
      family_name: user.family_name,
      picture: user.picture
    }

    dispatch(action);
    */
  };

  return (
  <UserContext.Provider value = {{userState, persistedUser, setPersistedUser, boardsForUser, setBoardsForUser, actions: {
    createUserAndReceiveInfo,
    testFunction
    }}}>
    {children}
  </UserContext.Provider>
  );
}

export default UserProvider;