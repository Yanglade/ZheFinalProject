import React, {useReducer} from 'react';

const UserContext = React.createContext();

const initialState = {};

const reducer = (state, actions) => {
  switch(actions.type) {

    case 'test': {
      return {
        test: "successful"
      }
    }

    case 'set-user': {

    }
  }
}

const UserProvider = ({children}) => {
  
  const [state, dispatch] = userReducer(reducer, initialState);

  const testFunction = ()=> {
    const action = {
      type: 'test'
    }

    dispatch(action);
  }

  const createUserAndReceiveInfo = async (user) => {

    //POST fetch call
    const body = {
      email: user.email,
      name: user.name,
      picture: user.picture
    }

    //Existing User, send back the user object from the database
    //User does not exist, create an ew user and send back the user object from the database

    const action = {
      type: "set-user",
      email: user.email,
      name: user.name,
      picture: user.picture,
      universtity: "McGill"
    }

    dispatch(action);

  }

  return <UserContext.Provider>
    {children}
  </UserContext.Provider>
}

export default UserProvider;