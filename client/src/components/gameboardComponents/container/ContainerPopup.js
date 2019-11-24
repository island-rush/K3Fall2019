import React, { Component } from "react";
import PropTypes from "prop-types";

const containerPopupStyle = {
    position: "absolute",
    display: "block",
    width: "80%",
    height: "80%",
    top: "10%",
    right: "10%",
    backgroundColor: "white",
    border: "2px solid black",
    zIndex: 4
};

const leftSectionStyle = {
    position: "relative",
    overflow: "scroll",
    float: "left",
    backgroundColor: "grey",
    height: "96%",
    width: "48%",
    margin: "1%"
};

const rightSectionStyle = {
    position: "relative",
    overflow: "scroll",
    backgroundColor: "grey",
    height: "96%",
    width: "48%",
    float: "right",
    margin: "1%"
};

const confirmButtonStyle = {
    position: "absolute",
    display: "block",
    width: "7%",
    height: "12%",
    top: "0%",
    left: "-8%",
    backgroundColor: "white",
    border: "2px solid black",
    zIndex: 4,
    backgroundSize: "100% 100%",
    backgroundRepeat: "no-repeat"
};

const invisibleStyle = {
    display: "none"
};

class ContainerPopup extends Component {
    render() {
        const { container, pieceClose, outerPieceClick, innerPieceClick } = this.props;

        const outsidePieces = container.outerPieces.map((piece, index) => (
            <div
                key={index}
                onClick={event => {
                    event.preventDefault();
                    outerPieceClick(piece, container.containerPiece);
                    event.stopPropagation();
                }}
            >
                Outer Piece
            </div>
        ));
        const innerPieces =
            container.containerPiece === null
                ? null
                : container.containerPiece.pieceContents.pieces.map((piece, index) => (
                      <div
                          key={index}
                          onClick={event => {
                              event.preventDefault();
                              innerPieceClick(piece, container.containerPiece);
                              event.stopPropagation();
                          }}
                      >
                          Inner Piece
                      </div>
                  ));

        return (
            <div style={container.active ? containerPopupStyle : invisibleStyle}>
                <div style={leftSectionStyle}>Outside Pieces{outsidePieces}</div>
                <div style={rightSectionStyle}>Inner Pieces{innerPieces}</div>
                <div
                    onClick={event => {
                        event.preventDefault();
                        pieceClose();
                        event.stopPropagation();
                    }}
                    style={confirmButtonStyle}
                />
            </div>
        );
    }
}

ContainerPopup.propTypes = {
    container: PropTypes.object.isRequired, //from the gameboardMeta (parent Gameboard gives this)
    pieceClose: PropTypes.func.isRequired,
    outerPieceClick: PropTypes.func.isRequired,
    innerPieceClick: PropTypes.func.isRequired
};

export default ContainerPopup;
