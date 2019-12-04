//TODO: make this file less thiccc, it's getting pretty hefty (maybe use more reducers to keep it clean....)
import {
    POSITION_SELECT,
    PIECE_CLICK,
    PIECE_CLEAR_SELECTION,
    START_PLAN,
    CANCEL_PLAN,
    PLANNING_SELECT,
    PLAN_WAS_CONFIRMED,
    DELETE_PLAN,
    UNDO_MOVE,
    CONTAINER_MOVE,
    INITIAL_GAMESTATE,
    SLICE_CHANGE,
    PURCHASE_PHASE,
    NEWS_PHASE,
    BATTLE_PIECE_SELECT,
    ENEMY_PIECE_SELECT,
    BATTLEPOPUP_MINIMIZE_TOGGLE,
    TARGET_PIECE_SELECT,
    EVENT_BATTLE,
    BATTLE_FIGHT_RESULTS,
    NO_MORE_EVENTS,
    EVENT_REFUEL,
    CLEAR_BATTLE,
    MENU_SELECT,
    HIGHLIGHT_POSITIONS,
    TANKER_CLICK,
    AIRCRAFT_CLICK,
    UNDO_FUEL_SELECTION,
    REFUEL_RESULTS,
    NEWSPOPUP_MINIMIZE_TOGGLE,
    REFUELPOPUP_MINIMIZE_TOGGLE,
    RODS_FROM_GOD_SELECTING,
    RODS_FROM_GOD_SELECTED,
    NEW_ROUND,
    REMOTE_SENSING_SELECTING,
    REMOTE_SENSING_SELECTED,
    PLACE_PHASE,
    INSURGENCY_SELECTED,
    INSURGENCY_SELECTING,
    BIO_WEAPON_SELECTED,
    BIO_WEAPON_SELECTING,
    RAISE_MORALE_SELECTED,
    RAISE_MORALE_SELECTING,
    COMM_INTERRUP_SELECTED,
    COMM_INTERRUPT_SELECTING,
    GOLDEN_EYE_SELECTING,
    GOLDEN_EYE_SELECTED,
    PIECE_OPEN_ACTION,
    PIECE_CLOSE_ACTION,
    OUTER_PIECE_CLICK_ACTION,
    INNER_PIECE_CLICK_ACTION,
    INNER_TRANSPORT_PIECE_CLICK_ACTION
} from "../actions/actionTypes";
import { distanceMatrix } from "../../constants/distanceMatrix";
import { initialGameboardEmpty } from "./initialGameboardEmpty";

import { TYPE_FUEL, TRANSPORT_TYPE_ID } from "../../constants/gameConstants";
import { LAND_TYPE } from "../../constants/gameboardConstants";

const initialGameboardMeta = {
    //TODO: change to selectedPositionId and selectedPieceId to better represent the values (ints) (and also selectedBattlePiece -> selectedBattlePieceId)
    selectedPosition: -1,
    highlightedPositions: [],
    selectedPiece: null,
    selectedMenuId: 0, //TODO: should probably 0 index this instead of 1 index (make -1 == no menu open)
    news: {
        isMinimized: false,
        active: false,
        newsTitle: "Loading Title...",
        newsInfo: "Loading Info..."
    },
    battle: {
        isMinimized: false,
        active: false,
        selectedBattlePiece: -1,
        selectedBattlePieceIndex: -1, //helper to find the piece within the array
        masterRecord: null,
        friendlyPieces: [],
        enemyPieces: []
    },
    refuel: {
        isMinimized: false,
        active: false,
        selectedTankerPieceId: -1,
        selectedTankerPieceIndex: -1,
        tankers: [],
        aircraft: []
    },
    container: {
        active: false,
        isSelectingHex: false,
        innerPieceToDrop: null,
        containerPiece: null,
        outerPieces: []
    },
    planning: {
        active: false,
        capability: false,
        raiseMoralePopupActive: false,
        invItem: null,
        moves: []
    },
    confirmedPlans: {},
    confirmedRods: [],
    confirmedRemoteSense: [],
    confirmedInsurgency: [],
    confirmedBioWeapons: [],
    confirmedRaiseMorale: [],
    confirmedCommInterrupt: [],
    confirmedGoldenEye: []
};

