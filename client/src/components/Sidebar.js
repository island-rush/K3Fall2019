import React, { Component } from "react";

export default class Sidebar extends Component {
	sidebarStyle = {
		backgroundColor: "Red",
		position: "absolute",
		top: "0%",
		left: "0%",
		height: "68%",
		width: "5%"
	};

	render() {
		return (
			<div style={this.sidebarStyle}>
				<button>Menu1</button>
				<button>Menu2</button>
				<button>Menu3</button>
				{/* component for shop */}
				{/* component for inventory */}
				{/* component for game info (points, stats, section / instructor?, game version...debug stuff?) */}
			</div>
		);
	}
}
