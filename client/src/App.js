import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
// import DragDrop from "../src/pages/DragDrop";
import Board from "./pages/Board";
import Treeview from "../src/pages/Treeview";
import Inspirational from "../src/pages/Inspirational";
import Calendar from "../src/pages/Calendar";
import Dashboard from "../src/pages/Dashboard";
import {useAuth0} from "@auth0/auth0-react";
import {useContext, useEffect} from "react";
import {UserContext} from "./context/UserContext";
import styled, {keyframes} from "styled-components";
import { FiLoader } from "react-icons/fi";

const App = () => {

  const { loginWithRedirect, user: userFromAuth0, isAuthenticated, isLoading, error, logout } = useAuth0();

  const {userState, actions: {createUserAndReceiveInfo}} = useContext(UserContext);

  
  // console.log(`user from Auth0 = `, userFromAuth0);
  console.log('user from mongodb in App', userState );
  // console.log(`isAuthenticated = `, isAuthenticated);
  // console.log(`error = `, error);

  useEffect(()=> {
    if (userFromAuth0) {
      console.log(`userFromAuth0 in App = `, userFromAuth0);
      createUserAndReceiveInfo(userFromAuth0)
    }
  }, [userFromAuth0])

  console.log(`isLoading = `, isLoading);
  return (
    isLoading ? (
    <SpinnerWrapper>
      <LoaderDiv>
        App-isLoading<FiLoader />
      </LoaderDiv>
    </SpinnerWrapper>
    ):
    !isAuthenticated ?
      <LoginWrapper>
        <LoginButton onClick={()=>loginWithRedirect()}>Login</LoginButton>
      </LoginWrapper>
      : (
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Dashboard logout={logout}/>} />
            <Route exact path="/board" element={<Board/>} />
            <Route exact path="/board/:boardId" element={<Board/>} />
            <Route exact path="/treeview" element={<Treeview/>} />
            <Route exact path="/inspirational" element={<Inspirational/>} />
            <Route exact path="/calendar" element={<Calendar/>} />
          </Routes>
        </BrowserRouter>
      )
  )
}

const SpinnerWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
`;

const LoginButton = styled.button`
    width: 50px;
    height: 30px;
    background-color: white;
    color: black;
    &:hover {
    cursor: pointer;
  }
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

export default App;
