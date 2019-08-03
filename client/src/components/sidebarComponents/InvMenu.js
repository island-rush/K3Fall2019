import React, { Component } from "react";
import PropTypes from "prop-types";
import InvItem from "./InvItem";
import { connect } from "react-redux";

class InvMenu extends Component {
	inventoryStyle = {
		backgroundColor: "Yellow",
		position: "absolute",
		height: "250%",
		width: "1800%",
		marginLeft: "150%",
		marginTop: "20%",
		padding: "1%"
	};

	invisibleStyle = {
		display: "none"
	};

	warfareItemsContainerStyle = {
		backgroundColor: "pink",
		position: "absolute",
		width: "20%",
		height: "80%",
		left: "1%",
		top: "1%"
	};

	pieceItemsContainerStyle = {
		backgroundColor: "pink",
		position: "absolute",
		width: "20%",
		height: "80%",
		right: "1%",
		top: "1%"
	};

	render() {
		const inventoryItemComponents = this.props.invItems.map(
			(invItem, index) => <InvItem key={index} invItem={invItem} />
		);

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
			<div
				style={this.props.selected ? this.inventoryStyle : this.invisibleStyle}
			>
				<div style={this.warfareItemsContainerStyle}>
					<div>Warefare</div>
					{warefareInvItemComponents}
				</div>
				<div style={this.pieceItemsContainerStyle}>
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
