import React, {useEffect, useState, useContext} from "react";
import styled, {keyframes} from "styled-components";
import Header from "../components/Header";
import BoardOverview from "../components/BoardsOverview";
import {UserContext} from "../context/UserContext";
import { FiLoader } from "react-icons/fi";


const Dashboard = ({logout}) => {

  const [loading, setLoading] = useState(true);
  const {userState} = useContext(UserContext);

  console.log(`state in Dashboard = `, userState);

  useEffect(()=> {
    if (userState !== undefined) 
      setLoading(false);
  }, [userState])

  return (
    loading ? (
      <LoaderDiv>
        <FiLoader />
      </LoaderDiv>
      ):( 
    <DashBoardWrapper> 
      <Header logout={logout}/>
      <DashBoardSections>
        <BoardDiv><BoardOverview/></BoardDiv>
        <WeatherDiv/>
        <InspirationalDiv/>
        <OtherDiv/>
      </DashBoardSections>
    </DashBoardWrapper>
    )
  )
};

const DashBoardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;

const DashBoardSections = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  height: 90%;
`

const BoardDiv = styled.div`
  width: 40%;
  height: 40%;
  border: 1px solid blue;
  margin: 10px;
  border-radius: 10px;
  box-shadow: 10px 10px lightgrey; 
`;

const WeatherDiv = styled.div`
  width: 40%;
  height: 40%;
  border: 1px solid blue;
  margin: 10px;
  border-radius: 10px;
  box-shadow: 10px 10px lightgrey; 
`;

const InspirationalDiv = styled.div`
  width: 40%;
  height: 40%;
  border: 1px solid blue;
  margin: 10px;
  margin: 10px;
  border-radius: 10px;
  box-shadow: 10px 10px lightgrey; 
`;

const OtherDiv = styled.div`
  width: 40%;
  height: 40%;
  border: 1px solid blue;
  margin: 10px;
  border-radius: 10px;
  box-shadow: 10px 10px lightgrey; 
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
  width: 100%;
  height: 100%;
  animation: ${rotate} infinite 4s linear;
`;



export default Dashboard;