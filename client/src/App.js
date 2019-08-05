import React, { Component } from "react";
import Bottombar from "./components/bottombarComponents/Bottombar";
import Gameboard from "./components/gameboardComponents/Gameboard";
import Zoombox from "./components/zoomboxZomponents/Zoombox";
import Sidebar from "./components/sidebarComponents/Sidebar";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { selectPosition, menuSelect } from "./redux/actions/userActions";

const appStyle = {
	position: "relative",
	backgroundColor: "blue",
	height: "100%",
	width: "100%"
};

class App extends Component {
	render() {
		return (
			<div
				style={appStyle}
				onClick={event => {
					event.preventDefault();
					if (this.props.selectedMenu === 0) {
						this.props.selectPosition(-1);
					} else {
						this.props.menuSelect(0);
					}
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
	menuSelect: PropTypes.func.isRequired
};

const mapStateToProps = ({ selectedMenu }) => ({ selectedMenu: selectedMenu });

const mapActionsToProps = {
	selectPosition: selectPosition,
	menuSelect: menuSelect
};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(App);
