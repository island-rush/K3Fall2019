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


const airpieceItemsContainerStyle = {
	backgroundColor: "pink",
	position: "absolute",
	width: "18%",
	height: "80%",
	right: "81%",
	top: "10%"
};

const landpieceItemsContainerStyle = {
	backgroundColor: "pink",
	position: "absolute",
	width: "18%",
	height: "80%",
	right: "61%",
	top: "10%"
};
const seapieceItemsContainerStyle = {
	backgroundColor: "pink",
	position: "absolute",
	width: "18%",
	height: "80%",
	right: "41%",
	top: "10%"
};
const specialpieceItemsContainerStyle = {
	backgroundColor: "pink",
	position: "absolute",
	width: "18%",
	height: "80%",
	right: "21%",
	top: "10%"
};

const warfareItemsContainerStyle = {
	backgroundColor: "pink",
	position: "absolute",
	width: "18%",
	height: "80%",
	left: "81%",
	top: "10%"
};
class InvMenu extends Component {
	render() {
		const { selected, invItems, invItemClick } = this.props;

		const airItems = invItems.filter(item => {
			return item.invItemTypeId <=5 && item.invItemTypeId>=0;
		});
		const landItems = invItems.filter(item => {
			return item.invItemTypeId <=12 && item.invItemTypeId>=6;
		});
		const seaItems = invItems.filter(item => {
			return item.invItemTypeId <=16 && item.invItemTypeId>=13;
		});

		const specialItems = invItems.filter(item => {
			return item.invItemTypeId <=19 && item.invItemTypeId>=17;
		});
		
		const airInvComponents = airItems.map((invItem, index) => <InvItem key={index} invItem={invItem} invItemClick={invItemClick} />);
		const landInvComponents = landItems.map((invItem, index) => <InvItem key={index} invItem={invItem} invItemClick={invItemClick} />);
		const seaInvComponents = seaItems.map((invItem, index) => <InvItem key={index} invItem={invItem} invItemClick={invItemClick} />);
		const specialInvComponents = specialItems.map((invItem, index) => <InvItem key={index} invItem={invItem} invItemClick={invItemClick} />);

		const warfareInvItems = invItems.filter(item => {
			return item.invItemTypeId > 19;//TODO: (19) this should be a constant in gameData, number of pieces may change...
		});

		const warefareInvItemComponents = warfareInvItems.map((invItem, index) => <InvItem key={index} invItem={invItem} invItemClick={invItemClick} />);

		const pieceInvItems = invItems.filter(item => {
			return item.invItemTypeId <= 19;
		});

		return (
			<div style={selected ? inventoryStyle : invisibleStyle}>
				<div style={warfareItemsContainerStyle}>
					<div>Capabilities</div>
					{warefareInvItemComponents}
				</div>
				<div style={airpieceItemsContainerStyle}>
					<div> Air Pieces</div>
					{airInvComponents}
				</div>
				<div style={landpieceItemsContainerStyle}>
					<div>Land Pieces</div>
					{landInvComponents}
				</div>
				<div style={seapieceItemsContainerStyle}>
					<div>Maritime Pieces</div>
					{seaInvComponents}
				</div>
				<div style={specialpieceItemsContainerStyle}>
					<div>SOF Pieces</div>
					{specialInvComponents}
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
