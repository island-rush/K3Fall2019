import React from "react";

const gameinfoStyle = {
	backgroundColor: "Yellow",
	height: "100%",
	width: "300%"
};

const invisibleStyle = {
	display: "none"
};

function Gameinfo(props) {
	return (
		<div style={props.selected ? gameinfoStyle : invisibleStyle}>
			Gameinfo
			<div>GameSection: {props.gameInfo.gameSection}</div>
			<div>GameInstructor: {props.gameInfo.gameInstructor}</div>
			<div>GameController: {props.gameInfo.gameController}</div>
		</div>
	);
}

export default Gameinfo;
