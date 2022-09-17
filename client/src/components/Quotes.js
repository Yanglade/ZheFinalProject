import React, {useEffect, useState} from "react";
import styled, {keyframes} from "styled-components";
import { FiLoader } from "react-icons/fi";


const Quotes = () => {
  const [quote, setQuote] = useState([]);
  const [loading, setLoading] = useState();

  const getQuote = async () => {
    // const proxyurl = "https://cors-anywhere.herokuapp.com/";
    // const res = await fetch(proxyurl + "https://zenquotes.io/api/random/3");
    const res = await fetch("/zen");
    const json = await res.json();
    console.log({json})
    const {data} = json;
    console.log(`data = `, data[0]);
    setQuote(data[0]);
  }

  useEffect(async()=> {
    setLoading(true)
    await getQuote();
    if (quote)
      setLoading(false);

    console.log(`quote = `, quote);
  }, []) //[quote]

  return (
    (loading || quote === undefined)? (
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
        <div>{quote.q}</div>
        <div>{quote.a}</div>
        <button style={{width:"100px", height:"30px", alignSelf:"center"}} onClick={()=>getQuote()}>New quote</button>
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