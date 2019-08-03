import React, { Component } from "react";
import { connect } from "react-redux";
import {
	shopPurchaseRequest,
	shopRefundRequest
} from "../../redux/actions/userActions";
import ShopCartArea from "./ShopCartArea";
import PropTypes from "prop-types";

class ShopMenu extends Component {
	shopStyle = {
		backgroundColor: "Yellow",
		position: "absolute",
		height: "250%",
		width: "1800%",
		marginLeft: "150%",
		marginTop: "20%"
	};

	invisibleStyle = {
		display: "none"
	};

	render() {
		return (
			<div style={this.props.selected ? this.shopStyle : this.invisibleStyle}>
				<div onClick={() => this.props.purchase(0)}>Purchase Item</div>
				<ShopCartArea
					refund={this.props.refund}
					shopItems={this.props.shopItems}
				/>
			</div>
		);
	}
}

ShopMenu.propTypes = {
	shopItems: PropTypes.array.isRequired,
	selected: PropTypes.bool.isRequired,
	purchase: PropTypes.func.isRequired,
	refund: PropTypes.func.isRequired
};

const mapStateToProps = ({ shopItems }) => ({
	shopItems: shopItems
});

const mapActionsToProps = {
	purchase: shopPurchaseRequest,
	refund: shopRefundRequest
};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(ShopMenu);
