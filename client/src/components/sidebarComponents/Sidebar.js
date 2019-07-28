import React, { Component } from "react";
import { connect } from "react-redux";
import Shop from "./Shop";
import Inventory from "./Inventory";
import Gameinfo from "./Gameinfo";
import { menuSelect } from "../../redux/actions/userActions";

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
				<button onClick={() => this.props.menuSelect(1)}>Shop</button>
				<button onClick={() => this.props.menuSelect(2)}>Inventory</button>
				<button onClick={() => this.props.menuSelect(3)}>Gameinfo</button>
				<Shop selected={this.props.menuSelected === 1} />
				<Inventory selected={this.props.menuSelected === 2} />
				<Gameinfo
					gameInfo={this.props.gameInfo}
					selected={this.props.menuSelected === 3}
				/>
			</div>
		);
	}
}

const mapStateToProps = ({ gameInfo, menuSelected }) => ({
	gameInfo: gameInfo,
	menuSelected: menuSelected
});

const mapActionsToProps = {
	menuSelect: menuSelect
};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(Sidebar);
