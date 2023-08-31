import React from "react";
import logo from './logo.svg';
import './App.css';
import CostsApplication from "./costs-application";

function App() {
    return (
        <>
            <div className="flex justify-center">
                <span className="self-center text-purple-300 italic">Welcome to</span>
                <img src={logo} className="App-logo" alt="logo"/>
                <span className="self-center text-purple-300 italic"> Costs application</span>
            </div>
            <CostsApplication/>
        </>
    );
}

export default App;
