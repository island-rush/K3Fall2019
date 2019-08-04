import React from "react";
import PurchaseableItem from "./PurchaseableItem";
import PropTypes from "prop-types";

const purchaseableItemsContainerStyle = {
	backgroundColor: "red",
	position: "absolute",
	width: "20%",
	height: "80%",
	left: "1%",
	top: "1%"
};

const PurchaseableItemsContainer = ({ purchase, points }) => {
	return (
		<div style={purchaseableItemsContainerStyle}>
			<div>Points: {points}</div>
			<PurchaseableItem purchase={purchase} typeId={0} />
			<PurchaseableItem purchase={purchase} typeId={1} />
			<PurchaseableItem purchase={purchase} typeId={2} />
			<PurchaseableItem purchase={purchase} typeId={3} />
		</div>
	);
};

PurchaseableItemsContainer.propTypes = {
	purchase: PropTypes.func.isRequired,
	points: PropTypes.number.isRequired
};

export default PurchaseableItemsContainer;
