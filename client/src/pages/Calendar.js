import React from "react";
import styled from "styled-components";
import Header from "../components/Header";

const Calendar = () => {

return (
    <Wrapper>
      <Header/>
        <div>Calendar</div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

export default Calendar;

