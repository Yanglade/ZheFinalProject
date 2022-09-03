import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
// import DragDrop from "../src/pages/DragDrop";
import Board from "./pages/Board";
import Treeview from "../src/pages/Treeview";
import Inspirational from "../src/pages/Inspirational";
import Calendar from "../src/pages/Calendar";
import Dashboard from "../src/pages/Dashboard";
import {useAuth0} from "@auth0/auth0-react";

const App = () => {

  const { loginWithRedirect, user, isAuthenticated, error, logout } = useAuth0();

  console.log(`user = `, user);
  console.log(`isAuthenticated = `, isAuthenticated);
  console.log(`error = `, error);


  return (
    !isAuthenticated ?
      <>
        <button onClick={()=>loginWithRedirect()}>Login</button>
      </>
      : (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Board/>} />
        <Route exact path="/dashboard" element={<Dashboard/>} />
        <Route exact path="/treeview" element={<Treeview/>} />
        <Route exact path="/inspirational" element={<Inspirational/>} />
        <Route exact path="/calendar" element={<Calendar/>} />
      </Routes>
    </BrowserRouter>
  )
  )
}

export default App;