function gameboardMetaReducer(state = initialGameboardMeta, { type, payload }) {
    let stateDeepCopy = JSON.parse(JSON.stringify(state));

    switch (type) {
        case HIGHLIGHT_POSITIONS:
            stateDeepCopy.highlightedPositions = payload.highlightedPositions;
            break;
        case MENU_SELECT:
            stateDeepCopy.selectedMenuId = payload.selectedMenuId !== stateDeepCopy.selectedMenuId ? payload.selectedMenuId : 0;
            break;
        case NEW_ROUND:
            stateDeepCopy.confirmedRods = [];
            stateDeepCopy.confirmedInsurgency = [];
            stateDeepCopy.confirmedRemoteSense = payload.confirmedRemoteSense;
            stateDeepCopy.confirmedGoldenEye = payload.confirmedGoldenEye;
            stateDeepCopy.confirmedBioWeapons = payload.confirmedBioWeapons;
            stateDeepCopy.confirmedCommInterrupt = payload.confirmedCommInterrupt;
            break;
        case PLACE_PHASE:
            stateDeepCopy.confirmedRemoteSense = payload.confirmedRemoteSense;
            stateDeepCopy.confirmedGoldenEye = payload.confirmedGoldenEye;
            stateDeepCopy.confirmedBioWeapons = payload.confirmedBioWeapons;
            stateDeepCopy.confirmedCommInterrupt = payload.confirmedCommInterrupt;
            break;
        case POSITION_SELECT:
            stateDeepCopy.selectedPosition = parseInt(payload.selectedPositionId);
            // stateDeepCopy.highlightedPositions = [];
            break;
        case PURCHASE_PHASE:
            stateDeepCopy.news.active = false; //hide the popup
            break;
        case TANKER_CLICK:
            //select if different, unselect if was the same
            let lastSelectedTankerId = stateDeepCopy.refuel.selectedTankerPieceId;
            stateDeepCopy.refuel.selectedTankerPieceId = payload.tankerPiece.pieceId === lastSelectedTankerId ? -1 : payload.tankerPiece.pieceId;
            stateDeepCopy.refuel.selectedTankerPieceIndex = payload.tankerPiece.pieceId === lastSelectedTankerId ? -1 : payload.tankerPieceIndex;
            break;
        case PIECE_OPEN_ACTION:
            stateDeepCopy.container.active = true;
            stateDeepCopy.container.containerPiece = payload.selectedPiece;
            let selectedPiecePosition = payload.selectedPiece.piecePositionId;
            let selectedPieceTypeId = payload.selectedPiece.pieceTypeId;

            //outerPieces is dependent on selectedPieceTypeId (surrounding land if transport...)
            //TODO: this can be cleaned up with modern for.each syntact -> for (let x of y)? something like that (it was used somewhere else so search for it)
            if (selectedPieceTypeId === TRANSPORT_TYPE_ID) {
                for (let x = 0; x < distanceMatrix[selectedPiecePosition].length; x++) {
                    //TODO: do we need a constant for '1'? transports can only pick up pieces from 1 hex away seems obvious
                    if (distanceMatrix[selectedPiecePosition][x] <= 1 && initialGameboardEmpty[x].type === LAND_TYPE) {
                        //TODO: better way of combining arrays (no internet while i'm coding this mid-flight)
                        for (let y = 0; y < payload.gameboard[x].pieces.length; y++) {
                            //TODO: only put pieces here if they are able to get onto transport pieces
                            if (payload.gameboard[x].pieces[y].pieceId === payload.selectedPiece.pieceId) continue;
                            stateDeepCopy.container.outerPieces.push(payload.gameboard[x].pieces[y]);
                        }
                    }
                }

                //now for each of those positions...
            } else {
                //other container types only look in their own position (probably...//TODO: write down the rules for this later )

                stateDeepCopy.container.outerPieces = payload.gameboard[selectedPiecePosition].pieces.filter((piece, index) => {
                    return piece.pieceId !== payload.selectedPiece.pieceId;
                });
            }
            break;
        case PIECE_CLOSE_ACTION:
            stateDeepCopy.container.active = false;
            stateDeepCopy.container.containerPiece = null;
            stateDeepCopy.container.outerPieces = [];
            stateDeepCopy.container.isSelectingHex = false;
            stateDeepCopy.container.innerPieceToDrop = null;
            break;
        case INNER_TRANSPORT_PIECE_CLICK_ACTION:
            stateDeepCopy.container.isSelectingHex = true;
            stateDeepCopy.container.innerPieceToDrop = payload.selectedPiece;
            break;
        case OUTER_PIECE_CLICK_ACTION:
            //need the piece to go inside the container
            //remove from outerpieces
            //add to innerpieces
            stateDeepCopy.container.outerPieces = stateDeepCopy.container.outerPieces.filter((piece, index) => {
                return piece.pieceId !== payload.selectedPiece.pieceId;
            });
            stateDeepCopy.container.containerPiece.pieceContents.pieces.push(payload.selectedPiece);
            break;
        case INNER_PIECE_CLICK_ACTION:
            //need the piece to go outside the container
            //remove from the container piece
            //add to the outer pieces
            stateDeepCopy.container.isSelectingHex = false;
            stateDeepCopy.container.innerPieceToDrop = null;
            stateDeepCopy.container.containerPiece.pieceContents.pieces = stateDeepCopy.container.containerPiece.pieceContents.pieces.filter((piece, index) => {
                return piece.pieceId !== payload.selectedPiece.pieceId;
            });
            stateDeepCopy.container.outerPieces.push(payload.selectedPiece);
            break;
        case AIRCRAFT_CLICK:
            //show which tanker is giving the aircraft...
            let { aircraftPieceIndex, aircraftPiece } = payload;
            const { selectedTankerPieceId, selectedTankerPieceIndex } = stateDeepCopy.refuel;

            stateDeepCopy.refuel.aircraft[aircraftPieceIndex].tankerPieceId = selectedTankerPieceId;
            stateDeepCopy.refuel.aircraft[aircraftPieceIndex].tankerPieceIndex = selectedTankerPieceIndex;

            //need how much fuel is getting removed
            const fuelToRemove = TYPE_FUEL[aircraftPiece.pieceTypeId] - aircraftPiece.pieceFuel;

            if (!stateDeepCopy.refuel.tankers[selectedTankerPieceIndex].removedFuel) {
                stateDeepCopy.refuel.tankers[selectedTankerPieceIndex].removedFuel = 0;
            }
            stateDeepCopy.refuel.tankers[selectedTankerPieceIndex].removedFuel += fuelToRemove;

            break;
        case UNDO_FUEL_SELECTION:
            //TODO: needs some good refactoring
            // let airPiece = payload.aircraftPiece;
            let airPieceIndex = payload.aircraftPieceIndex;
            let tankerPieceIndex2 = stateDeepCopy.refuel.aircraft[airPieceIndex].tankerPieceIndex;

            let pieceType = stateDeepCopy.refuel.aircraft[airPieceIndex].pieceTypeId;
            let fuelThatWasGoingToGetAdded = TYPE_FUEL[pieceType] - stateDeepCopy.refuel.aircraft[airPieceIndex].pieceFuel;

            stateDeepCopy.refuel.aircraft[airPieceIndex].tankerPieceId = null;
            stateDeepCopy.refuel.aircraft[airPieceIndex].tankerPieceIndex = null;
            stateDeepCopy.refuel.tankers[tankerPieceIndex2].removedFuel -= fuelThatWasGoingToGetAdded;
            break;
        case REFUEL_RESULTS:
            stateDeepCopy.refuel = initialGameboardMeta.refuel;
            break;
        case NEWS_PHASE:
            stateDeepCopy.news = payload.news;
            break;
        case PIECE_CLICK:
            stateDeepCopy.selectedPiece = payload.selectedPiece;
            break;
        case PIECE_CLEAR_SELECTION:
            stateDeepCopy.selectedPiece = null;
            break;
        case START_PLAN:
            stateDeepCopy.planning.active = true;
            break;

        case RAISE_MORALE_SELECTING:
            stateDeepCopy.planning.active = true;
            stateDeepCopy.planning.capability = true;
            stateDeepCopy.planning.invItem = payload.invItem;
            stateDeepCopy.planning.raiseMoralePopupActive = true;
            stateDeepCopy.selectedMenuId = 0;
            break;
        case RAISE_MORALE_SELECTED:
            stateDeepCopy.planning.capability = false;
            stateDeepCopy.planning.invItem = null;
            stateDeepCopy.planning.active = false;
            stateDeepCopy.planning.raiseMoralePopupActive = false;

            stateDeepCopy.confirmedRaiseMorale = payload.confirmedRaiseMorale;
            break;
        case INSURGENCY_SELECTING:
        case BIO_WEAPON_SELECTING:
        case COMM_INTERRUPT_SELECTING:
        case RODS_FROM_GOD_SELECTING:
        case GOLDEN_EYE_SELECTING:
        case REMOTE_SENSING_SELECTING:
            stateDeepCopy.planning.active = true;
            stateDeepCopy.planning.capability = true;
            stateDeepCopy.planning.invItem = payload.invItem;
            stateDeepCopy.selectedMenuId = 0;
            break;
        case RODS_FROM_GOD_SELECTED:
            stateDeepCopy.planning.capability = false;
            stateDeepCopy.planning.invItem = null;
            stateDeepCopy.planning.active = false;

            stateDeepCopy.confirmedRods.push(parseInt(payload.selectedPositionId));
            break;
        case BIO_WEAPON_SELECTED:
            stateDeepCopy.planning.capability = false;
            stateDeepCopy.planning.invItem = null;
            stateDeepCopy.planning.active = false;

            stateDeepCopy.confirmedBioWeapons.push(parseInt(payload.selectedPositionId));
            break;
        case COMM_INTERRUP_SELECTED:
            stateDeepCopy.planning.capability = false;
            stateDeepCopy.planning.invItem = null;
            stateDeepCopy.planning.active = false;

            stateDeepCopy.confirmedCommInterrupt = payload.confirmedCommInterrupt;
            break;
        case INSURGENCY_SELECTED:
            stateDeepCopy.planning.capability = false;
            stateDeepCopy.planning.invItem = null;
            stateDeepCopy.planning.active = false;

            stateDeepCopy.confirmedInsurgency.push(parseInt(payload.selectedPositionId));
            break;

        case REMOTE_SENSING_SELECTED:
            stateDeepCopy.planning.capability = false;
            stateDeepCopy.planning.invItem = null;
            stateDeepCopy.planning.active = false;
            stateDeepCopy.confirmedRemoteSense = payload.confirmedRemoteSense;
            break;
        case GOLDEN_EYE_SELECTED:
            stateDeepCopy.planning.capability = false;
            stateDeepCopy.planning.invItem = null;
            stateDeepCopy.planning.active = false;
            stateDeepCopy.confirmedGoldenEye.push(parseInt(payload.selectedPositionId));
            break;
        case CANCEL_PLAN:
            stateDeepCopy.planning.active = false;
            stateDeepCopy.planning.capability = false;
            stateDeepCopy.planning.moves = [];
            stateDeepCopy.selectedPiece = null;
            break;
        case UNDO_MOVE:
            stateDeepCopy.planning.moves.pop();
            break;
        case CONTAINER_MOVE:
            stateDeepCopy.planning.moves.push({
                type: "container",
                positionId: payload.selectedPositionId
            });
            break;
        case PLANNING_SELECT:
            //TODO: move this to userActions to have more checks there within the thunk
            stateDeepCopy.planning.moves.push({
                type: "move",
                positionId: payload.selectedPositionId
            });
            break;
        case PLAN_WAS_CONFIRMED:
            const { pieceId, plan } = payload;
            stateDeepCopy.confirmedPlans[pieceId] = plan;
            stateDeepCopy.planning.active = false;
            stateDeepCopy.planning.moves = [];
            stateDeepCopy.selectedPiece = null;
            break;
        case DELETE_PLAN:
            delete stateDeepCopy.confirmedPlans[payload.pieceId];
            stateDeepCopy.selectedPiece = null;
            break;
        case EVENT_REFUEL:
            stateDeepCopy.confirmedRods = [];
            stateDeepCopy.confirmedInsurgency = [];
            stateDeepCopy.refuel.active = true;
            stateDeepCopy.refuel.tankers = payload.tankers;
            stateDeepCopy.refuel.aircraft = payload.aircraft;
            stateDeepCopy.refuel.selectedTankerPiece = -1;
            stateDeepCopy.refuel.selectedTankerPieceIndex = -1;
            break;
        case REFUELPOPUP_MINIMIZE_TOGGLE:
            stateDeepCopy.refuel.isMinimized = !stateDeepCopy.refuel.isMinimized;
            break;
        case INITIAL_GAMESTATE:
            Object.assign(stateDeepCopy, payload.gameboardMeta);
            break;
        case NEWSPOPUP_MINIMIZE_TOGGLE:
            stateDeepCopy.news.isMinimized = !stateDeepCopy.news.isMinimized;
            break;
        case SLICE_CHANGE:
            stateDeepCopy.confirmedPlans = {};
            stateDeepCopy.confirmedRods = payload.confirmedRods;
            stateDeepCopy.confirmedBioWeapons = payload.confirmedBioWeapons;
            stateDeepCopy.confirmedCommInterrupt = payload.confirmedCommInterrupt;
            stateDeepCopy.confirmedInsurgency = payload.confirmedInsurgencyPos;
            stateDeepCopy.confirmedGoldenEye = payload.confirmedGoldenEye;
            break;
        case BATTLE_PIECE_SELECT:
            //select if different, unselect if was the same
            let lastSelectedBattlePiece = stateDeepCopy.battle.selectedBattlePiece;
            stateDeepCopy.battle.selectedBattlePiece = payload.battlePiece.piece.pieceId === lastSelectedBattlePiece ? -1 : payload.battlePiece.piece.pieceId;
            stateDeepCopy.battle.selectedBattlePieceIndex = payload.battlePiece.piece.pieceId === lastSelectedBattlePiece ? -1 : payload.battlePieceIndex;
            break;
        case BATTLEPOPUP_MINIMIZE_TOGGLE:
            stateDeepCopy.battle.isMinimized = !stateDeepCopy.battle.isMinimized;
            break;
        case ENEMY_PIECE_SELECT:
            //need to get the piece that was selected, and put it into the target for the thing
            stateDeepCopy.battle.friendlyPieces[stateDeepCopy.battle.selectedBattlePieceIndex].targetPiece = payload.battlePiece.piece;
            stateDeepCopy.battle.friendlyPieces[stateDeepCopy.battle.selectedBattlePieceIndex].targetPieceIndex = payload.battlePieceIndex;

            break;
        case TARGET_PIECE_SELECT:
            //removing the target piece
            stateDeepCopy.battle.friendlyPieces[payload.battlePieceIndex].targetPiece = null;
            stateDeepCopy.battle.friendlyPieces[payload.battlePieceIndex].targetPieceIndex = -1;
            break;
        case EVENT_BATTLE:
            stateDeepCopy.confirmedRods = [];
            stateDeepCopy.confirmedInsurgency = [];
            stateDeepCopy.battle = initialGameboardMeta.battle;
            stateDeepCopy.battle.active = true;
            stateDeepCopy.battle.friendlyPieces = payload.friendlyPieces;
            stateDeepCopy.battle.enemyPieces = payload.enemyPieces;
            break;
        case NO_MORE_EVENTS:
            stateDeepCopy.confirmedRods = [];
            stateDeepCopy.confirmedInsurgency = [];

            // stateDeepCopy = initialGameboardMeta; //gets rid of selected position/piece if there was one...
            // stateDeepCopy.battle = initialGameboardMeta.battle;
            // stateDeepCopy.refuel = initialGameboardMeta.refuel;  //these don't seem to work
            // stateDeepCopy.container = initialGameboardMeta.container;
            stateDeepCopy.battle = {
                isMinimized: false,
                active: false,
                selectedBattlePiece: -1,
                selectedBattlePieceIndex: -1, //helper to find the piece within the array
                masterRecord: null,
                friendlyPieces: [],
                enemyPieces: []
            };
            stateDeepCopy.refuel = {
                isMinimized: false,
                active: false,
                selectedTankerPieceId: -1,
                selectedTankerPieceIndex: -1,
                tankers: [],
                aircraft: []
            };
            // stateDeepCopy.container = initialGameboardMeta.container;
            break;
        case BATTLE_FIGHT_RESULTS:
            stateDeepCopy.battle.masterRecord = payload.masterRecord;

            //now need more stuff handled for things...
            for (let x = 0; x < stateDeepCopy.battle.friendlyPieces.length; x++) {
                //already knew the targets...
                //which ones win or not gets handled

                let currentRecord = payload.masterRecord.find((record, index) => {
                    return record.pieceId === stateDeepCopy.battle.friendlyPieces[x].piece.pieceId;
                });

                let { targetId, diceRoll, win, diceRoll1, diceRoll2 } = currentRecord;

                if (targetId) {
                    stateDeepCopy.battle.friendlyPieces[x].diceRoll = diceRoll;
                    stateDeepCopy.battle.friendlyPieces[x].win = win;
                    stateDeepCopy.battle.friendlyPieces[x].diceRoll1 = diceRoll1;
                    stateDeepCopy.battle.friendlyPieces[x].diceRoll2 = diceRoll2;
                }
            }

            for (let z = 0; z < stateDeepCopy.battle.enemyPieces.length; z++) {
                //for each enemy piece that know (from battle.enemyPieces)
                //add their target/dice information?

                //every piece should have a record from the battle, even if it didn't do anything... (things will be null...(reference Event.js))
                let currentRecord = payload.masterRecord.find((record, index) => {
                    return record.pieceId === stateDeepCopy.battle.enemyPieces[z].piece.pieceId;
                });

                let { pieceId, targetId, diceRoll, win, diceRoll1, diceRoll2 } = currentRecord;

                if (targetId) {
                    //get the target information from the friendlyPieces
                    //TODO: could refactor this to be better, lots of lookups probably not good
                    let friendlyPieceIndex = stateDeepCopy.battle.friendlyPieces.findIndex(friendlyBattlePiece => friendlyBattlePiece.piece.pieceId === targetId);
                    let friendlyPiece = stateDeepCopy.battle.friendlyPieces[friendlyPieceIndex];
                    let enemyPieceIndex = stateDeepCopy.battle.enemyPieces.findIndex(enemyBattlePiece => enemyBattlePiece.piece.pieceId === pieceId);
                    stateDeepCopy.battle.enemyPieces[enemyPieceIndex].targetPiece = friendlyPiece.piece;
                    stateDeepCopy.battle.enemyPieces[enemyPieceIndex].targetPieceIndex = friendlyPieceIndex;
                    stateDeepCopy.battle.enemyPieces[enemyPieceIndex].win = win;
                    stateDeepCopy.battle.enemyPieces[enemyPieceIndex].diceRoll = diceRoll;
                    stateDeepCopy.battle.enemyPieces[enemyPieceIndex].diceRoll1 = diceRoll1;
                    stateDeepCopy.battle.enemyPieces[enemyPieceIndex].diceRoll2 = diceRoll2;
                }
            }

            break;
        case CLEAR_BATTLE:
            //probably a more efficient way of removing elements from the master record/friendlyPieces/enemyPieces
            for (let z = 0; z < stateDeepCopy.battle.masterRecord.length; z++) {
                let thisRecord = stateDeepCopy.battle.masterRecord[z];
                if (thisRecord.targetId && thisRecord.win) {
                    //need to delete that targetId from friendlyList or enemyList
                    stateDeepCopy.battle.friendlyPieces = stateDeepCopy.battle.friendlyPieces.filter(battlePiece => {
                        return battlePiece.piece.pieceId !== thisRecord.targetId;
                    });
                    stateDeepCopy.battle.enemyPieces = stateDeepCopy.battle.enemyPieces.filter(battlePiece => {
                        return battlePiece.piece.pieceId !== thisRecord.targetId;
                    });
                }
            }

            for (let x = 0; x < stateDeepCopy.battle.friendlyPieces.length; x++) {
                //for each friendly piece, clear the dice roll and other stuff
                stateDeepCopy.battle.friendlyPieces[x].targetPiece = null;
                stateDeepCopy.battle.friendlyPieces[x].targetPieceIndex = -1;
                delete stateDeepCopy.battle.friendlyPieces[x].diceRoll;
                delete stateDeepCopy.battle.friendlyPieces[x].win;
            }
            for (let x = 0; x < stateDeepCopy.battle.enemyPieces.length; x++) {
                //for each friendly piece, clear the dice roll and other stuff
                stateDeepCopy.battle.enemyPieces[x].targetPiece = null;
                stateDeepCopy.battle.enemyPieces[x].targetPieceIndex = -1;
                delete stateDeepCopy.battle.enemyPieces[x].diceRoll;
                delete stateDeepCopy.battle.enemyPieces[x].win;
            }

            delete stateDeepCopy.battle.masterRecord;

            break;
        default:
            return state;
    }

    return stateDeepCopy;
}

export default gameboardMetaReducer;
