import React from "react";
import PropTypes from "prop-types";
import { TYPE_AIR, TYPE_SEA, TYPE_LAND, TYPE_SPECIAL } from "../../../constants/gameConstants";

const popupStyle = {
    backgroundColor: "white",
    width: "50%",
    height: "30%",
    top: "25%",
    right: "25%",
    position: "absolute"
};

const titleStyle = {
    textAlign: "center"
};

const buttonStyle = {
    float: "left",
    backgroundColor: "grey",
    margin: "5%",
    padding: "5%"
};

const invisibleStyle = {
    display: "none"
};

const SelectCommanderTypePopup = ({ raiseMoraleSelectCommanderType, gameboardMeta }) => {
    const { raiseMoralePopupActive } = gameboardMeta.planning;

    return (
        <div style={raiseMoralePopupActive ? popupStyle : invisibleStyle}>
            <div style={titleStyle}>Select a commander type to boost.</div>
            <div
                style={buttonStyle}
                onClick={event => {
                    event.preventDefault();
                    raiseMoraleSelectCommanderType(TYPE_AIR);
                    event.stopPropagation();
                }}
            >
                Air
            </div>
            <div
                style={buttonStyle}
                onClick={event => {
                    event.preventDefault();
                    raiseMoraleSelectCommanderType(TYPE_LAND);
                    event.stopPropagation();
                }}
            >
                Land
            </div>
            <div
                style={buttonStyle}
                onClick={event => {
                    event.preventDefault();
                    raiseMoraleSelectCommanderType(TYPE_SEA);
                    event.stopPropagation();
                }}
            >
                Sea
            </div>
            <div
                style={buttonStyle}
                onClick={event => {
                    event.preventDefault();
                    raiseMoraleSelectCommanderType(TYPE_SPECIAL);
                    event.stopPropagation();
                }}
            >
                Special
            </div>
        </div>
    );
};

SelectCommanderTypePopup.propTypes = {
    raiseMoraleSelectCommanderType: PropTypes.func.isRequired, //from parent
    gameboardMeta: PropTypes.object.isRequired //from parent
};

export default SelectCommanderTypePopup;
