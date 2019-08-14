import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const battlePopupStyle = {
	backgroundColor: "white",
	width: "50%",
	height: "50%",
	top: "25%",
	right: "25%",
	position: "absolute"
};

const invisibleStyle = {
	display: "none"
};

class BattlePopup extends Component {
	render() {
		return (
			<div style={this.props.battle.active ? battlePopupStyle : invisibleStyle}>
				Battle Popup!
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
