import React from "react";
import styled from "styled-components";
import {NavLink} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";


const Header = () => {  

  const {logout} = useAuth0();

  return (
    <Wrapper>
       <NavLink to="/">Board</NavLink>
       <NavLink to="/treeview">Treeview</NavLink>
       <NavLink to="/inspirational">Inspirational</NavLink>
       <NavLink to="/calendar">Calendar</NavLink>
       {/* <NavLink to="/">Login</NavLink> */}
       <LogoutButton onClick={()=>logout()}>Logout</LogoutButton>
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
`

export default Header;