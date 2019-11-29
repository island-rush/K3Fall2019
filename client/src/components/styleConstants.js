//prettier-ignore
import { BOMBER_TYPE_ID,STEALTH_BOMBER_TYPE_ID,STEALTH_FIGHTER_TYPE_ID,AIR_REFUELING_SQUADRON_ID,TACTICAL_AIRLIFT_SQUADRON_TYPE_ID,AIRBORN_ISR_TYPE_ID,ARMY_INFANTRY_COMPANY_TYPE_ID,ARTILLERY_BATTERY_TYPE_ID,TANK_COMPANY_TYPE_ID,MARINE_INFANTRY_COMPANY_TYPE_ID,ATTACK_HELICOPTER_TYPE_ID,LIGHT_INFANTRY_VEHICLE_CONVOY_TYPE_ID,SAM_SITE_TYPE_ID,DESTROYER_TYPE_ID,A_C_CARRIER_TYPE_ID,SUBMARINE_TYPE_ID,TRANSPORT_TYPE_ID,MC_12_TYPE_ID,C_130_TYPE_ID,SOF_TEAM_TYPE_ID,ATC_SCRAMBLE_TYPE_ID,CYBER_DOMINANCE_TYPE_ID,MISSILE_LAUNCH_DISRUPTION_TYPE_ID,COMMUNICATIONS_INTERRUPTION_TYPE_ID,REMOTE_SENSING_TYPE_ID,RODS_FROM_GOD_TYPE_ID,ANTI_SATELLITE_MISSILES_TYPE_ID,GOLDEN_EYE_TYPE_ID,NUCLEAR_STRIKE_TYPE_ID,BIOLOGICAL_WEAPONS_TYPE_ID,SEA_MINES_TYPE_ID,DRONE_SWARMS_TYPE_ID,INSURGENCY_TYPE_ID,RAISE_MORALE_TYPE_ID,RADAR_TYPE_ID,MISSILE_TYPE_ID, BLUE_TEAM_ID, RED_TEAM_ID } from "../constants/gameConstants";

//These paths are relative to the ./public directory
const unitImagesPath = "./images/unitImages";
const diceImagePath = "./images/diceImages";
// const diceImagesPath = "./images/diceImages";
const graphicsPath = "./images/graphics";
const buttonImagesPath = "./images/buttonImages";

