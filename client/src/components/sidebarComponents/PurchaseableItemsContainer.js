import React from "react";
import PropTypes from "prop-types";
import PurchaseableItem from "./PurchaseableItem";

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
			<div>Store -> Points: {points}</div>
			<PurchaseableItem purchase={purchase} typeId={0} />
			<PurchaseableItem purchase={purchase} typeId={1} />
			<PurchaseableItem purchase={purchase} typeId={2} />
			<PurchaseableItem purchase={purchase} typeId={3} />
			<PurchaseableItem purchase={purchase} typeId={4} />
			<PurchaseableItem purchase={purchase} typeId={5} />
			<PurchaseableItem purchase={purchase} typeId={6} />
			<PurchaseableItem purchase={purchase} typeId={7} />
			<PurchaseableItem purchase={purchase} typeId={8} />
			<PurchaseableItem purchase={purchase} typeId={9} />
			<PurchaseableItem purchase={purchase} typeId={10} />
			<PurchaseableItem purchase={purchase} typeId={11} />
			<PurchaseableItem purchase={purchase} typeId={12} />
			<PurchaseableItem purchase={purchase} typeId={13} />
			<PurchaseableItem purchase={purchase} typeId={14} />
			<PurchaseableItem purchase={purchase} typeId={15} />
			<PurchaseableItem purchase={purchase} typeId={16} />
			<PurchaseableItem purchase={purchase} typeId={17} />
			<PurchaseableItem purchase={purchase} typeId={18} />
			<PurchaseableItem purchase={purchase} typeId={19} />
		</div>
	);
};

PurchaseableItemsContainer.propTypes = {
	purchase: PropTypes.func.isRequired,
	points: PropTypes.number.isRequired
};

export default PurchaseableItemsContainer;
