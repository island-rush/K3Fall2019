import React from "react";
import PropTypes from "prop-types";
import PurchaseableItem from "./PurchaseableItem";

const purchaseableItemsContainerStyle = {
	backgroundColor: "red",
	position: "absolute",
	width: "15%",
	height: "80%",
	left: "5%",
	top: "10%"
};

const PurchaseableItemsContainerLand = ({ purchase, points }) => {
	return (
		<div style={purchaseableItemsContainerStyle}>
			<div style ={{fontSize:"20px"}}>Store -> Points: {points}</div>
			<div style ={{fontSize:"20px"}}>Land</div>
			<PurchaseableItem purchase={purchase} typeId={7} />
			<PurchaseableItem purchase={purchase} typeId={8} />
			<PurchaseableItem purchase={purchase} typeId={9} />
			<PurchaseableItem purchase={purchase} typeId={11} />
			<PurchaseableItem purchase={purchase} typeId={12} />
			<PurchaseableItem purchase={purchase} typeId={19} />
		</div>
	);
};

PurchaseableItemsContainerLand.propTypes = {
	purchase: PropTypes.func.isRequired,
	points: PropTypes.number.isRequired
};

export default PurchaseableItemsContainerLand;
