import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
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
import WipImage from "../src/images/WIP.png";

const App = () => {

  const { loginWithRedirect, user: userFromAuth0, isAuthenticated, isLoading, error, logout } = useAuth0();

  const {userState, actions: {createUserAndReceiveInfo}} = useContext(UserContext);

  useEffect(()=> {
    if (userFromAuth0) {
      createUserAndReceiveInfo(userFromAuth0)
    }
  }, [userFromAuth0])

  return (
    isLoading ? (
    <SpinnerWrapper>
      <LoaderDiv>
        <FiLoader />
      </LoaderDiv>
    </SpinnerWrapper>
    ):
    !isAuthenticated ?
      <LoginWrapper>
        <LoginButton  onClick={()=>loginWithRedirect()}>Login</LoginButton>
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
  position: relative;
  background-image: url(${WipImage});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  object-fit: contain;
`;

const LoginButton = styled.button`
    width: 120px;
    height: 60px;
    background-color: white;
    color: black;
    font-size: 30px;
    border-radius: 5px;
    box-shadow: 10px 10px black; 
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
  animation: ${rotate} infinite 4s linear;
`;

export default App;
