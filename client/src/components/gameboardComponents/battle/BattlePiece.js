import React, { Component } from "react";
import PropTypes from "prop-types";
import { TYPE_IMAGES, DICE_IMAGES, ARROW_IMAGE } from "../../styleConstants";
import { TYPE_NAMES } from "../../../constants/gameConstants";

const battlePieceStyle = {
    backgroundColor: "white",
    height: "15%",
    width: "96%",
    margin: "1%",
    padding: "1%",
    borderRadius: "2%"
};

//TODO: could probably refactor how this is called to a cleaner way...
const battlePieceWonStyle = [
    {},
    {
        border: "2px solid red"
    }
];

const boxStyle = {
    backgroundRepeat: "no-repeat",
    backgroundSize: "90% 90%",
    backgroundPosition: "center",
    border: "2px solid black",
    height: "92%",
    width: "23%",
    float: "left",
    margin: ".5%",
    position: "relative"
};

const diceBoxStyle = {
    backgroundRepeat: "no-repeat",
    backgroundSize: "90% 90%",
    backgroundPosition: "center",
    border: "2px solid black",
    height: "40%",
    width: "15%",
    float: "left",
    margin: ".5%",
    position: "relative"
};

const selected = [
    { border: "2px solid red" }, //selected
    { border: "2px solid black" } //not selected
];

class BattlePiece extends Component {
    render() {
        const { isFriendly, battlePieceClick, targetPieceClick, enemyBattlePieceClick, battlePiece, battlePieceIndex, isSelected } = this.props;

        const battlePieceBox = (
            <div
                title={TYPE_NAMES[battlePiece.piece.pieceTypeId]}
                onClick={event => {
                    event.preventDefault();
                    isFriendly ? battlePieceClick(battlePiece, battlePieceIndex) : enemyBattlePieceClick(battlePiece, battlePieceIndex);
                    event.stopPropagation();
                }}
                style={{
                    ...boxStyle,
                    ...TYPE_IMAGES[battlePiece.piece.pieceTypeId],
                    ...selected[isSelected ? 0 : 1]
                }}
            >
                {battlePieceIndex}
            </div>
        );

        const arrowBox = battlePiece.targetPiece == null ? null : <div title={"Attacking"} style={{ ...boxStyle, ...ARROW_IMAGE }} />;

        const targetBox =
            battlePiece.targetPiece == null ? null : (
                <div
                    title={TYPE_NAMES[battlePiece.targetPiece.pieceTypeId]}
                    onClick={event => {
                        event.preventDefault();
                        targetPieceClick(battlePiece, battlePieceIndex);
                        event.stopPropagation();
                    }}
                    style={{ ...boxStyle, ...TYPE_IMAGES[battlePiece.targetPiece.pieceTypeId] }}
                >
                    {battlePiece.targetPieceIndex}
                </div>
            );

        const diceBox1 = battlePiece.diceRoll == null ? null : <div title={battlePiece.diceRoll1} style={{ ...diceBoxStyle, ...DICE_IMAGES[battlePiece.diceRoll1] }} />;

        const diceBox2 = battlePiece.diceRoll == null ? null : <div title={battlePiece.diceRoll2} style={{ ...diceBoxStyle, ...DICE_IMAGES[battlePiece.diceRoll2] }} />;

        return (
            <div style={{ ...battlePieceStyle, ...battlePieceWonStyle[battlePiece.win != null && battlePiece.win ? 1 : 0] }}>
                {battlePieceBox}
                {arrowBox}
                {targetBox}
                {diceBox1}
                {diceBox2}
            </div>
        );
    }
}

BattlePiece.propTypes = {
    isFriendly: PropTypes.bool.isRequired,
    battlePiece: PropTypes.object.isRequired,
    battlePieceIndex: PropTypes.number.isRequired,
    isSelected: PropTypes.bool.isRequired,
    battlePieceClick: PropTypes.func.isRequired,
    enemyBattlePieceClick: PropTypes.func.isRequired,
    targetPieceClick: PropTypes.func.isRequired
};

export default BattlePiece;
