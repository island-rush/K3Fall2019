import React, { Component } from "react";
import Bottombar from "./components/bottombarComponents/Bottombar";
import Gameboard from "./components/gameboardComponents/Gameboard";
import Zoombox from "./components/zoomboxZomponents/Zoombox";
import Sidebar from "./components/sidebarComponents/Sidebar";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { selectPosition, menuSelect, clearPieceSelection } from "./redux/actions/userActions";

const appStyle = {
	position: "relative",
	backgroundColor: "blue",
	height: "100%",
	width: "100%"
};

const isPlanningStyle = {
	backgroundColor: "yellow"
};

class App extends Component {
	render() {
		return (
			<div
				style={{
					...appStyle,
					...(this.props.gameboardMeta.planning.active ? isPlanningStyle : "")
				}}
				onClick={event => {
					event.preventDefault();
					if (this.props.selectedMenu === 0) {
						this.props.selectPosition(-1);
					} else {
						this.props.menuSelect(0);
					}
					this.props.clearPieceSelection();
					event.stopPropagation();
				}}
			>
				<Bottombar />
				<Gameboard />
				<Zoombox />
				<Sidebar />
			</div>
		);
	}
}

App.propTypes = {
	selectPosition: PropTypes.func.isRequired,
	menuSelect: PropTypes.func.isRequired,
	gameboardMeta: PropTypes.object.isRequired
};

const mapStateToProps = ({ selectedMenu, gameboardMeta }) => ({
	selectedMenu,
	gameboardMeta
});

const mapActionsToProps = {
	selectPosition: selectPosition,
	menuSelect: menuSelect,
	clearPieceSelection: clearPieceSelection
};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(App);
