import React, {useContext} from "react";
import styled from "styled-components";
import {NavLink} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import {UserContext} from "../context/UserContext";


const Header = ({logout}) => {  

  // const {logout} = useAuth0();
  const {userState} = useContext(UserContext);

  console.log(`userState.............................. = `, userState);

  return (
    <Wrapper>
      <NavLink to="/">Home</NavLink>
       {userState.boardsForUser && userState.boardsForUser.length && <NavLink to={`/board/${userState.boardsForUser[0]._id}`}>Board</NavLink>}
       <NavLink to="/treeview">Treeview</NavLink>
       <NavLink to="/inspirational">Inspirational</NavLink>
       <NavLink to="/calendar">Calendar</NavLink>
       {/* <NavLink to="/">Login</NavLink> */}
       <UserDiv>
        <UserAvatar><img style={{height:"100%",width:"auto"}}src={userState.picture}/></UserAvatar>
        <LogoutButton onClick={()=>logout?.()}>Logout</LogoutButton>
       </UserDiv>
       
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100vw;
  height: 50px;
  background-color: azure;
  display: flex;
  justify-content: space-evenly;
`;

const LogoutButton = styled.button`
  height: 30px;
  width: 60px;
`;

const UserAvatar = styled.div`
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background-color: blue;
  color: white;
  font-weight: bold;
  font-size: 20px;
  text-align: center;
`;

const UserDiv = styled.div`
  display: flex;
`;

export default Header;