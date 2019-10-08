import React, { Component } from "react";
import PropTypes from "prop-types";
import { TYPE_NAMES, TYPE_MOVES, TYPE_FUEL } from "../../gameData/gameConstants";
import { TYPE_IMAGES } from "../styleConstants";

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
		const { invItem, invItemClick } = this.props;
		const { invItemTypeId } = invItem;

		return (
			<div
				style={{
					...invItemStyle,
					...TYPE_IMAGES[invItemTypeId]
				}}
				title={`${TYPE_NAMES[invItemTypeId]}\nMoves: ${TYPE_MOVES[invItemTypeId]}\nFuel: ${TYPE_FUEL[invItemTypeId]}`}
				onClick={event => {
					event.preventDefault();
					invItemClick(invItem);
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
