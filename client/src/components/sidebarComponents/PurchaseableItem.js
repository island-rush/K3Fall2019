import React from "react";
import PropTypes from "prop-types";
import { TYPE_IMAGES } from "../styleConstants";
import { TYPE_COSTS, TYPE_MOVES, TYPE_FUEL, TYPE_NAMES } from "../../gameData/gameConstants";

const purchaseableItemStyle = {
	backgroundColor: "grey",
	position: "relative",
	width: "28%",
	paddingTop: "28%",
	margin: "2.5%",
	float: "left",
	// left: "5%",
	backgroundSize: "100% 100%",
	backgroundRepeat: "no-repeat"
};

const PurchaseableItem = ({ typeId, purchase }) => {
	return (
		<div
			style={{ ...purchaseableItemStyle, ...TYPE_IMAGES[typeId] }}
			onClick={event => {
				event.preventDefault();
				purchase(typeId);
				event.stopPropagation();
			}}
			title={`${TYPE_NAMES[typeId]}\nCost: ${TYPE_COSTS[typeId]}\nMoves: ${TYPE_MOVES[typeId]}\nFuel: ${TYPE_FUEL[typeId]}`}
		/>
	);
};

PurchaseableItem.propTypes = {
	typeId: PropTypes.number.isRequired,
	purchase: PropTypes.func.isRequired
};

export default PurchaseableItem;
