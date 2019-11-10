import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import InvItem from "./InvItem";
//prettier-ignore
import { airPieceClick, landPieceClick, seaPieceClick, atcScamble, cyberDominance, missileLaunchDisruption, communicationsInterruption, remoteSensing, rodsFromGod, antiSatelliteMissiles, goldenEye, nuclearStrike, biologicalWeapons, seaMines, droneSwarms, insurgency, raiseMorale } from "../../redux/actions";
import { TYPE_NAME_IDS } from "../../gameData/gameConstants";

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
		//TODO: selected is a poorly chosen variable name, change to MenuIsVisible or something (since selected is used for other components too)
		//prettier-ignore
		const { selected, invItems, airPieceClick, landPieceClick, seaPieceClick, atcScamble, cyberDominance, missileLaunchDisruption, communicationsInterruption, remoteSensing, rodsFromGod, antiSatelliteMissiles, goldenEye, nuclearStrike, biologicalWeapons, seaMines, droneSwarms, insurgency, raiseMorale } = this.props;

		const capabilityFunctions = {
			20: atcScamble,
			21: cyberDominance,
			22: missileLaunchDisruption,
			23: communicationsInterruption,
			24: remoteSensing,
			25: rodsFromGod,
			26: antiSatelliteMissiles,
			27: goldenEye,
			28: nuclearStrike,
			29: biologicalWeapons,
			30: seaMines,
			31: droneSwarms,
			32: insurgency,
			33: raiseMorale
		};

		//TODO: change these numbers to constants, or change to use the ownership stuff
		//Also need to distinguish the capabilities from the pieces (better) (probably with different constants?)
		//TODO: could refactor without 5 filters, probably 1 loop through all with checks and then different lists to append to
		const airItems = invItems.filter(item => {
			return item.invItemTypeId <= 5 && item.invItemTypeId >= 0;
		});
		const landItems = invItems.filter(item => {
			return item.invItemTypeId <= 12 && item.invItemTypeId >= 6;
		});
		const seaItems = invItems.filter(item => {
			return item.invItemTypeId <= 16 && item.invItemTypeId >= 13;
		});
		const specialItems = invItems.filter(item => {
			return item.invItemTypeId <= 19 && item.invItemTypeId >= 17;
		});
		const capabilityItems = invItems.filter(item => {
			return item.invItemTypeId > 19;
		});

		const airInvComponents = airItems.map((invItem, index) => <InvItem key={index} invItem={invItem} invItemClick={airPieceClick} />);
		const landInvComponents = landItems.map((invItem, index) => <InvItem key={index} invItem={invItem} invItemClick={landPieceClick} />); //TODO: are helicopters special? (placed not on land?) -> determine other special cases if able
		const seaInvComponents = seaItems.map((invItem, index) => <InvItem key={index} invItem={invItem} invItemClick={seaPieceClick} />);

		//SOF team is the only land piece in special group, others are air pieces
		const specialInvComponents = specialItems.map((invItem, index) => (
			<InvItem key={index} invItem={invItem} invItemClick={invItem.invItemTypeId === TYPE_NAME_IDS["SOF Team"] ? landPieceClick : airPieceClick} />
		));

		const capabilityItemComponents = capabilityItems.map((invItem, index) => <InvItem key={index} invItem={invItem} invItemClick={capabilityFunctions[invItem.invItemTypeId]} />);

		return (
			<div style={selected ? inventoryStyle : invisibleStyle}>
				<div style={warfareItemsContainerStyle}>
					<div>Capabilities</div>
					{capabilityItemComponents}
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
	selected: PropTypes.bool.isRequired, //from the parent
	invItems: PropTypes.array.isRequired,
	airPieceClick: PropTypes.func.isRequired,
	landPieceClick: PropTypes.func.isRequired,
	seaPieceClick: PropTypes.func.isRequired,
	atcScamble: PropTypes.func.isRequired,
	cyberDominance: PropTypes.func.isRequired,
	missileLaunchDisruption: PropTypes.func.isRequired,
	communicationsInterruption: PropTypes.func.isRequired,
	remoteSensing: PropTypes.func.isRequired,
	rodsFromGod: PropTypes.func.isRequired,
	antiSatelliteMissiles: PropTypes.func.isRequired,
	goldenEye: PropTypes.func.isRequired,
	nuclearStrike: PropTypes.func.isRequired,
	biologicalWeapons: PropTypes.func.isRequired,
	seaMines: PropTypes.func.isRequired,
	droneSwarms: PropTypes.func.isRequired,
	insurgency: PropTypes.func.isRequired,
	raiseMorale: PropTypes.func.isRequired
};

const mapStateToProps = ({ invItems }) => ({
	invItems
});

const mapActionsToProps = {
	airPieceClick,
	landPieceClick,
	seaPieceClick,
	//TODO: refactor to use names / variables instead of hard coded numbers? (refactor to throw these in an object/array)
	atcScamble,
	cyberDominance,
	missileLaunchDisruption,
	communicationsInterruption,
	remoteSensing,
	rodsFromGod,
	antiSatelliteMissiles,
	goldenEye,
	nuclearStrike,
	biologicalWeapons,
	seaMines,
	droneSwarms,
	insurgency,
	raiseMorale
};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(InvMenu);
