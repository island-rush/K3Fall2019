import React, { Component } from "react";
import PropTypes from "prop-types";
import { typeImages } from "../constants";
import { TYPE_NAMES, TYPE_MOVES, TYPE_FUEL } from "../../gameData/gameConstants";

const invItemStyle = {
	position: "relative",
	backgroundColor: "blue",
	width: "20%",
	paddingTop: "20%",
	margin: "1%",
	float: "left",
	backgroundSize: "100% 100%",
	backgroundRepeat: "no-repeat"
};

class InvItem extends Component {
	render() {
		const itemTypeId = this.props.invItem.invItemTypeId;

		return (
			<div
				style={{
					...invItemStyle,
					...typeImages[itemTypeId]
				}}
				title={`${TYPE_NAMES[itemTypeId]}\nMoves: ${TYPE_MOVES[itemTypeId]}\nFuel: ${TYPE_FUEL[itemTypeId]}`}
				onClick={event => {
					event.preventDefault();
					this.props.invItemClick(this.props.invItem);
					event.stopPropagation();
				}}
			/>
		);
	}
}

InvItem.propTypes = {
	invItem: PropTypes.object.isRequired,
	invItemClick: PropTypes.func.isRequired
};

export default InvItem;
