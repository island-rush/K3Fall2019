const { Game, Piece } = require("../../classes");
const sendUserFeedback = require("../sendUserFeedback");
import { OUTER_PIECE_CLICK_ACTION } from "../../../client/src/redux/actions/actionTypes";
import { SOCKET_SERVER_SENDING_ACTION, SOCKET_SERVER_REDIRECT } from "../../../client/src/constants/otherConstants";
import { GAME_INACTIVE_TAG } from "../../pages/errorTypes";
import {
    TYPE_MAIN,
    COMBAT_PHASE_ID,
    SLICE_PLANNING_ID,
    CONTAINER_TYPES,
    TACTICAL_AIRLIFT_SQUADRON_TYPE_ID,
    TRANSPORT_TYPE_ID,
    C_130_TYPE_ID,
    A_C_CARRIER_TYPE_ID,
    SOF_TEAM_TYPE_ID,
    MARINE_INFANTRY_COMPANY_TYPE_ID,
    ARMY_INFANTRY_COMPANY_TYPE_ID,
    TANK_COMPANY_TYPE_ID,
    LIGHT_INFANTRY_VEHICLE_CONVOY_TYPE_ID,
    ARTILLERY_BATTERY_TYPE_ID,
    SAM_SITE_TYPE_ID,
    ATTACK_HELICOPTER_TYPE_ID,
    STEALTH_FIGHTER_TYPE_ID
} from "../../../client/src/constants/gameConstants";
import { initialGameboardEmpty } from "../../../client/src/redux/reducers/initialGameboardEmpty";
import { AIRFIELD_TYPE, ALL_GROUND_TYPES } from "../../../client/src/constants/gameboardConstants";
import { distanceMatrix } from "../../../client/src/constants/distanceMatrix";

