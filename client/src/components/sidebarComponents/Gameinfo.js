import React from "react";
import PropTypes from "prop-types";

const gameinfoStyle = {
	backgroundColor: "Yellow",
	position: "absolute",
	height: "80%",
	width: "500%",
	marginLeft: "200%",
	marginTop: "20%"
};

const invisibleStyle = {
	display: "none"
};

const Gameinfo = ({ selected, gameInfo }) => {
	return (
		<div style={selected ? gameinfoStyle : invisibleStyle}>
			Gameinfo
			<div>GameSection: {gameInfo.gameSection}</div>
			<div>GameInstructor: {gameInfo.gameInstructor}</div>
			<div>GameController: {gameInfo.gameController}</div>
			<div>GamePhase: {gameInfo.gamePhase}</div>
			<div>GameRound: {gameInfo.gameRound}</div>
			<div>GameSlice: {gameInfo.gameSlice}</div>
		</div>
	);
};

Gameinfo.propTypes = {
	selected: PropTypes.bool.isRequired,
	gameInfo: PropTypes.object.isRequired
};

export default Gameinfo;
