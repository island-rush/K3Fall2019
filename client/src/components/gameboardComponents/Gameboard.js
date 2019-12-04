import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { HexGrid, Layout, Hexagon } from "react-hexgrid";
import BattlePopup from "./battle/BattlePopup";
import NewsPopup from "./NewsPopup";
import ContainerPopup from "./container/ContainerPopup";
import RefuelPopup from "./refuel/RefuelPopup";
import SelectCommanderTypePopup from "./capabilities/SelectCommanderTypePopup";
import Patterns from "./Patterns";
import {
    innerTransportPieceClick,
    outerPieceClick,
    innerPieceClick,
    selectPosition,
    newsPopupMinimizeToggle,
    raiseMoraleSelectCommanderType,
    pieceClose
} from "../../redux/actions";
import { TYPE_HIGH_LOW, REMOTE_SENSING_RANGE, COMM_INTERRUPT_RANGE, GOLDEN_EYE_RANGE, RED_TEAM_ID, BLUE_TEAM_ID } from "../../constants/gameConstants";
import { distanceMatrix } from "../../constants/distanceMatrix";
import {
    IGNORE_TITLE_TYPES,
    ALL_ISLAND_NAMES,
    AIRFIELD_TYPE,
    AIRFIELD_TITLE,
    MISSILE_SILO_TYPE,
    MISSILE_SILO_TITLE,
    ISLAND_POINTS,
    ALL_FLAG_LOCATIONS,
    FLAG_ISLAND_OWNERSHIP
} from "../../constants/gameboardConstants";

const gameboardStyle = {
    backgroundColor: "blue",
    width: "94%",
    height: "88%",
    top: "0%",
    right: "0%",
    position: "absolute"
};

const subDivStyle = {
    height: "100%",
    width: "100%"
};

//These functions organize the hexagons into the proper rows/columns to make the shape of the board (based on the index of the position (0->726))
const qIndexSolver = index => {
    if (index < 81) {
        //above zoombox
        if (index % 27 < 14) {
            //even or odd column
            return Math.floor(index / 27) * 2;
        } else {
            return Math.floor(index / 27) * 2 + 1;
        }
    } else {
        //beyond zoombox
        if ((index - 81) % 34 < 17) {
            return (Math.floor((index - 81) / 34) + 3) * 2;
        } else {
            return (Math.floor((index - 81) / 34) + 3) * 2 + 1;
        }
    }
};

const rIndexSolver = index => {
    if (index < 81) {
        if (index % 27 < 14) {
            return (index % 27) - Math.floor(index / 27);
        } else {
            return (index % 27) - Math.floor(index / 27) - 14;
        }
    } else {
        if ((index - 81) % 34 < 17) {
            return ((index - 81) % 34) - (Math.floor((index - 81) / 34) + 3);
        } else {
            return ((index - 81) % 34) - (Math.floor((index - 81) / 34) + 3) - 17;
        }
    }
};

const patternSolver = (position, gameInfo, positionIndex) => {
    const { type, pieces } = position; //position comes from the gameboard state
    const { highPieces, lowPieces } = TYPE_HIGH_LOW;
    let redHigh = 0,
        redLow = 0,
        blueHigh = 0,
        blueLow = 0;
    if (pieces) {
        for (let x = 0; x < pieces.length; x++) {
            let thisPiece = pieces[x];
            if (thisPiece.pieceTeamId === RED_TEAM_ID && highPieces.includes(thisPiece.pieceTypeId)) {
                redHigh = 1;
            }
            if (thisPiece.pieceTeamId === RED_TEAM_ID && lowPieces.includes(thisPiece.pieceTypeId)) {
                redLow = 1;
            }
            if (thisPiece.pieceTeamId === BLUE_TEAM_ID && highPieces.includes(thisPiece.pieceTypeId)) {
                blueHigh = 1;
            }
            if (thisPiece.pieceTeamId === BLUE_TEAM_ID && lowPieces.includes(thisPiece.pieceTypeId)) {
                blueLow = 1;
            }
        }
    }

    if (ALL_FLAG_LOCATIONS.includes(parseInt(positionIndex))) {
        const flagNum = ALL_FLAG_LOCATIONS.indexOf(parseInt(positionIndex));
        const islandOwner = gameInfo["flag" + flagNum];
        const finalType = islandOwner === BLUE_TEAM_ID ? "blue" : islandOwner === RED_TEAM_ID ? "red" : "flag";
        return finalType + redHigh + redLow + blueHigh + blueLow;
    }

    return type + redHigh + redLow + blueHigh + blueLow; //This resolves what image is shown on the board (see ./images/positionImages)
};