let TYPE_IMAGES = {};
TYPE_IMAGES[BOMBER_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/bomber.png")` };
TYPE_IMAGES[STEALTH_BOMBER_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/stealthBomber.png")` };
TYPE_IMAGES[STEALTH_FIGHTER_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/fighter.png")` };
TYPE_IMAGES[AIR_REFUELING_SQUADRON_ID] = { backgroundImage: `url("${unitImagesPath}/tanker.png")` };
TYPE_IMAGES[TACTICAL_AIRLIFT_SQUADRON_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/c17.png")` };
TYPE_IMAGES[AIRBORN_ISR_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/e3.png")` };
TYPE_IMAGES[ARMY_INFANTRY_COMPANY_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/infantry.png")` };
TYPE_IMAGES[ARTILLERY_BATTERY_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/artillery.png")` };
TYPE_IMAGES[TANK_COMPANY_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/tank.png")` };
TYPE_IMAGES[MARINE_INFANTRY_COMPANY_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/marine.png")` };
TYPE_IMAGES[ATTACK_HELICOPTER_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/attackHeli.png")` };
TYPE_IMAGES[LIGHT_INFANTRY_VEHICLE_CONVOY_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/convoy.png")` };
TYPE_IMAGES[SAM_SITE_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/sam.png")` };
TYPE_IMAGES[DESTROYER_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/destroyer.png")` };
TYPE_IMAGES[A_C_CARRIER_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/aircraftCarrier.png")` };
TYPE_IMAGES[SUBMARINE_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/submarine.png")` };
TYPE_IMAGES[TRANSPORT_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/transport.png")` };
TYPE_IMAGES[MC_12_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/mc12.png")` };
TYPE_IMAGES[C_130_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/c130.png")` };
TYPE_IMAGES[SOF_TEAM_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/sofTeam.png")` };
TYPE_IMAGES[RADAR_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/radar.png")` };
TYPE_IMAGES[MISSILE_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/antiSatelliteMissiles.png")` }; //TODO: change to a different image
TYPE_IMAGES[ATC_SCRAMBLE_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/ATCScramble.png")` };
TYPE_IMAGES[CYBER_DOMINANCE_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/cyberDominance.png")` };
TYPE_IMAGES[MISSILE_LAUNCH_DISRUPTION_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/missileLaunchDisruption.png")` };
TYPE_IMAGES[COMMUNICATIONS_INTERRUPTION_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/communicationsInterruption.png")` };
TYPE_IMAGES[REMOTE_SENSING_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/remoteSensing.png")` };
TYPE_IMAGES[RODS_FROM_GOD_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/rodsFromGod.png")` };
TYPE_IMAGES[ANTI_SATELLITE_MISSILES_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/antiSatelliteMissiles.png")` };
TYPE_IMAGES[GOLDEN_EYE_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/goldenEye.png")` };
TYPE_IMAGES[NUCLEAR_STRIKE_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/nuclearStrike.png")` };
TYPE_IMAGES[BIOLOGICAL_WEAPONS_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/biologicalWeapons.png")` };
TYPE_IMAGES[SEA_MINES_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/seaMines.png")` };
TYPE_IMAGES[DRONE_SWARMS_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/droneSwarm.png")` };
TYPE_IMAGES[INSURGENCY_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/insurgency.png")` };
TYPE_IMAGES[RAISE_MORALE_TYPE_ID] = { backgroundImage: `url("${unitImagesPath}/raiseMorale.png")` };

const DICE_IMAGES = {
    1: { backgroundImage: `url("${diceImagePath}/1.png")` },
    2: { backgroundImage: `url("${diceImagePath}/2.png")` },
    3: { backgroundImage: `url("${diceImagePath}/3.png")` },
    4: { backgroundImage: `url("${diceImagePath}/4.png")` },
    5: { backgroundImage: `url("${diceImagePath}/5.png")` },
    6: { backgroundImage: `url("${diceImagePath}/6.png")` }
};

const ARROW_IMAGE = {
    backgroundImage: `url("${graphicsPath}/arrow.png")`
};

const LEFT_CONTROLS_IMAGES = {
    start: { backgroundImage: `url("${buttonImagesPath}/iconPlanning.png")` },
    undo: { backgroundImage: `url("${buttonImagesPath}/iconUndo.png")` },
    cancel: { backgroundImage: `url("${buttonImagesPath}/iconCancel.png")` },
    confirm: { backgroundImage: `url("${buttonImagesPath}/iconConfirm.png")` },
    container: {
        backgroundImage: `url("${buttonImagesPath}/iconContainer.png")`
    }
};

const BATTLE_POPUP_IMAGES = {
    minIcon: { backgroundImage: `url("${graphicsPath}/battleIcon.png")` }
};

const NEWS_POPUP_IMAGES = {
    minIcon: { backgroundImage: `url("${graphicsPath}/newsIcon.png")` }
};

const REFUEL_POPUP_IMAGES = {
    minIcon: { backgroundImage: `url("${graphicsPath}/refuelIcon.png")` }
};

//TODO: change to be based on gameboardConstants
const ZOOMBOX_BACKGROUNDS = {
    land: { backgroundColor: "green" },
    water: { backgroundColor: "cyan" },
    airfield: { backgroundColor: "green" },
    flag: { backgroundColor: "green" },
    missile: { backgroundColor: "green" },
    red: { backgroundColor: "green" },
    blue: { backgroundColor: "green" },
    remoteSensing: { backgroundColor: "LightGray" }
};

let TYPE_TEAM_BORDERS = {};
TYPE_TEAM_BORDERS[BLUE_TEAM_ID] = { boxShadow: "0px 0px 0px 2px rgba(0, 111, 255, 0.67) inset" };
TYPE_TEAM_BORDERS[RED_TEAM_ID] = { boxShadow: "0px 0px 0px 2px rgba(255, 0, 0, 0.55) inset" };

const SELECTED_BORDERS = [
    { border: "2px solid red" }, //selected
    { border: "2px solid black" } //not selected
];

export {
    SELECTED_BORDERS,
    TYPE_TEAM_BORDERS,
    ZOOMBOX_BACKGROUNDS,
    REFUEL_POPUP_IMAGES,
    NEWS_POPUP_IMAGES,
    BATTLE_POPUP_IMAGES,
    LEFT_CONTROLS_IMAGES,
    ARROW_IMAGE,
    DICE_IMAGES,
    TYPE_IMAGES
};
