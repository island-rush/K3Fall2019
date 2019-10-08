import React from "react";
import { typeImages } from "../constants";
import { TYPE_COSTS, TYPE_MOVES, TYPE_FUEL, TYPE_NAMES } from "../../gameData/gameConstants";
import PropTypes from "prop-types";

const purchaseableItemStyle = {
	backgroundColor: "grey",
	position: "relative",
	width: "20%",
	paddingTop: "20%",
	margin: "1%",
	float: "left",
	backgroundSize: "100% 100%",
	backgroundRepeat: "no-repeat"
};

const PurchaseableItem = ({ typeId, purchase }) => {
	return (
		<div
			style={{ ...purchaseableItemStyle, ...typeImages[typeId] }}
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
