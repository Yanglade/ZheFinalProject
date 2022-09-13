import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from "@auth0/auth0-react";
import UserProvider from "./context/UserContext";


// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider 
      domain= {process.env.REACT_APP_DOMAIN} //"dev-qnlaia4l.us.auth0.com"
      clientId= {process.env.REACT_APP_CLIENT_ID} //"x3drZaEn8agYYg49vHIm5G0JdmygY3QG"
      redirectUri={window.location.origin}
    >
      <UserProvider>
          <App />
      </UserProvider>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
