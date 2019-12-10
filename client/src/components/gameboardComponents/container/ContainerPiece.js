import React from "react";
import PropTypes from "prop-types";
import { TYPE_NAMES } from "../../../constants/gameConstants";
import { TYPE_IMAGES, TYPE_TEAM_BORDERS } from "../../styleConstants";

const containerPieceStyle = {
    backgroundRepeat: "no-repeat",
    backgroundSize: "90% 90%",
    backgroundPosition: "center",
    border: "2px solid black",
    height: "15%",
    width: "15%",
    float: "left",
    margin: ".5%",
    position: "relative"
};

function ContainerPiece({ piece, container, clickFunction }) {
    return (
        <div
            style={{ ...containerPieceStyle, ...TYPE_IMAGES[piece.pieceTypeId], ...TYPE_TEAM_BORDERS[piece.pieceTeamId] }}
            onClick={event => {
                event.preventDefault();
                clickFunction(piece, container.containerPiece);
                event.stopPropagation();
            }}
            title={TYPE_NAMES[piece.pieceTypeId]}
        />
    );
}

ContainerPiece.propTypes = {
    piece: PropTypes.object.isRequired,
    container: PropTypes.object.isRequired,
    clickFunction: PropTypes.func.isRequired
};

export default ContainerPiece;
