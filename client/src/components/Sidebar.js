import React, { Component } from "react";
import { connect } from "react-redux";

class Sidebar extends Component {
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
				<button>Shop</button>
				<button>Inventory</button>
				<button>{this.props.gameInfo.gameSection}</button>
				{/* component for shop */}
				{/* component for inventory */}
				{/* component for game info (points, stats, section / instructor?, game version...debug stuff?) */}
			</div>
		);
	}
}

const mapStateToProps = ({ gameInfo }) => ({
	gameInfo: gameInfo
});

export default connect(mapStateToProps)(Sidebar);
