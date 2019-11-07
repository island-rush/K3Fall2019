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
	backgroundSize: "100% 100%",
	backgroundRepeat: "no-repeat"
};

const PurchaseableItem = ({ typeId, purchase }) => {
	const style = { ...purchaseableItemStyle, ...TYPE_IMAGES[typeId] };

	const name = TYPE_NAMES[typeId];
	const cost = TYPE_COSTS[typeId];
	const moves = TYPE_MOVES[typeId];
	const fuel = TYPE_FUEL[typeId];

	const title = `${name}\nCost: ${cost}\nMoves: ${moves !== undefined ? moves : "N/A"}\nFuel: ${fuel !== undefined && fuel !== -1 ? fuel : "N/A"}`;

	const onClick = event => {
		event.preventDefault();
		purchase(typeId);
		event.stopPropagation();
	};

	return <div style={style} title={title} onClick={onClick} />;
};

PurchaseableItem.propTypes = {
	typeId: PropTypes.number.isRequired,
	purchase: PropTypes.func.isRequired
};

export default PurchaseableItem;
