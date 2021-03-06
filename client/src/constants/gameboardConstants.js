const FLAG_0_LOCATION = 5; //Dragon Bottom
const FLAG_1_LOCATION = 14; //Dragon Top
const FLAG_2_LOCATION = 108; //HR Republic
const FLAG_3_LOCATION = 179; //Montaville
const FLAG_4_LOCATION = 202; //Lion FLAG
const FLAG_5_LOCATION = 240; //Noyarc
const FLAG_6_LOCATION = 336; //Fuler
const FLAG_7_LOCATION = 381; //Rico
const FLAG_8_LOCATION = 499; //Tamu`
const FLAG_9_LOCATION = 542; //Shor
const FLAG_10_LOCATION = 676; //Keoni
const FLAG_11_LOCATION = 670; //Eagle Top
const FLAG_12_LOCATION = 708; //Eagle Botton

const ALL_FLAG_LOCATIONS = [
    FLAG_0_LOCATION,
    FLAG_1_LOCATION,
    FLAG_2_LOCATION,
    FLAG_3_LOCATION,
    FLAG_4_LOCATION,
    FLAG_5_LOCATION,
    FLAG_6_LOCATION,
    FLAG_7_LOCATION,
    FLAG_8_LOCATION,
    FLAG_9_LOCATION,
    FLAG_10_LOCATION,
    FLAG_11_LOCATION,
    FLAG_12_LOCATION
];

const AIRFIELD_1_LOCATION = 21;
const AIRFIELD_2_LOCATION = 70;
const AIRFIELD_3_LOCATION = 92;
const AIRFIELD_4_LOCATION = 197;
const AIRFIELD_5_LOCATION = 253;
const AIRFIELD_6_LOCATION = 372;
const AIRFIELD_7_LOCATION = 383;
const AIRFIELD_8_LOCATION = 626;
const AIRFIELD_9_LOCATION = 640;
const AIRFIELD_10_LOCATION = 721;

const ALL_AIRFIELD_LOCATIONS = [
    AIRFIELD_1_LOCATION,
    AIRFIELD_2_LOCATION,
    AIRFIELD_3_LOCATION,
    AIRFIELD_4_LOCATION,
    AIRFIELD_5_LOCATION,
    AIRFIELD_6_LOCATION,
    AIRFIELD_7_LOCATION,
    AIRFIELD_8_LOCATION,
    AIRFIELD_9_LOCATION,
    AIRFIELD_10_LOCATION
];

const MISSILE_SILO_1_LOCATION = 91;
const MISSILE_SILO_2_LOCATION = 117;
const MISSILE_SILO_3_LOCATION = 226;
const MISSILE_SILO_4_LOCATION = 394;
const MISSILE_SILO_5_LOCATION = 469;
const MISSILE_SILO_6_LOCATION = 491;
const MISSILE_SILO_7_LOCATION = 617;
const MISSILE_SILO_8_LOCATION = 630;

const ALL_MISSILE_SILO_LOCATIONS = [
    MISSILE_SILO_1_LOCATION,
    MISSILE_SILO_2_LOCATION,
    MISSILE_SILO_3_LOCATION,
    MISSILE_SILO_4_LOCATION,
    MISSILE_SILO_5_LOCATION,
    MISSILE_SILO_6_LOCATION,
    MISSILE_SILO_7_LOCATION,
    MISSILE_SILO_8_LOCATION
];

const DRAGON_ISLAND_ID = 0;
const HR_REPUBLIC_ISLAND_ID = 1;
const MONTAVILLE_ISLAND_ID = 2;
const LION_ISLAND_ID = 3;
const NOYARC_ISLAND_ID = 4;
const FULLER_ISLAND_ID = 5;
const RICO_ISLAND_ID = 6;
const TAMU_ISLAND_ID = 7;
const SHOR_ISLAND_ID = 8;
const KEONI_ISLAND_ID = 9;
const EAGLE_ISLAND_ID = 10;

