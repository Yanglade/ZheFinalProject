import React, {useEffect, useState} from "react";
import styled, {keyframes} from "styled-components";
import { FiLoader } from "react-icons/fi";


const Quotes = () => {
  const [quote, setQuote] = useState({});
  const [loading, setLoading] = useState();

  const getQuote = async () => {
    // const proxyurl = "https://cors-anywhere.herokuapp.com/";
    // const res = await fetch(proxyurl + "https://zenquotes.io/api/random/3");
    const res = await fetch("https://zenquotes.io/api/random/3",  {mode: "no-cors"});
    const json = await res.json();
    const {data} = json;
    console.log(`data = `, data.data.parsedResponse);
    setQuote(data.data.parsedResponse);
  }

  useEffect(()=> {
    setLoading(true)
    getQuote();
    if (quote !== {})
      setLoading(false);

    console.log(`quote = `, quote);
  }, []) //[quote]

  return (
    loading ? (
      <QuotesWrapper>
        <SpinnerWrapper>
          <LoaderDiv>
            <FiLoader />
          </LoaderDiv>
        </SpinnerWrapper>
      </QuotesWrapper>
      ): (
      <QuotesWrapper>
        <TitleDiv style={{fontWeight: "bold", textAlign:"center"}}>Quote</TitleDiv>
        <div></div>
      </QuotesWrapper>
      )
  )
}

const QuotesWrapper = styled.div`
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 10px;
`;

const TitleDiv = styled.div`

`;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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



export default Quotes;