import React from "react";
import PropTypes from "prop-types";
import PurchaseableItem from "./PurchaseableItem";

const purchaseableItemsContainerStyle = {
	backgroundColor: "red",
	position: "absolute",
	width: "15%",
	height: "80%",
	left: "39%",
	top: "10%"
};

const PurchaseableItemsContainerAir = ({ purchase, points }) => {
	return (
		<div style={purchaseableItemsContainerStyle}>
			<div> &nbsp;</div>
			<div style ={{fontSize:"20px"}}>Air</div>
			<PurchaseableItem purchase={purchase} typeId={0} />		
			<PurchaseableItem purchase={purchase} typeId={1} />
			<PurchaseableItem purchase={purchase} typeId={2} />
			<PurchaseableItem purchase={purchase} typeId={3} />
			<PurchaseableItem purchase={purchase} typeId={4} />
			<PurchaseableItem purchase={purchase} typeId={5} />
			<PurchaseableItem purchase={purchase} typeId={10} />
			<PurchaseableItem purchase={purchase} typeId={17} />
			<PurchaseableItem purchase={purchase} typeId={18} />
		</div>
	);
};

PurchaseableItemsContainerAir.propTypes = {
	purchase: PropTypes.func.isRequired,
	points: PropTypes.number.isRequired
};

export default PurchaseableItemsContainerAir;
