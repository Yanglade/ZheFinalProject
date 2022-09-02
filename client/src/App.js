import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
// import DragDrop from "../src/pages/DragDrop";
import Board from "./pages/Board";
import Treeview from "../src/pages/Treeview";
import Inspirational from "../src/pages/Inspirational";
import Calendar from "../src/pages/Calendar";

const App = () => {
  // console.log("in App");
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Board/>} />
        {/* <Route exact path="/dashboard" element={<Dashboard/>} /> */}
        <Route exact path="/treeview" element={<Treeview/>} />
        <Route exact path="/inspirational" element={<Inspirational/>} />
        <Route exact path="/calendar" element={<Calendar/>} />
      </Routes>
    </BrowserRouter>

  )
}

export default App;
