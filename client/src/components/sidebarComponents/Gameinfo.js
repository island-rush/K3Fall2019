import React from "react";

const gameinfoStyle = {
	backgroundColor: "Yellow",
	position: "absolute",
	height: "50%",
	width: "500%",
	marginLeft: "200%",
	marginTop: "20%"
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
