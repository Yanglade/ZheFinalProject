import React from "react";
import styled from "styled-components";
import {NavLink} from "react-router-dom";


const Header = () => {

  return (
    <Wrapper>
       <NavLink to="/">Board</NavLink>
       <NavLink to="/treeview">Treeview</NavLink>
       <NavLink to="/inspirational">Inspirational</NavLink>
       <NavLink to="/calendar">Calendar</NavLink>
       <NavLink to="/">Login</NavLink>
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

export default Header;