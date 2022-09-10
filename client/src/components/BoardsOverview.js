import React, {useContext, useEffect} from "react";
import {UserContext} from "../context/UserContext";

const BoardOverview = () => {

  const {state} = useContext(UserContext);

  console.log(`state in BoardsOverview = `, state);

  // useEffect(()=> {


  // }, [state]);

  return (
    <>
      <div>Board Overview {state.boards.length}</div>
      {/* {state.boards.length ?
        <div> you have {`${state.boards.length}`} boards</div>
        :
        <div> you don't have any boards</div>
      }  */}
    </>
  )
}

export default BoardOverview;