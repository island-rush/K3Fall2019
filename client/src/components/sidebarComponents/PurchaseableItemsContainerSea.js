import React from "react";
import PropTypes from "prop-types";
import PurchaseableItem from "./PurchaseableItem";

const purchaseableItemsContainerStyle = {
	backgroundColor: "red",
	position: "absolute",
	width: "15%",
	height: "80%",
	left: "22%",
	top: "10%"
};

const PurchaseableItemsContainerSea = ({ purchase, points }) => {
	return (
		<div style={purchaseableItemsContainerStyle}>
			<div> &nbsp;</div>
			<div style ={{fontSize:"20px"}}>Sea</div>
			<PurchaseableItem purchase={purchase} typeId={13} />
			<PurchaseableItem purchase={purchase} typeId={14} />
			<PurchaseableItem purchase={purchase} typeId={15} />
			<PurchaseableItem purchase={purchase} typeId={16} />
		</div>
	);
};

PurchaseableItemsContainerSea.propTypes = {
	purchase: PropTypes.func.isRequired,
	points: PropTypes.number.isRequired
};

export default PurchaseableItemsContainerSea;