const enterContainer = async (socket, payload) => {
    const { gameId, gameTeam, gameControllers } = socket.handshake.session.ir3;
    const { selectedPiece, containerPiece } = payload;

    const thisGame = await new Game({ gameId }).init();
    const { gameActive, gamePhase, gameSlice } = thisGame;

    if (!gameActive) {
        socket.emit(SOCKET_SERVER_REDIRECT, GAME_INACTIVE_TAG);
        return;
    }

    //TODO: rename TYPE_MAIN into COCOM_TYPE_ID probably, that way rulebook is more reflected in the code...
    if (!gameControllers.includes(TYPE_MAIN)) {
        sendUserFeedback(socket, "Not the right controller type for this action...");
        return;
    }

    if (gamePhase != COMBAT_PHASE_ID || gameSlice != SLICE_PLANNING_ID) {
        sendUserFeedback(socket, "Not the right phase/slice for container entering.");
        return;
    }

    const thisSelectedPiece = await new Piece(selectedPiece.pieceId).init();
    const thisContainerPiece = await new Piece(containerPiece.pieceId).init();

    if (!thisSelectedPiece) {
        sendUserFeedback(socket, "Selected Piece did not exists...refresh page probably");
        return;
    }

    if (!thisContainerPiece) {
        sendUserFeedback(socket, "Selected Container piece did not exist...");
        return;
    }

    if (!CONTAINER_TYPES.includes(thisContainerPiece.pieceTypeId)) {
        console.log(thisContainerPiece);
        sendUserFeedback(socket, "Selected Container piece was not a container type");
        return;
    }

    if (thisContainerPiece.pieceTypeId !== TRANSPORT_TYPE_ID && thisContainerPiece.piecePositionId !== thisSelectedPiece.piecePositionId) {
        sendUserFeedback(socket, "Selected piece must be in same position as container piece.");
        return;
    }

    //Check the possible combinations allowed within the container piece
    //TODO: refactor how we check current combinations / if putting the piece is allowed with set combinations (probably a cleaner way of doing it (likely with more constants))
    const piecesInside = await thisContainerPiece.getPiecesInside();

    let typesInsideContainer = [];
    for (let piece of piecesInside) {
        typesInsideContainer.push(piece.pieceTypeId);
    }

    //Different containers have different rules
    const containerType = thisContainerPiece.pieceTypeId;
    switch (containerType) {
        case TACTICAL_AIRLIFT_SQUADRON_TYPE_ID:
            //TacticalAirLift = 1 marine infantry OR 1 army infantry
            if (![MARINE_INFANTRY_COMPANY_TYPE_ID, ARMY_INFANTRY_COMPANY_TYPE_ID].includes(selectedPiece.pieceTypeId)) {
                sendUserFeedback(socket, "Must be a marine or army to enter tactical airlift.");
                return;
            }
            if (typesInsideContainer.length !== 0) {
                sendUserFeedback(socket, "This tactical airlift is already full.");
                return;
            }

            //also need to make sure we are on an airfield spot
            //TODO: make sure we are 'landed' (same as the C130...)
            if (initialGameboardEmpty[thisContainerPiece.piecePositionId].type !== AIRFIELD_TYPE) {
                sendUserFeedback(socket, "Must be on an airfield spot to transfer troops into tactical airlift.");
                return;
            }
            break;
        case TRANSPORT_TYPE_ID:
            if (distanceMatrix[thisContainerPiece.piecePositionId][thisSelectedPiece.piecePositionId] !== 1) {
                sendUserFeedback(socket, "Selected piece must be 1 hex away from transport piece to enter it.");
                return;
            }

            //could do more checks (is selected piece coming from land) but these are already checked before the piece got there...so would be redundant? we can start assuming things are where they should be (for the most part)

            //Transport = "max of 3 infantry, or 2 infantry and 1 vehicle unit (tank, convoy, artillery, SAM, or helicopter)"
            if (
                ![
                    MARINE_INFANTRY_COMPANY_TYPE_ID,
                    ARMY_INFANTRY_COMPANY_TYPE_ID,
                    TANK_COMPANY_TYPE_ID,
                    LIGHT_INFANTRY_VEHICLE_CONVOY_TYPE_ID,
                    ARTILLERY_BATTERY_TYPE_ID,
                    SAM_SITE_TYPE_ID,
                    ATTACK_HELICOPTER_TYPE_ID
                ].includes(thisSelectedPiece.pieceTypeId)
            ) {
                sendUserFeedback(socket, "That piece type is not allowed inside of a transport piece.");
                return;
            }

            //TODO: use a constant? (use constants for a lot of this)
            if (typesInsideContainer.length >= 3) {
                sendUserFeedback(socket, "This transport piece is already filled to the max with other pieces.");
                return;
            }

            if (![MARINE_INFANTRY_COMPANY_TYPE_ID, ARMY_INFANTRY_COMPANY_TYPE_ID].includes(thisSelectedPiece.pieceTypeId)) {
                //check that there only people
                if (
                    typesInsideContainer.includes(TANK_COMPANY_TYPE_ID) ||
                    typesInsideContainer.includes(LIGHT_INFANTRY_VEHICLE_CONVOY_TYPE_ID) ||
                    typesInsideContainer.includes(ARTILLERY_BATTERY_TYPE_ID) ||
                    typesInsideContainer.includes(SAM_SITE_TYPE_ID) ||
                    typesInsideContainer.includes(ATTACK_HELICOPTER_TYPE_ID)
                ) {
                    sendUserFeedback(socket, "Already a vehicle inside the transport piece.");
                    return;
                }
            }

            break;
        case C_130_TYPE_ID:
            //C130 = 1 SOF team
            //TODO: make sure the c-130 is 'landed' and on an airfield position... (distinction between airborn and landed probably)

            if (initialGameboardEmpty[thisContainerPiece.piecePositionId].type !== AIRFIELD_TYPE) {
                sendUserFeedback(socket, "Must enter from within an airfield.");
                return;
            }

            if (![SOF_TEAM_TYPE_ID].includes(thisSelectedPiece.pieceTypeId)) {
                sendUserFeedback(socket, "Must be a SOF team to enter a C130");
                return;
            }
            if (typesInsideContainer.length !== 0) {
                sendUserFeedback(socket, "Already has piece inside the C130.");
                return;
            }
            break;
        case A_C_CARRIER_TYPE_ID:
            //TODO: make sure changing to not allow C130's inside carriers (for now assuming that is the decision...)
            //Carrier = max capacity: 3 fighters, or 2 fighters and 1 c130, or 1 fighter and 2 c130s, but never 3 c130s, 2 helicopter at any given time...

            //TODO: could create constants for the list of allowed pieces
            if (![STEALTH_FIGHTER_TYPE_ID, ATTACK_HELICOPTER_TYPE_ID].includes(thisSelectedPiece.pieceTypeId)) {
                sendUserFeedback(socket, "Only fighters and helicopters can go on carriers.");
                return;
            }

            if (thisSelectedPiece.pieceTypeId === STEALTH_FIGHTER_TYPE_ID) {
                //are there 2 or less stealth fighters already inside
                let totalFightersAlreadyThere = 0;
                for (let pieceType of typesInsideContainer) {
                    if (pieceType === STEALTH_FIGHTER_TYPE_ID) totalFightersAlreadyThere++;
                }

                //TODO: use constant for this
                if (totalFightersAlreadyThere >= 3) {
                    sendUserFeedback(socket, "Already maxed out number of stealth fighters allowed on the carrier.");
                    return;
                }
            } else {
                //else -> pieceTypeId === ATTACK_HELICOPTER_TYPE_ID
                let totalHelicoptersAlreadyThere = 0;
                for (let pieceType of typesInsideContainer) {
                    if (pieceType === ATTACK_HELICOPTER_TYPE_ID) totalHelicoptersAlreadyThere++;
                }

                //TODO: use constant for this
                if (totalHelicoptersAlreadyThere >= 2) {
                    sendUserFeedback(socket, "Already maxed out number of helicopters allowed on the carrier.");
                    return;
                }
            }
            break;
        default:
            sendUserFeedback(socket, "Somehow got container with unknown type rules to switch on. Got past CONTAINER_TYPES...");
            return;
    }

    await Piece.putInsideContainer(selectedPiece, containerPiece);

    const serverAction = {
        type: OUTER_PIECE_CLICK_ACTION,
        payload: {
            gameboardPieces: await Piece.getVisiblePieces(gameId, gameTeam),
            selectedPiece,
            containerPiece
        }
    };
    socket.to("game" + gameId + "team" + gameTeam).emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
    socket.emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
};

module.exports = enterContainer;