let FLAG_ISLAND_OWNERSHIP = {};
FLAG_ISLAND_OWNERSHIP[FLAG_0_LOCATION] = DRAGON_ISLAND_ID;
FLAG_ISLAND_OWNERSHIP[FLAG_1_LOCATION] = DRAGON_ISLAND_ID;
FLAG_ISLAND_OWNERSHIP[FLAG_2_LOCATION] = HR_REPUBLIC_ISLAND_ID;
FLAG_ISLAND_OWNERSHIP[FLAG_3_LOCATION] = MONTAVILLE_ISLAND_ID;
FLAG_ISLAND_OWNERSHIP[FLAG_4_LOCATION] = LION_ISLAND_ID;
FLAG_ISLAND_OWNERSHIP[FLAG_5_LOCATION] = NOYARC_ISLAND_ID;
FLAG_ISLAND_OWNERSHIP[FLAG_6_LOCATION] = FULLER_ISLAND_ID;
FLAG_ISLAND_OWNERSHIP[FLAG_7_LOCATION] = RICO_ISLAND_ID;
FLAG_ISLAND_OWNERSHIP[FLAG_8_LOCATION] = TAMU_ISLAND_ID;
FLAG_ISLAND_OWNERSHIP[FLAG_9_LOCATION] = SHOR_ISLAND_ID;
FLAG_ISLAND_OWNERSHIP[FLAG_10_LOCATION] = KEONI_ISLAND_ID;
FLAG_ISLAND_OWNERSHIP[FLAG_11_LOCATION] = EAGLE_ISLAND_ID;
FLAG_ISLAND_OWNERSHIP[FLAG_12_LOCATION] = EAGLE_ISLAND_ID;

//TODO: island names / capture point names?
//TODO: use actual island names in these constants, easier to reset / change later (don't reference numbers if you don't have to)
//TODO: probably rethink this file, and possible the database naming convention for island (flag) positions?

let ALL_ISLAND_NAMES = {};
ALL_ISLAND_NAMES[DRAGON_ISLAND_ID] = "Dragon Island";
ALL_ISLAND_NAMES[HR_REPUBLIC_ISLAND_ID] = "H.R. Republic";
ALL_ISLAND_NAMES[MONTAVILLE_ISLAND_ID] = "Montaville";
ALL_ISLAND_NAMES[LION_ISLAND_ID] = "Lion Island";
ALL_ISLAND_NAMES[NOYARC_ISLAND_ID] = "Noyarc";
ALL_ISLAND_NAMES[FULLER_ISLAND_ID] = "Fuller Island";
ALL_ISLAND_NAMES[RICO_ISLAND_ID] = "Rico Island";
ALL_ISLAND_NAMES[TAMU_ISLAND_ID] = "Tamu Island";
ALL_ISLAND_NAMES[SHOR_ISLAND_ID] = "Shor";
ALL_ISLAND_NAMES[KEONI_ISLAND_ID] = "Keoni";
ALL_ISLAND_NAMES[EAGLE_ISLAND_ID] = "Eagle Island";
ALL_ISLAND_NAMES[EAGLE_ISLAND_ID] = "Eagle Island";

let ISLAND_POINTS = {};
ISLAND_POINTS[DRAGON_ISLAND_ID] = 5;
ISLAND_POINTS[HR_REPUBLIC_ISLAND_ID] = 5;
ISLAND_POINTS[MONTAVILLE_ISLAND_ID] = 5;
ISLAND_POINTS[LION_ISLAND_ID] = 5;
ISLAND_POINTS[NOYARC_ISLAND_ID] = 5;
ISLAND_POINTS[FULLER_ISLAND_ID] = 5;
ISLAND_POINTS[RICO_ISLAND_ID] = 5;
ISLAND_POINTS[TAMU_ISLAND_ID] = 5;
ISLAND_POINTS[SHOR_ISLAND_ID] = 5;
ISLAND_POINTS[KEONI_ISLAND_ID] = 5;
ISLAND_POINTS[EAGLE_ISLAND_ID] = 5;

const LAND_TYPE = "land";
const WATER_TYPE = "water";
const AIRFIELD_TYPE = "airfield";
const MISSILE_SILO_TYPE = "missile";
const FLAG_TYPE = "flag";

const AIRFIELD_TITLE = "Airfield";
const MISSILE_SILO_TITLE = "Missile Silo";

const ALL_GROUND_TYPES = [LAND_TYPE, AIRFIELD_TYPE, MISSILE_SILO_TYPE, FLAG_TYPE];

const IGNORE_TITLE_TYPES = [LAND_TYPE, WATER_TYPE];

