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

    //Check the possible combinations allowed within the container piece
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
            break;
        case TRANSPORT_TYPE_ID:
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

            //TODO: look at combinations for what is already in, vs what is trying to get in...

            break;
        case C_130_TYPE_ID:
            //C130 = 1 SOF team
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

            if (![STEALTH_FIGHTER_TYPE_ID, ATTACK_HELICOPTER_TYPE_ID].includes(thisSelectedPiece.pieceTypeId)) {
                sendUserFeedback(socket, "Only fighters and helicopters can go on carriers.");
                return;
            }

            //TODO: look at combinations for what is already in, vs what is trying to get in

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
