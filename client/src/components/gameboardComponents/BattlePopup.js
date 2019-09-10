import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const battlePopupStyle = {
	position: "absolute",
	display: "block",
	width: "80%",
	height: "80%",
	top: "10%",
	right: "10%",
	backgroundColor: "white",
	border: "2px solid black",
	zIndex: 4
};

const leftBattleStyle = {
	position: "relative",
	overflow: "scroll",
	float: "left",
	backgroundColor: "grey",
	height: "96%",
	width: "48%",
	margin: "1%"
};

const rightBattleStyle = {
	position: "relative",
	overflow: "scroll",
	backgroundColor: "grey",
	height: "90%",
	width: "48%",
	float: "right",
	margin: "1%"
};

const battleButtonStyle = {
	position: "relative",
	bottom: "1%",
	left: "40%"
};

const invisibleStyle = {
	display: "none"
};

class BattlePopup extends Component {
	render() {
		return (
			<div style={this.props.battle.active ? battlePopupStyle : invisibleStyle}>
				<div style={leftBattleStyle}>{/* {friendlyBattlePieces} */}</div>
				<div style={rightBattleStyle}>{/* {enemyBattlePieces} */}</div>
				<button
					onClick={() => {
						alert("Clicked Button!");
					}}
					style={battleButtonStyle}
				>
					DONE
				</button>
			</div>
		);
	}
}

BattlePopup.propTypes = {
	battle: PropTypes.object.isRequired
};

const mapStateToProps = ({ gameboardMeta }) => ({
	battle: gameboardMeta.battle
});

const mapActionsToProps = {};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(BattlePopup);