const titleSolver = (position, gameInfo, positionIndex) => {
    const { type } = position;
    //ignore titles for types 'land' and 'water'

    if (IGNORE_TITLE_TYPES.includes(type)) {
        return "";
    }

    if (!ALL_FLAG_LOCATIONS.includes(parseInt(positionIndex))) {
        //No points info, simple titles
        switch (type) {
            case AIRFIELD_TYPE:
                return AIRFIELD_TITLE;
            case MISSILE_SILO_TYPE:
                return MISSILE_SILO_TITLE;
            default:
                return "";
        }
    }

    //need to display island name, and island point value
    const islandNum = FLAG_ISLAND_OWNERSHIP[positionIndex];
    const islandTitle = ALL_ISLAND_NAMES[islandNum];

    return "Island Flag\n" + islandTitle + "\nPoints: " + ISLAND_POINTS[islandNum];
};

class Gameboard extends Component {
    render() {
        const {
            gameInfo,
            gameboard,
            gameboardMeta,
            selectPosition,
            newsPopupMinimizeToggle,
            raiseMoraleSelectCommanderType,
            pieceClose,
            outerPieceClick,
            innerPieceClick,
            innerTransportPieceClick
        } = this.props;

        //prettier-ignore
        const {confirmedGoldenEye, confirmedCommInterrupt, confirmedBioWeapons, confirmedInsurgency, confirmedRods, confirmedRemoteSense, selectedPosition, news, battle, container, planning, selectedPiece, confirmedPlans, highlightedPositions } = gameboardMeta;

        let planningPositions = []; //all of the positions part of a plan
        let containerPositions = []; //specific positions part of a plan of type container
        let battlePositions = []; //position(s) involved in a battle
        let remoteSensedPositions = [];
        let commInterruptPositions = [];
        let goldenEyePositions = [];

        for (let x = 0; x < planning.moves.length; x++) {
            const { type, positionId } = planning.moves[x];

            if (!planningPositions.includes(parseInt(positionId))) {
                planningPositions.push(parseInt(positionId));
            }

            if (type === "container" && !containerPositions.includes(parseInt(positionId))) {
                containerPositions.push(parseInt(positionId));
            }
        }

        if (selectedPiece !== null) {
            if (selectedPiece.pieceId in confirmedPlans) {
                for (let z = 0; z < confirmedPlans[selectedPiece.pieceId].length; z++) {
                    const { type, positionId } = confirmedPlans[selectedPiece.pieceId][z];
                    if (type === "move") {
                        planningPositions.push(parseInt(positionId));
                    }
                    if (type === "container") {
                        containerPositions.push(parseInt(positionId));
                    }
                }
            }
        }

        if (battle.active) {
            if (battle.friendlyPieces.length > 0) {
                let { piecePositionId } = battle.friendlyPieces[0].piece;
                battlePositions.push(parseInt(piecePositionId));
            }
            if (battle.enemyPieces.length > 0) {
                let { piecePositionId } = battle.enemyPieces[0].piece;
                battlePositions.push(parseInt(piecePositionId));
            }
        }

        for (let x = 0; x < confirmedRemoteSense.length; x++) {
            //need the adjacent by 3 radius positions to be highlighted
            let remoteSenseCenter = confirmedRemoteSense[x];
            for (let y = 0; y < distanceMatrix[remoteSenseCenter].length; y++) {
                if (distanceMatrix[remoteSenseCenter][y] <= REMOTE_SENSING_RANGE) {
                    remoteSensedPositions.push(y);
                }
            }
        }

        for (let x = 0; x < confirmedCommInterrupt.length; x++) {
            let commInterruptCenter = confirmedCommInterrupt[x];
            for (let y = 0; y < distanceMatrix[commInterruptCenter].length; y++) {
                if (distanceMatrix[commInterruptCenter][y] <= COMM_INTERRUPT_RANGE) {
                    commInterruptPositions.push(y);
                }
            }
        }

        for (let x = 0; x < confirmedGoldenEye.length; x++) {
            let goldenEyeCenter = confirmedGoldenEye[x];
            for (let y = 0; y < distanceMatrix[goldenEyeCenter].length; y++) {
                if (distanceMatrix[goldenEyeCenter][y] <= GOLDEN_EYE_RANGE) {
                    goldenEyePositions.push(y);
                }
            }
        }

        const positions = Object.keys(gameboard).map(positionIndex => (
            <Hexagon
                key={positionIndex}
                posId={0}
                q={qIndexSolver(positionIndex)}
                r={rIndexSolver(positionIndex)}
                s={-999}
                fill={patternSolver(gameboard[positionIndex], gameInfo, positionIndex)}
                //TODO: change this to always selectPositon(positionindex), instead of sending -1 (more info for the action, let it take care of it)
                onClick={event => {
                    event.preventDefault();
                    if (parseInt(positionIndex) === parseInt(selectedPosition)) {
                        selectPosition(-1);
                    } else {
                        selectPosition(positionIndex);
                    }
                    event.stopPropagation();
                }}
                //These are found in the Game.css
                //TODO: highlight according to some priority list
                className={
                    parseInt(selectedPosition) === parseInt(positionIndex)
                        ? "selectedPos"
                        : containerPositions.includes(parseInt(positionIndex))
                        ? "containerPos"
                        : planningPositions.includes(parseInt(positionIndex))
                        ? "plannedPos"
                        : highlightedPositions.includes(parseInt(positionIndex))
                        ? "highlightedPos"
                        : battlePositions.includes(parseInt(positionIndex))
                        ? "battlePos"
                        : confirmedRods.includes(parseInt(positionIndex))
                        ? "battlePos"
                        : confirmedBioWeapons.includes(parseInt(positionIndex))
                        ? "bioWeaponPos"
                        : confirmedInsurgency.includes(parseInt(positionIndex))
                        ? "battlePos"
                        : remoteSensedPositions.includes(parseInt(positionIndex))
                        ? "remoteSensePos"
                        : commInterruptPositions.includes(parseInt(positionIndex))
                        ? "commInterruptPos"
                        : goldenEyePositions.includes(parseInt(positionIndex))
                        ? "goldenEyePos"
                        : ""
                }
                //TODO: pass down what the highlighting means into the title
                title={titleSolver(gameboard[positionIndex], gameInfo, positionIndex)}
            />
        ));

        return (
            <div style={gameboardStyle}>
                <div style={subDivStyle}>
                    <HexGrid width={"100%"} height={"100%"} viewBox="-50 -50 100 100">
                        <Layout size={{ x: 3.15, y: 3.15 }} flat={true} spacing={1.03} origin={{ x: -98, y: -46 }}>
                            {positions}
                        </Layout>
                        <Patterns />
                    </HexGrid>
                </div>

                {/* TODO: more parent level connect to redux, less children connect, pass down relevant functions from here (try not to mix redux and parent passing) */}
                <NewsPopup news={news} newsPopupMinimizeToggle={newsPopupMinimizeToggle} />
                <BattlePopup battle={battle} />
                <RefuelPopup />
                <SelectCommanderTypePopup gameboardMeta={gameboardMeta} raiseMoraleSelectCommanderType={raiseMoraleSelectCommanderType} />
                <ContainerPopup
                    innerTransportPieceClick={innerTransportPieceClick}
                    innerPieceClick={innerPieceClick}
                    outerPieceClick={outerPieceClick}
                    container={container}
                    pieceClose={pieceClose}
                />
            </div>
        );
    }
}

Gameboard.propTypes = {
    gameboard: PropTypes.array.isRequired,
    gameboardMeta: PropTypes.object.isRequired,
    selectPosition: PropTypes.func.isRequired,
    newsPopupMinimizeToggle: PropTypes.func.isRequired,
    raiseMoraleSelectCommanderType: PropTypes.func.isRequired,
    gameInfo: PropTypes.object.isRequired,
    pieceClose: PropTypes.func.isRequired,
    outerPieceClick: PropTypes.func.isRequired,
    innerPieceClick: PropTypes.func.isRequired,
    innerTransportPieceClick: PropTypes.func.isRequired
};

const mapStateToProps = ({ gameboard, gameboardMeta, gameInfo }) => ({
    gameboard,
    gameboardMeta,
    gameInfo
});

const mapActionsToProps = {
    selectPosition,
    newsPopupMinimizeToggle,
    raiseMoraleSelectCommanderType,
    pieceClose,
    outerPieceClick,
    innerPieceClick,
    innerTransportPieceClick
};

export default connect(mapStateToProps, mapActionsToProps)(Gameboard);
