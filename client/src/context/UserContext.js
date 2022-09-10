import React, {useReducer} from 'react';

export const UserContext = React.createContext();

const initialState = {};

const reducer = (state, action) => {
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
        initials: action.initials
      }
    }
  }
}

const UserProvider = ({children}) => {
  
  const [state, dispatch] = useReducer(reducer, initialState);

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

      fetch("/api/add-user", postOptions)
      .then((res) => res.json())
      .then((json) => {
        const {status} = json;
        console.log(`status = `, status);
        if (status === 200) {
          const {data} = json;
          console.log(`data = `, data);
          const action = {
            type: "set-user",
            email: data.email,
            firstName: data.firstName,
            LastName: data.lastName,
            picture: data.picture,
            boards: data.boards,
            initials: data.initials
          }
      
          dispatch(action);
          // state = data;
        }
      })
    }
    catch(err) {
      alert(err.message);
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
  <UserContext.Provider value = {{state, actions: {
    createUserAndReceiveInfo,
    testFunction
    }}}>
    {children}
  </UserContext.Provider>
  );
}

export default UserProvider;