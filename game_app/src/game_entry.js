import React from "react";
import ReactDOM from "react-dom";
import "./style/index.css";
import GameComponent from "./game_components/game";
import reportWebVitals from "./reportWebVitals";
import GameHeader from "./game_components/game_header";
import "./style/App.css";
import "./style/game.css";

ReactDOM.render(
    <React.StrictMode>
        <div className="main-content">
            <GameHeader />
            <GameComponent />
        </div>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
