import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import InvItem from "./InvItem";
//prettier-ignore
import { airPieceClick, landPieceClick, seaPieceClick, atcScamble, cyberDominance, missileLaunchDisruption, communicationsInterruption, remoteSensing, rodsFromGod, antiSatelliteMissiles, goldenEye, nuclearStrike, biologicalWeapons, seaMines, droneSwarms, insurgency, raiseMorale } from "../../redux/actions";
import {
    TYPE_AIR,
    TYPE_SEA,
    TYPE_SPECIAL,
    TYPE_LAND,
    SOF_TEAM_TYPE_ID,
    TYPE_OWNERS,
    LIST_ALL_CAPABILITIES,
    ATC_SCRAMBLE_TYPE_ID,
    CYBER_DOMINANCE_TYPE_ID,
    MISSILE_LAUNCH_DISRUPTION_TYPE_ID,
    COMMUNICATIONS_INTERRUPTION_TYPE_ID,
    REMOTE_SENSING_TYPE_ID,
    RODS_FROM_GOD_TYPE_ID,
    ANTI_SATELLITE_MISSILES_TYPE_ID,
    GOLDEN_EYE_TYPE_ID,
    NUCLEAR_STRIKE_TYPE_ID,
    BIOLOGICAL_WEAPONS_TYPE_ID,
    SEA_MINES_TYPE_ID,
    DRONE_SWARMS_TYPE_ID,
    INSURGENCY_TYPE_ID,
    RAISE_MORALE_TYPE_ID
} from "../../constants/gameConstants";

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

const itemCount = (array, value) => {
    return array.filter(v => v === value).length;
};
class InvMenu extends Component {
    render() {
        //TODO: selected is a poorly chosen variable name, change to MenuIsVisible or something (since selected is used for other components too)
        //prettier-ignore
        const { confirmedRaiseMorale, selected, invItems, airPieceClick, landPieceClick, seaPieceClick, atcScamble, cyberDominance, missileLaunchDisruption, communicationsInterruption, remoteSensing, rodsFromGod, antiSatelliteMissiles, goldenEye, nuclearStrike, biologicalWeapons, seaMines, droneSwarms, insurgency, raiseMorale } = this.props;

        let capabilityFunctions = {};
        capabilityFunctions[ATC_SCRAMBLE_TYPE_ID] = atcScamble;
        capabilityFunctions[CYBER_DOMINANCE_TYPE_ID] = cyberDominance;
        capabilityFunctions[MISSILE_LAUNCH_DISRUPTION_TYPE_ID] = missileLaunchDisruption;
        capabilityFunctions[COMMUNICATIONS_INTERRUPTION_TYPE_ID] = communicationsInterruption;
        capabilityFunctions[REMOTE_SENSING_TYPE_ID] = remoteSensing;
        capabilityFunctions[RODS_FROM_GOD_TYPE_ID] = rodsFromGod;
        capabilityFunctions[ANTI_SATELLITE_MISSILES_TYPE_ID] = antiSatelliteMissiles;
        capabilityFunctions[GOLDEN_EYE_TYPE_ID] = goldenEye;
        capabilityFunctions[NUCLEAR_STRIKE_TYPE_ID] = nuclearStrike;
        capabilityFunctions[BIOLOGICAL_WEAPONS_TYPE_ID] = biologicalWeapons;
        capabilityFunctions[SEA_MINES_TYPE_ID] = seaMines;
        capabilityFunctions[DRONE_SWARMS_TYPE_ID] = droneSwarms;
        capabilityFunctions[INSURGENCY_TYPE_ID] = insurgency;
        capabilityFunctions[RAISE_MORALE_TYPE_ID] = raiseMorale;

        const airItems = invItems.filter(invItem => {
            return TYPE_OWNERS[TYPE_AIR].includes(invItem.invItemTypeId);
        });
        const landItems = invItems.filter(invItem => {
            return TYPE_OWNERS[TYPE_LAND].includes(invItem.invItemTypeId);
        });
        const seaItems = invItems.filter(invItem => {
            return TYPE_OWNERS[TYPE_SEA].includes(invItem.invItemTypeId);
        });
        const specialItems = invItems.filter(invItem => {
            return TYPE_OWNERS[TYPE_SPECIAL].includes(invItem.invItemTypeId);
        });
        const capabilityItems = invItems.filter(invItem => {
            return LIST_ALL_CAPABILITIES.includes(invItem.invItemTypeId);
        });

        const airInvComponents = airItems.map((invItem, index) => <InvItem key={index} invItem={invItem} invItemClick={airPieceClick} />);
        const landInvComponents = landItems.map((invItem, index) => <InvItem key={index} invItem={invItem} invItemClick={landPieceClick} />); //TODO: are helicopters special? (placed not on land?) -> determine other special cases if able
        const seaInvComponents = seaItems.map((invItem, index) => <InvItem key={index} invItem={invItem} invItemClick={seaPieceClick} />);

        //SOF team is the only land piece in special group, others are air pieces
        const specialInvComponents = specialItems.map((invItem, index) => (
            <InvItem key={index} invItem={invItem} invItemClick={invItem.invItemTypeId === SOF_TEAM_TYPE_ID ? landPieceClick : airPieceClick} />
        ));

        const capabilityItemComponents = capabilityItems.map((invItem, index) => (
            <InvItem key={index} invItem={invItem} invItemClick={capabilityFunctions[invItem.invItemTypeId]} />
        ));

        //number of boosts from raise morale
        const airItemMoveBoost = itemCount(confirmedRaiseMorale, TYPE_AIR);
        const landItemMoveBoost = itemCount(confirmedRaiseMorale, TYPE_LAND);
        const seaItemMoveBoost = itemCount(confirmedRaiseMorale, TYPE_SEA);
        const specialItemMoveBoost = itemCount(confirmedRaiseMorale, TYPE_SPECIAL);

        return (
            
           
            <div style={selected ? inventoryStyle : invisibleStyle}>
                <div>Inventory Section for Purchased Items</div>
                <div style={airpieceItemsContainerStyle}>
                    <div> Air Pieces</div>
                    <div> Boost = {airItemMoveBoost}</div>
                    {airInvComponents}
                </div>
                <div style={landpieceItemsContainerStyle}>
                    <div>Land Pieces</div>
                    <div> Boost = {landItemMoveBoost}</div>
                    {landInvComponents}
                </div>
                <div style={seapieceItemsContainerStyle}>
                    <div>Maritime Pieces</div>
                    <div> Boost = {seaItemMoveBoost}</div>
                    {seaInvComponents}
                </div>
                <div style={specialpieceItemsContainerStyle}>
                    <div>SOF Pieces</div>
                    <div> Boost = {specialItemMoveBoost}</div>
                    {specialInvComponents}
                </div>
                <div style={warfareItemsContainerStyle}>
                    <div>Capabilities</div>
                    {capabilityItemComponents}
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
    raiseMorale: PropTypes.func.isRequired,
    confirmedRaiseMorale: PropTypes.array.isRequired
};

const mapStateToProps = ({ invItems, gameboardMeta }) => ({
    invItems,
    confirmedRaiseMorale: gameboardMeta.confirmedRaiseMorale
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

export default connect(mapStateToProps, mapActionsToProps)(InvMenu);
