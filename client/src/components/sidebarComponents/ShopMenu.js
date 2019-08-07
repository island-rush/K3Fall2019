import React, { Component } from "react";
import { connect } from "react-redux";
import {
	shopPurchaseRequest,
	shopRefundRequest,
	shopConfirmPurchase
} from "../../redux/actions/userActions";
import ShopCartArea from "./ShopCartArea";
import PropTypes from "prop-types";
import PurchaseableItemsContainer from "./PurchaseableItemsContainer";

const shopStyle = {
	backgroundColor: "Yellow",
	position: "absolute",
	height: "225%",
	width: "1800%",
	marginLeft: "150%",
	marginTop: "20%"
};

const invisibleStyle = {
	display: "none"
};

const purchaseButtonStyle = {
	position: "absolute",
	bottom: "1%",
	right: "1%",
	height: "5%",
	width: "10%",
	backgroundColor: "pink"
};

class ShopMenu extends Component {
	render() {
		return (
			<div style={this.props.selected ? shopStyle : invisibleStyle}>
				<ShopCartArea
					refund={this.props.refund}
					shopItems={this.props.shopItems}
				/>
				<PurchaseableItemsContainer
					points={this.props.points}
					purchase={this.props.purchase}
				/>
				<div
					style={purchaseButtonStyle}
					onClick={event => {
						event.preventDefault();
						this.props.confirmPurchase();
						event.stopPropagation();
					}}
				>
					Confirm Purchase
				</div>
			</div>
		);
	}
}

ShopMenu.propTypes = {
	shopItems: PropTypes.array.isRequired,
	selected: PropTypes.bool.isRequired,
	purchase: PropTypes.func.isRequired,
	refund: PropTypes.func.isRequired,
	points: PropTypes.number.isRequired,
	confirmPurchase: PropTypes.func.isRequired
};

const mapStateToProps = ({ shopItems, gameInfo }) => ({
	shopItems: shopItems,
	points: gameInfo.gamePoints
});

const mapActionsToProps = {
	purchase: shopPurchaseRequest,
	refund: shopRefundRequest,
	confirmPurchase: shopConfirmPurchase
};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(ShopMenu);
