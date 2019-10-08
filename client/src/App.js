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
		const { gameboardMeta, selectPosition, menuSelect, clearPieceSelection } = this.props;

		return (
			<div
				style={{
					...appStyle,
					...(gameboardMeta.planning.active ? isPlanningStyle : "")
				}}
				onClick={event => {
					event.preventDefault();
					if (gameboardMeta.selectedMenuId === 0) {
						selectPosition(-1);
					} else {
						menuSelect(0);
					}
					clearPieceSelection();
					event.stopPropagation();
				}}
			>
				<Bottombar />
				<Gameboard />
				<Zoombox />
				<Sidebar selectedMenu={gameboardMeta.selectedMenuId} />
			</div>
		);
	}
}

App.propTypes = {
	gameboardMeta: PropTypes.object.isRequired,
	selectPosition: PropTypes.func.isRequired,
	menuSelect: PropTypes.func.isRequired,
	clearPieceSelection: PropTypes.func.isRequired
};

const mapStateToProps = ({ gameboardMeta }) => ({
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
