import React from "react";
import PropTypes from "prop-types";
import PurchaseableItem from "./PurchaseableItem";

const purchaseableItemsContainerStyle = {
	backgroundColor: "red",
	position: "absolute",
	width: "15%",
	height: "80%",
	left: "56%",
	top: "10%"
};

const PurchaseableItemsContainerCapabilitiesWarfare = ({ purchase, points }) => {
	return (
		<div style={purchaseableItemsContainerStyle}>
			<div> &nbsp;</div>
			<div style ={{fontSize:"20px"}}>Capabilities and Warfare</div>
		</div>
	);
};

PurchaseableItemsContainerCapabilitiesWarfare.propTypes = {
	purchase: PropTypes.func.isRequired,
	points: PropTypes.number.isRequired
};

export default PurchaseableItemsContainerCapabilitiesWarfare;
