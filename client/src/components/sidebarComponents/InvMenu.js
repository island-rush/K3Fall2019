import React, { Component } from "react";
import PropTypes from "prop-types";
import InvItem from "./InvItem";
import { connect } from "react-redux";

const inventoryStyle = {
	backgroundColor: "Yellow",
	position: "absolute",
	height: "225%",
	width: "1800%",
	marginLeft: "150%",
	marginTop: "20%",
	padding: "1%"
};

const invisibleStyle = {
	display: "none"
};

const warfareItemsContainerStyle = {
	backgroundColor: "pink",
	position: "absolute",
	width: "20%",
	height: "80%",
	left: "1%",
	top: "1%"
};

const pieceItemsContainerStyle = {
	backgroundColor: "pink",
	position: "absolute",
	width: "20%",
	height: "80%",
	right: "1%",
	top: "1%"
};

class InvMenu extends Component {
	render() {
		const warfareInvItems = this.props.invItems.filter(item => {
			return item.invItemTypeId === 0;
		});

		const warefareInvItemComponents = warfareInvItems.map((invItem, index) => (
			<InvItem key={index} invItem={invItem} />
		));

		const pieceInvItems = this.props.invItems.filter(item => {
			return item.invItemTypeId !== 0;
		});

		const pieceInvItemComponents = pieceInvItems.map((invItem, index) => (
			<InvItem key={index} invItem={invItem} />
		));

		return (
			<div style={this.props.selected ? inventoryStyle : invisibleStyle}>
				<div style={warfareItemsContainerStyle}>
					<div>Warefare Items</div>
					{warefareInvItemComponents}
				</div>
				<div style={pieceItemsContainerStyle}>
					<div>Pieces</div>
					{pieceInvItemComponents}
				</div>
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