let ISLAND_POSITIONS = {};
//prettier-ignore
ISLAND_POSITIONS[DRAGON_ISLAND_ID] = [0,1,2,3,4,5,6,7,14,15,16,17,18,19,20,21,22,27,28,29,30,31,32,33,34,35,36,41,42,43,44,45,46,47,48,49,54,55,56,57,58,59,60,68,69,70,71,72,73,83,84,85,86,87,99,100,101,102,103,117,118,119];
ISLAND_POSITIONS[HR_REPUBLIC_ISLAND_ID] = [91, 92, 108, 109];
ISLAND_POSITIONS[MONTAVILLE_ISLAND_ID] = [129, 130, 145, 146, 160, 161, 162, 163, 164, 180, 179, 178, 177, 195, 196, 197];
ISLAND_POSITIONS[LION_ISLAND_ID] = [168, 169, 185, 186, 187, 201, 202, 203, 219, 220, 236, 237, 253, 254];
ISLAND_POSITIONS[NOYARC_ISLAND_ID] = [172, 189, 190, 206, 207, 208, 226, 225, 224, 223, 239, 240, 241, 258, 257];
//prettier-ignore
ISLAND_POSITIONS[FULLER_ISLAND_ID] = [302,303,319,320,321,322,323,324,325,342,341,340,339,338,337,336,353,354,355,356,357,358,359,360,377,376,393,394,372,371,389,390,407,406];
//prettier-ignore
ISLAND_POSITIONS[RICO_ISLAND_ID] = [279,280,281,282,300,299,298,297,314,315,316,334,333,332,331,348,349,350,367,366,365,364,380,381,382,383,384,401,400,399,398,416,417];
ISLAND_POSITIONS[TAMU_ISLAND_ID] = [465, 466, 467, 468, 469, 486, 485, 484, 483, 482, 481, 498, 499, 500, 516, 515, 502, 503];
//prettier-ignore
ISLAND_POSITIONS[SHOR_ISLAND_ID] = [491,492,507,508,509,525,526,541,542,543,544,545,529,546,564,563,562,561,560,559,576,577,578,579,596,595,594,611,612,613,630];
ISLAND_POSITIONS[KEONI_ISLAND_ID] = [625, 626, 642, 643, 644, 662, 661, 660, 659, 676, 677, 678, 679, 696, 695, 694, 693, 710, 711, 712];
//prettier-ignore
ISLAND_POSITIONS[EAGLE_ISLAND_ID] = [571,588,587,604,605,606,623,622,621,620,619,618,617,635,636,637,638,639,640,641,658,657,656,655,654,653,652,669,670,671,672,673,674,675,692,691,690,689,688,687,686,685,702,703,704,705,706,707,708,709,726,725,724,723,722,721,720];

let TEAM_MAIN_ISLAND_STARTING_POSITIONS = {};
//TODO: figure out a way to use BLUE_TEAM_ID from other constants file
//prettier-ignore
TEAM_MAIN_ISLAND_STARTING_POSITIONS[1] = [...ISLAND_POSITIONS[DRAGON_ISLAND_ID], 8, 9, 23, 37, 50, 61, 62, 63, 74,81, 82, 88, 98, 104, 116, 120, 121, 133, 134, 135, 136];
//prettier-ignore
TEAM_MAIN_ISLAND_STARTING_POSITIONS[0] = [...ISLAND_POSITIONS[EAGLE_ISLAND_ID], 553, 554, 570, 572, 586, 589, 600, 601, 602, 603, 607, 616, 624, 634, 651, 668, 684, 701, 718, 719];

export {
    IGNORE_TITLE_TYPES,
    MISSILE_SILO_TITLE,
    AIRFIELD_TITLE,
    FLAG_TYPE,
    MISSILE_SILO_TYPE,
    AIRFIELD_TYPE,
    WATER_TYPE,
    LAND_TYPE,
    ISLAND_POINTS,
    FLAG_ISLAND_OWNERSHIP,
    ALL_ISLAND_NAMES,
    EAGLE_ISLAND_ID,
    KEONI_ISLAND_ID,
    SHOR_ISLAND_ID,
    TAMU_ISLAND_ID,
    RICO_ISLAND_ID,
    FULLER_ISLAND_ID,
    NOYARC_ISLAND_ID,
    LION_ISLAND_ID,
    MONTAVILLE_ISLAND_ID,
    HR_REPUBLIC_ISLAND_ID,
    DRAGON_ISLAND_ID,
    ALL_MISSILE_SILO_LOCATIONS,
    MISSILE_SILO_8_LOCATION,
    MISSILE_SILO_7_LOCATION,
    MISSILE_SILO_6_LOCATION,
    MISSILE_SILO_5_LOCATION,
    MISSILE_SILO_4_LOCATION,
    MISSILE_SILO_3_LOCATION,
    MISSILE_SILO_2_LOCATION,
    MISSILE_SILO_1_LOCATION,
    ALL_AIRFIELD_LOCATIONS,
    AIRFIELD_10_LOCATION,
    AIRFIELD_9_LOCATION,
    AIRFIELD_1_LOCATION,
    AIRFIELD_2_LOCATION,
    AIRFIELD_3_LOCATION,
    AIRFIELD_4_LOCATION,
    AIRFIELD_5_LOCATION,
    AIRFIELD_6_LOCATION,
    AIRFIELD_7_LOCATION,
    AIRFIELD_8_LOCATION,
    ALL_FLAG_LOCATIONS,
    ALL_GROUND_TYPES,
    ISLAND_POSITIONS,
    TEAM_MAIN_ISLAND_STARTING_POSITIONS
};
