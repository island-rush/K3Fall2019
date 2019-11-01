import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import InvItem from "./InvItem";
import { invItemClick } from "../../redux/actions";

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
		const { selected, invItems, invItemClick } = this.props;

		const warfareInvItems = invItems.filter(item => {
			return item.invItemTypeId > 19;
		});

		const warefareInvItemComponents = warfareInvItems.map((invItem, index) => <InvItem key={index} invItem={invItem} invItemClick={invItemClick} />);

		const pieceInvItems = invItems.filter(item => {
			return item.invItemTypeId <= 19;
		});

		const pieceInvItemComponents = pieceInvItems.map((invItem, index) => <InvItem key={index} invItem={invItem} invItemClick={invItemClick} />);

		return (
			<div style={selected ? inventoryStyle : invisibleStyle}>
				<div style={warfareItemsContainerStyle}>
					<div>Capabilities</div>
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
	invItems: PropTypes.array.isRequired,
	invItemClick: PropTypes.func.isRequired
};

const mapStateToProps = ({ invItems }) => ({
	invItems
});

const mapActionsToProps = {
	invItemClick
};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(InvMenu);
