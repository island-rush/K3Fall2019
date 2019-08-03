import React, { Component } from "react";
import PropTypes from "prop-types";
import InvItem from "./InvItem";
import { connect } from "react-redux";

class InvMenu extends Component {
	inventoryStyle = {
		backgroundColor: "Yellow",
		position: "absolute",
		height: "120%",
		width: "1800%",
		marginLeft: "150%",
		marginTop: "20%"
	};

	invisibleStyle = {
		display: "none"
	};

	render() {
		const inventoryItemComponents = this.props.invItems.map(
			(invItem, index) => <InvItem key={index} invItem={invItem} />
		);

		return (
			<div
				style={this.props.selected ? this.inventoryStyle : this.invisibleStyle}
			>
				{inventoryItemComponents}
			</div>
		);
	}
}

InvMenu.propTypes = {
	selected: PropTypes.bool.isRequired,
	invItems: PropTypes.array.isRequired
};

const mapStateToProps = ({ invItems }) => ({
	invItems: invItems
});

export default connect(mapStateToProps)(InvMenu);
