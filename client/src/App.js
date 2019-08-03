import React, { Component } from "react";
import Sidebar from "./components/sidebarComponents/Sidebar";
import Bottombar from "./components/bottombarComponents/Bottombar";
import Gameboard from "./components/gameboardComponents/Gameboard";

class App extends Component {
	appStyle = {
		position: "relative",
		backgroundColor: "black",
		height: "100%",
		width: "100%"
	};

	render() {
		return (
			<div style={this.appStyle}>
				<Sidebar />
				<Bottombar />
				<Gameboard />
			</div>
		);
	}
}

export default App;
