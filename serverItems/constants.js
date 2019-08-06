exports.INITIAL_GAMESTATE = "INITIAL_GAMESTATE";
exports.SHOP_PURCHASE = "SHOP_PURCHASE";
exports.SHOP_REFUND = "SHOP_REFUND";
exports.SET_USERFEEDBACK = "SET_USERFEEDBACK";
exports.SHOP_TRANSFER = "SHOP_TRANSFER";

exports.shopItemTypeCosts = {
	//TypeId: Cost
	0: 10, //radar
	1: 10, //plane
	2: 10, //sub
	3: 10 //tank
};

exports.typeMoves = {
	//TypdId: Moves (-1 = warfare)
	0: -1, //radar
	1: 5, //plane
	2: 5, //sub
	3: 5 //tank
};

exports.typeNames = {
	0: "Radar",
	1: "Plane",
	2: "Sub",
	3: "Tank"
};

exports.blankGameboard = {
    '0': {
      type: 'land',
      pieces: []
    },
    '1': {
      type: 'land',
      pieces: []
    },
    '2': {
      type: 'land',
      pieces: []
    },
    '3': {
      type: 'land',
      pieces: []
    },
    '4': {
      type: 'land',
      pieces: []
    },
    '5': {
      type: 'red',
      pieces: []
    },
    '6': {
      type: 'land',
      pieces: []
    },
    '7': {
      type: 'land',
      pieces: []
    },
    '8': {
      type: 'water',
      pieces: []
    },
    '9': {
      type: 'water',
      pieces: []
    },
    '10': {
      type: 'water',
      pieces: []
    },
    '11': {
      type: 'water',
      pieces: []
    },
    '12': {
      type: 'water',
      pieces: []
    },
    '13': {
      type: 'water',
      pieces: []
    },
    '14': {
      type: 'red',
      pieces: []
    },
    '15': {
      type: 'land',
      pieces: []
    },
    '16': {
      type: 'land',
      pieces: []
    },
    '17': {
      type: 'land',
      pieces: []
    },
    '18': {
      type: 'land',
      pieces: []
    },
    '19': {
      type: 'land',
      pieces: []
    },
    '20': {
      type: 'land',
      pieces: []
    },
    '21': {
      type: 'airfield',
      pieces: []
    },
    '22': {
      type: 'land',
      pieces: []
    },
    '23': {
      type: 'water',
      pieces: []
    },
    '24': {
      type: 'water',
      pieces: []
    },
    '25': {
      type: 'water',
      pieces: []
    },
    '26': {
      type: 'water',
      pieces: []
    },
    '27': {
      type: 'land',
      pieces: []
    },
    '28': {
      type: 'land',
      pieces: []
    },
    '29': {
      type: 'land',
      pieces: []
    },
    '30': {
      type: 'land',
      pieces: []
    },
    '31': {
      type: 'land',
      pieces: []
    },
    '32': {
      type: 'land',
      pieces: []
    },
    '33': {
      type: 'land',
      pieces: []
    },
    '34': {
      type: 'land',
      pieces: []
    },
    '35': {
      type: 'land',
      pieces: []
    },
    '36': {
      type: 'land',
      pieces: []
    },
    '37': {
      type: 'water',
      pieces: []
    },
    '38': {
      type: 'water',
      pieces: []
    },
    '39': {
      type: 'water',
      pieces: []
    },
    '40': {
      type: 'water',
      pieces: []
    },
    '41': {
      type: 'land',
      pieces: []
    },
    '42': {
      type: 'land',
      pieces: []
    },
    '43': {
      type: 'land',
      pieces: []
    },
    '44': {
      type: 'land',
      pieces: []
    },
    '45': {
      type: 'land',
      pieces: []
    },
    '46': {
      type: 'land',
      pieces: []
    },
    '47': {
      type: 'land',
      pieces: []
    },
    '48': {
      type: 'land',
      pieces: []
    },
    '49': {
      type: 'land',
      pieces: []
    },
    '50': {
      type: 'water',
      pieces: []
    },
    '51': {
      type: 'water',
      pieces: []
    },
    '52': {
      type: 'water',
      pieces: []
    },
    '53': {
      type: 'water',
      pieces: []
    },
    '54': {
      type: 'land',
      pieces: []
    },
    '55': {
      type: 'land',
      pieces: []
    },
    '56': {
      type: 'land',
      pieces: []
    },
    '57': {
      type: 'land',
      pieces: []
    },
    '58': {
      type: 'land',
      pieces: []
    },
    '59': {
      type: 'land',
      pieces: []
    },
    '60': {
      type: 'land',
      pieces: []
    },
    '61': {
      type: 'water',
      pieces: []
    },
    '62': {
      type: 'water',
      pieces: []
    },
    '63': {
      type: 'water',
      pieces: []
    },
    '64': {
      type: 'water',
      pieces: []
    },
    '65': {
      type: 'water',
      pieces: []
    },
    '66': {
      type: 'water',
      pieces: []
    },
    '67': {
      type: 'water',
      pieces: []
    },
    '68': {
      type: 'land',
      pieces: []
    },
    '69': {
      type: 'land',
      pieces: []
    },
    '70': {
      type: 'airfield',
      pieces: []
    },
    '71': {
      type: 'land',
      pieces: []
    },
    '72': {
      type: 'land',
      pieces: []
    },
    '73': {
      type: 'land',
      pieces: []
    },
    '74': {
      type: 'water',
      pieces: []
    },
    '75': {
      type: 'water',
      pieces: []
    },
    '76': {
      type: 'water',
      pieces: []
    },
    '77': {
      type: 'water',
      pieces: []
    },
    '78': {
      type: 'water',
      pieces: []
    },
    '79': {
      type: 'water',
      pieces: []
    },
    '80': {
      type: 'water',
      pieces: []
    },
    '81': {
      type: 'water',
      pieces: []
    },
    '82': {
      type: 'water',
      pieces: []
    },
    '83': {
      type: 'land',
      pieces: []
    },
    '84': {
      type: 'land',
      pieces: []
    },
    '85': {
      type: 'land',
      pieces: []
    },
    '86': {
      type: 'land',
      pieces: []
    },
    '87': {
      type: 'land',
      pieces: []
    },
    '88': {
      type: 'water',
      pieces: []
    },
    '89': {
      type: 'water',
      pieces: []
    },
    '90': {
      type: 'water',
      pieces: []
    },
    '91': {
      type: 'missile',
      pieces: []
    },
    '92': {
      type: 'airfield',
      pieces: []
    },
    '93': {
      type: 'water',
      pieces: []
    },
    '94': {
      type: 'water',
      pieces: []
    },
    '95': {
      type: 'water',
      pieces: []
    },
    '96': {
      type: 'water',
      pieces: []
    },
    '97': {
      type: 'water',
      pieces: []
    },
    '98': {
      type: 'water',
      pieces: []
    },
    '99': {
      type: 'land',
      pieces: []
    },
    '100': {
      type: 'land',
      pieces: []
    },
    '101': {
      type: 'land',
      pieces: []
    },
    '102': {
      type: 'land',
      pieces: []
    },
    '103': {
      type: 'land',
      pieces: []
    },
    '104': {
      type: 'water',
      pieces: []
    },
    '105': {
      type: 'water',
      pieces: []
    },
    '106': {
      type: 'water',
      pieces: []
    },
    '107': {
      type: 'water',
      pieces: []
    },
    '108': {
      type: 'red',
      pieces: []
    },
    '109': {
      type: 'land',
      pieces: []
    },
    '110': {
      type: 'water',
      pieces: []
    },
    '111': {
      type: 'water',
      pieces: []
    },
    '112': {
      type: 'water',
      pieces: []
    },
    '113': {
      type: 'water',
      pieces: []
    },
    '114': {
      type: 'water',
      pieces: []
    },
    '115': {
      type: 'water',
      pieces: []
    },
    '116': {
      type: 'water',
      pieces: []
    },
    '117': {
      type: 'missile',
      pieces: []
    },
    '118': {
      type: 'land',
      pieces: []
    },
    '119': {
      type: 'land',
      pieces: []
    },
    '120': {
      type: 'water',
      pieces: []
    },
    '121': {
      type: 'water',
      pieces: []
    },
    '122': {
      type: 'water',
      pieces: []
    },
    '123': {
      type: 'water',
      pieces: []
    },
    '124': {
      type: 'water',
      pieces: []
    },
    '125': {
      type: 'water',
      pieces: []
    },
    '126': {
      type: 'water',
      pieces: []
    },
    '127': {
      type: 'water',
      pieces: []
    },
    '128': {
      type: 'water',
      pieces: []
    },
    '129': {
      type: 'land',
      pieces: []
    },
    '130': {
      type: 'land',
      pieces: []
    },
    '131': {
      type: 'water',
      pieces: []
    },
    '132': {
      type: 'water',
      pieces: []
    },
    '133': {
      type: 'water',
      pieces: []
    },
    '134': {
      type: 'water',
      pieces: []
    },
    '135': {
      type: 'water',
      pieces: []
    },
    '136': {
      type: 'water',
      pieces: []
    },
    '137': {
      type: 'water',
      pieces: []
    },
    '138': {
      type: 'water',
      pieces: []
    },
    '139': {
      type: 'water',
      pieces: []
    },
    '140': {
      type: 'water',
      pieces: []
    },
    '141': {
      type: 'water',
      pieces: []
    },
    '142': {
      type: 'water',
      pieces: []
    },
    '143': {
      type: 'water',
      pieces: []
    },
    '144': {
      type: 'water',
      pieces: []
    },
    '145': {
      type: 'land',
      pieces: []
    },
    '146': {
      type: 'land',
      pieces: []
    },
    '147': {
      type: 'water',
      pieces: []
    },
    '148': {
      type: 'water',
      pieces: []
    },
    '149': {
      type: 'water',
      pieces: []
    },
    '150': {
      type: 'water',
      pieces: []
    },
    '151': {
      type: 'water',
      pieces: []
    },
    '152': {
      type: 'water',
      pieces: []
    },
    '153': {
      type: 'water',
      pieces: []
    },
    '154': {
      type: 'water',
      pieces: []
    },
    '155': {
      type: 'water',
      pieces: []
    },
    '156': {
      type: 'water',
      pieces: []
    },
    '157': {
      type: 'water',
      pieces: []
    },
    '158': {
      type: 'water',
      pieces: []
    },
    '159': {
      type: 'water',
      pieces: []
    },
    '160': {
      type: 'land',
      pieces: []
    },
    '161': {
      type: 'land',
      pieces: []
    },
    '162': {
      type: 'land',
      pieces: []
    },
    '163': {
      type: 'land',
      pieces: []
    },
    '164': {
      type: 'land',
      pieces: []
    },
    '165': {
      type: 'water',
      pieces: []
    },
    '166': {
      type: 'water',
      pieces: []
    },
    '167': {
      type: 'water',
      pieces: []
    },
    '168': {
      type: 'land',
      pieces: []
    },
    '169': {
      type: 'land',
      pieces: []
    },
    '170': {
      type: 'water',
      pieces: []
    },
    '171': {
      type: 'water',
      pieces: []
    },
    '172': {
      type: 'land',
      pieces: []
    },
    '173': {
      type: 'water',
      pieces: []
    },
    '174': {
      type: 'water',
      pieces: []
    },
    '175': {
      type: 'water',
      pieces: []
    },
    '176': {
      type: 'water',
      pieces: []
    },
    '177': {
      type: 'land',
      pieces: []
    },
    '178': {
      type: 'land',
      pieces: []
    },
    '179': {
      type: 'blue',
      pieces: []
    },
    '180': {
      type: 'land',
      pieces: []
    },
    '181': {
      type: 'water',
      pieces: []
    },
    '182': {
      type: 'water',
      pieces: []
    },
    '183': {
      type: 'water',
      pieces: []
    },
    '184': {
      type: 'water',
      pieces: []
    },
    '185': {
      type: 'land',
      pieces: []
    },
    '186': {
      type: 'land',
      pieces: []
    },
    '187': {
      type: 'land',
      pieces: []
    },
    '188': {
      type: 'water',
      pieces: []
    },
    '189': {
      type: 'land',
      pieces: []
    },
    '190': {
      type: 'land',
      pieces: []
    },
    '191': {
      type: 'water',
      pieces: []
    },
    '192': {
      type: 'water',
      pieces: []
    },
    '193': {
      type: 'water',
      pieces: []
    },
    '194': {
      type: 'water',
      pieces: []
    },
    '195': {
      type: 'land',
      pieces: []
    },
    '196': {
      type: 'land',
      pieces: []
    },
    '197': {
      type: 'airfield',
      pieces: []
    },
    '198': {
      type: 'water',
      pieces: []
    },
    '199': {
      type: 'water',
      pieces: []
    },
    '200': {
      type: 'water',
      pieces: []
    },
    '201': {
      type: 'land',
      pieces: []
    },
    '202': {
      type: 'red',
      pieces: []
    },
    '203': {
      type: 'land',
      pieces: []
    },
    '204': {
      type: 'water',
      pieces: []
    },
    '205': {
      type: 'water',
      pieces: []
    },
    '206': {
      type: 'land',
      pieces: []
    },
    '207': {
      type: 'land',
      pieces: []
    },
    '208': {
      type: 'land',
      pieces: []
    },
    '209': {
      type: 'water',
      pieces: []
    },
    '210': {
      type: 'water',
      pieces: []
    },
    '211': {
      type: 'water',
      pieces: []
    },
    '212': {
      type: 'water',
      pieces: []
    },
    '213': {
      type: 'water',
      pieces: []
    },
    '214': {
      type: 'water',
      pieces: []
    },
    '215': {
      type: 'water',
      pieces: []
    },
    '216': {
      type: 'water',
      pieces: []
    },
    '217': {
      type: 'water',
      pieces: []
    },
    '218': {
      type: 'water',
      pieces: []
    },
    '219': {
      type: 'land',
      pieces: []
    },
    '220': {
      type: 'land',
      pieces: []
    },
    '221': {
      type: 'water',
      pieces: []
    },
    '222': {
      type: 'water',
      pieces: []
    },
    '223': {
      type: 'land',
      pieces: []
    },
    '224': {
      type: 'land',
      pieces: []
    },
    '225': {
      type: 'land',
      pieces: []
    },
    '226': {
      type: 'missile',
      pieces: []
    },
    '227': {
      type: 'water',
      pieces: []
    },
    '228': {
      type: 'water',
      pieces: []
    },
    '229': {
      type: 'water',
      pieces: []
    },
    '230': {
      type: 'water',
      pieces: []
    },
    '231': {
      type: 'water',
      pieces: []
    },
    '232': {
      type: 'water',
      pieces: []
    },
    '233': {
      type: 'water',
      pieces: []
    },
    '234': {
      type: 'water',
      pieces: []
    },
    '235': {
      type: 'water',
      pieces: []
    },
    '236': {
      type: 'land',
      pieces: []
    },
    '237': {
      type: 'land',
      pieces: []
    },
    '238': {
      type: 'water',
      pieces: []
    },
    '239': {
      type: 'land',
      pieces: []
    },
    '240': {
      type: 'red',
      pieces: []
    },
    '241': {
      type: 'land',
      pieces: []
    },
    '242': {
      type: 'water',
      pieces: []
    },
    '243': {
      type: 'water',
      pieces: []
    },
    '244': {
      type: 'water',
      pieces: []
    },
    '245': {
      type: 'water',
      pieces: []
    },
    '246': {
      type: 'water',
      pieces: []
    },
    '247': {
      type: 'water',
      pieces: []
    },
    '248': {
      type: 'water',
      pieces: []
    },
    '249': {
      type: 'water',
      pieces: []
    },
    '250': {
      type: 'water',
      pieces: []
    },
    '251': {
      type: 'water',
      pieces: []
    },
    '252': {
      type: 'water',
      pieces: []
    },
    '253': {
      type: 'airfield',
      pieces: []
    },
    '254': {
      type: 'land',
      pieces: []
    },
    '255': {
      type: 'water',
      pieces: []
    },
    '256': {
      type: 'water',
      pieces: []
    },
    '257': {
      type: 'land',
      pieces: []
    },
    '258': {
      type: 'land',
      pieces: []
    },
    '259': {
      type: 'water',
      pieces: []
    },
    '260': {
      type: 'water',
      pieces: []
    },
    '261': {
      type: 'water',
      pieces: []
    },
    '262': {
      type: 'water',
      pieces: []
    },
    '263': {
      type: 'water',
      pieces: []
    },
    '264': {
      type: 'water',
      pieces: []
    },
    '265': {
      type: 'water',
      pieces: []
    },
    '266': {
      type: 'water',
      pieces: []
    },
    '267': {
      type: 'water',
      pieces: []
    },
    '268': {
      type: 'water',
      pieces: []
    },
    '269': {
      type: 'water',
      pieces: []
    },
    '270': {
      type: 'water',
      pieces: []
    },
    '271': {
      type: 'water',
      pieces: []
    },
    '272': {
      type: 'water',
      pieces: []
    },
    '273': {
      type: 'water',
      pieces: []
    },
    '274': {
      type: 'water',
      pieces: []
    },
    '275': {
      type: 'water',
      pieces: []
    },
    '276': {
      type: 'water',
      pieces: []
    },
    '277': {
      type: 'water',
      pieces: []
    },
    '278': {
      type: 'water',
      pieces: []
    },
    '279': {
      type: 'land',
      pieces: []
    },
    '280': {
      type: 'land',
      pieces: []
    },
    '281': {
      type: 'land',
      pieces: []
    },
    '282': {
      type: 'land',
      pieces: []
    },
    '283': {
      type: 'water',
      pieces: []
    },
    '284': {
      type: 'water',
      pieces: []
    },
    '285': {
      type: 'water',
      pieces: []
    },
    '286': {
      type: 'water',
      pieces: []
    },
    '287': {
      type: 'water',
      pieces: []
    },
    '288': {
      type: 'water',
      pieces: []
    },
    '289': {
      type: 'water',
      pieces: []
    },
    '290': {
      type: 'water',
      pieces: []
    },
    '291': {
      type: 'water',
      pieces: []
    },
    '292': {
      type: 'water',
      pieces: []
    },
    '293': {
      type: 'water',
      pieces: []
    },
    '294': {
      type: 'water',
      pieces: []
    },
    '295': {
      type: 'water',
      pieces: []
    },
    '296': {
      type: 'water',
      pieces: []
    },
    '297': {
      type: 'land',
      pieces: []
    },
    '298': {
      type: 'land',
      pieces: []
    },
    '299': {
      type: 'land',
      pieces: []
    },
    '300': {
      type: 'land',
      pieces: []
    },
    '301': {
      type: 'water',
      pieces: []
    },
    '302': {
      type: 'land',
      pieces: []
    },
    '303': {
      type: 'land',
      pieces: []
    },
    '304': {
      type: 'water',
      pieces: []
    },
    '305': {
      type: 'water',
      pieces: []
    },
    '306': {
      type: 'water',
      pieces: []
    },
    '307': {
      type: 'water',
      pieces: []
    },
    '308': {
      type: 'water',
      pieces: []
    },
    '309': {
      type: 'water',
      pieces: []
    },
    '310': {
      type: 'water',
      pieces: []
    },
    '311': {
      type: 'water',
      pieces: []
    },
    '312': {
      type: 'water',
      pieces: []
    },
    '313': {
      type: 'water',
      pieces: []
    },
    '314': {
      type: 'land',
      pieces: []
    },
    '315': {
      type: 'land',
      pieces: []
    },
    '316': {
      type: 'land',
      pieces: []
    },
    '317': {
      type: 'water',
      pieces: []
    },
    '318': {
      type: 'water',
      pieces: []
    },
    '319': {
      type: 'land',
      pieces: []
    },
    '320': {
      type: 'land',
      pieces: []
    },
    '321': {
      type: 'land',
      pieces: []
    },
    '322': {
      type: 'land',
      pieces: []
    },
    '323': {
      type: 'land',
      pieces: []
    },
    '324': {
      type: 'land',
      pieces: []
    },
    '325': {
      type: 'land',
      pieces: []
    },
    '326': {
      type: 'water',
      pieces: []
    },
    '327': {
      type: 'water',
      pieces: []
    },
    '328': {
      type: 'water',
      pieces: []
    },
    '329': {
      type: 'water',
      pieces: []
    },
    '330': {
      type: 'water',
      pieces: []
    },
    '331': {
      type: 'land',
      pieces: []
    },
    '332': {
      type: 'land',
      pieces: []
    },
    '333': {
      type: 'land',
      pieces: []
    },
    '334': {
      type: 'land',
      pieces: []
    },
    '335': {
      type: 'water',
      pieces: []
    },
    '336': {
      type: 'flag',
      pieces: []
    },
    '337': {
      type: 'land',
      pieces: []
    },
    '338': {
      type: 'land',
      pieces: []
    },
    '339': {
      type: 'land',
      pieces: []
    },
    '340': {
      type: 'land',
      pieces: []
    },
    '341': {
      type: 'land',
      pieces: []
    },
    '342': {
      type: 'land',
      pieces: []
    },
    '343': {
      type: 'water',
      pieces: []
    },
    '344': {
      type: 'water',
      pieces: []
    },
    '345': {
      type: 'water',
      pieces: []
    },
    '346': {
      type: 'water',
      pieces: []
    },
    '347': {
      type: 'water',
      pieces: []
    },
    '348': {
      type: 'land',
      pieces: []
    },
    '349': {
      type: 'land',
      pieces: []
    },
    '350': {
      type: 'land',
      pieces: []
    },
    '351': {
      type: 'water',
      pieces: []
    },
    '352': {
      type: 'water',
      pieces: []
    },
    '353': {
      type: 'land',
      pieces: []
    },
    '354': {
      type: 'land',
      pieces: []
    },
    '355': {
      type: 'land',
      pieces: []
    },
    '356': {
      type: 'land',
      pieces: []
    },
    '357': {
      type: 'land',
      pieces: []
    },
    '358': {
      type: 'land',
      pieces: []
    },
    '359': {
      type: 'land',
      pieces: []
    },
    '360': {
      type: 'land',
      pieces: []
    },
    '361': {
      type: 'water',
      pieces: []
    },
    '362': {
      type: 'water',
      pieces: []
    },
    '363': {
      type: 'water',
      pieces: []
    },
    '364': {
      type: 'land',
      pieces: []
    },
    '365': {
      type: 'land',
      pieces: []
    },
    '366': {
      type: 'land',
      pieces: []
    },
    '367': {
      type: 'land',
      pieces: []
    },
    '368': {
      type: 'water',
      pieces: []
    },
    '369': {
      type: 'water',
      pieces: []
    },
    '370': {
      type: 'water',
      pieces: []
    },
    '371': {
      type: 'land',
      pieces: []
    },
    '372': {
      type: 'airfield',
      pieces: []
    },
    '373': {
      type: 'water',
      pieces: []
    },
    '374': {
      type: 'water',
      pieces: []
    },
    '375': {
      type: 'water',
      pieces: []
    },
    '376': {
      type: 'land',
      pieces: []
    },
    '377': {
      type: 'land',
      pieces: []
    },
    '378': {
      type: 'water',
      pieces: []
    },
    '379': {
      type: 'water',
      pieces: []
    },
    '380': {
      type: 'land',
      pieces: []
    },
    '381': {
      type: 'flag',
      pieces: []
    },
    '382': {
      type: 'land',
      pieces: []
    },
    '383': {
      type: 'airfield',
      pieces: []
    },
    '384': {
      type: 'land',
      pieces: []
    },
    '385': {
      type: 'water',
      pieces: []
    },
    '386': {
      type: 'water',
      pieces: []
    },
    '387': {
      type: 'water',
      pieces: []
    },
    '388': {
      type: 'water',
      pieces: []
    },
    '389': {
      type: 'land',
      pieces: []
    },
    '390': {
      type: 'land',
      pieces: []
    },
    '391': {
      type: 'water',
      pieces: []
    },
    '392': {
      type: 'water',
      pieces: []
    },
    '393': {
      type: 'land',
      pieces: []
    },
    '394': {
      type: 'missile',
      pieces: []
    },
    '395': {
      type: 'water',
      pieces: []
    },
    '396': {
      type: 'water',
      pieces: []
    },
    '397': {
      type: 'water',
      pieces: []
    },
    '398': {
      type: 'land',
      pieces: []
    },
    '399': {
      type: 'land',
      pieces: []
    },
    '400': {
      type: 'land',
      pieces: []
    },
    '401': {
      type: 'land',
      pieces: []
    },
    '402': {
      type: 'water',
      pieces: []
    },
    '403': {
      type: 'water',
      pieces: []
    },
    '404': {
      type: 'water',
      pieces: []
    },
    '405': {
      type: 'water',
      pieces: []
    },
    '406': {
      type: 'land',
      pieces: []
    },
    '407': {
      type: 'land',
      pieces: []
    },
    '408': {
      type: 'water',
      pieces: []
    },
    '409': {
      type: 'water',
      pieces: []
    },
    '410': {
      type: 'water',
      pieces: []
    },
    '411': {
      type: 'water',
      pieces: []
    },
    '412': {
      type: 'water',
      pieces: []
    },
    '413': {
      type: 'water',
      pieces: []
    },
    '414': {
      type: 'water',
      pieces: []
    },
    '415': {
      type: 'water',
      pieces: []
    },
    '416': {
      type: 'land',
      pieces: []
    },
    '417': {
      type: 'land',
      pieces: []
    },
    '418': {
      type: 'water',
      pieces: []
    },
    '419': {
      type: 'water',
      pieces: []
    },
    '420': {
      type: 'water',
      pieces: []
    },
    '421': {
      type: 'water',
      pieces: []
    },
    '422': {
      type: 'water',
      pieces: []
    },
    '423': {
      type: 'water',
      pieces: []
    },
    '424': {
      type: 'water',
      pieces: []
    },
    '425': {
      type: 'water',
      pieces: []
    },
    '426': {
      type: 'water',
      pieces: []
    },
    '427': {
      type: 'water',
      pieces: []
    },
    '428': {
      type: 'water',
      pieces: []
    },
    '429': {
      type: 'water',
      pieces: []
    },
    '430': {
      type: 'water',
      pieces: []
    },
    '431': {
      type: 'water',
      pieces: []
    },
    '432': {
      type: 'water',
      pieces: []
    },
    '433': {
      type: 'water',
      pieces: []
    },
    '434': {
      type: 'water',
      pieces: []
    },
    '435': {
      type: 'water',
      pieces: []
    },
    '436': {
      type: 'water',
      pieces: []
    },
    '437': {
      type: 'water',
      pieces: []
    },
    '438': {
      type: 'water',
      pieces: []
    },
    '439': {
      type: 'water',
      pieces: []
    },
    '440': {
      type: 'water',
      pieces: []
    },
    '441': {
      type: 'water',
      pieces: []
    },
    '442': {
      type: 'water',
      pieces: []
    },
    '443': {
      type: 'water',
      pieces: []
    },
    '444': {
      type: 'water',
      pieces: []
    },
    '445': {
      type: 'water',
      pieces: []
    },
    '446': {
      type: 'water',
      pieces: []
    },
    '447': {
      type: 'water',
      pieces: []
    },
    '448': {
      type: 'water',
      pieces: []
    },
    '449': {
      type: 'water',
      pieces: []
    },
    '450': {
      type: 'water',
      pieces: []
    },
    '451': {
      type: 'water',
      pieces: []
    },
    '452': {
      type: 'water',
      pieces: []
    },
    '453': {
      type: 'water',
      pieces: []
    },
    '454': {
      type: 'water',
      pieces: []
    },
    '455': {
      type: 'water',
      pieces: []
    },
    '456': {
      type: 'water',
      pieces: []
    },
    '457': {
      type: 'water',
      pieces: []
    },
    '458': {
      type: 'water',
      pieces: []
    },
    '459': {
      type: 'water',
      pieces: []
    },
    '460': {
      type: 'water',
      pieces: []
    },
    '461': {
      type: 'water',
      pieces: []
    },
    '462': {
      type: 'water',
      pieces: []
    },
    '463': {
      type: 'water',
      pieces: []
    },
    '464': {
      type: 'water',
      pieces: []
    },
    '465': {
      type: 'land',
      pieces: []
    },
    '466': {
      type: 'land',
      pieces: []
    },
    '467': {
      type: 'land',
      pieces: []
    },
    '468': {
      type: 'land',
      pieces: []
    },
    '469': {
      type: 'missile',
      pieces: []
    },
    '470': {
      type: 'water',
      pieces: []
    },
    '471': {
      type: 'water',
      pieces: []
    },
    '472': {
      type: 'water',
      pieces: []
    },
    '473': {
      type: 'water',
      pieces: []
    },
    '474': {
      type: 'water',
      pieces: []
    },
    '475': {
      type: 'water',
      pieces: []
    },
    '476': {
      type: 'water',
      pieces: []
    },
    '477': {
      type: 'water',
      pieces: []
    },
    '478': {
      type: 'water',
      pieces: []
    },
    '479': {
      type: 'water',
      pieces: []
    },
    '480': {
      type: 'water',
      pieces: []
    },
    '481': {
      type: 'land',
      pieces: []
    },
    '482': {
      type: 'land',
      pieces: []
    },
    '483': {
      type: 'land',
      pieces: []
    },
    '484': {
      type: 'land',
      pieces: []
    },
    '485': {
      type: 'land',
      pieces: []
    },
    '486': {
      type: 'land',
      pieces: []
    },
    '487': {
      type: 'water',
      pieces: []
    },
    '488': {
      type: 'water',
      pieces: []
    },
    '489': {
      type: 'water',
      pieces: []
    },
    '490': {
      type: 'water',
      pieces: []
    },
    '491': {
      type: 'missile',
      pieces: []
    },
    '492': {
      type: 'land',
      pieces: []
    },
    '493': {
      type: 'water',
      pieces: []
    },
    '494': {
      type: 'water',
      pieces: []
    },
    '495': {
      type: 'water',
      pieces: []
    },
    '496': {
      type: 'water',
      pieces: []
    },
    '497': {
      type: 'water',
      pieces: []
    },
    '498': {
      type: 'land',
      pieces: []
    },
    '499': {
      type: 'blue',
      pieces: []
    },
    '500': {
      type: 'land',
      pieces: []
    },
    '501': {
      type: 'water',
      pieces: []
    },
    '502': {
      type: 'land',
      pieces: []
    },
    '503': {
      type: 'land',
      pieces: []
    },
    '504': {
      type: 'water',
      pieces: []
    },
    '505': {
      type: 'water',
      pieces: []
    },
    '506': {
      type: 'water',
      pieces: []
    },
    '507': {
      type: 'land',
      pieces: []
    },
    '508': {
      type: 'land',
      pieces: []
    },
    '509': {
      type: 'land',
      pieces: []
    },
    '510': {
      type: 'water',
      pieces: []
    },
    '511': {
      type: 'water',
      pieces: []
    },
    '512': {
      type: 'water',
      pieces: []
    },
    '513': {
      type: 'water',
      pieces: []
    },
    '514': {
      type: 'water',
      pieces: []
    },
    '515': {
      type: 'land',
      pieces: []
    },
    '516': {
      type: 'land',
      pieces: []
    },
    '517': {
      type: 'water',
      pieces: []
    },
    '518': {
      type: 'water',
      pieces: []
    },
    '519': {
      type: 'water',
      pieces: []
    },
    '520': {
      type: 'water',
      pieces: []
    },
    '521': {
      type: 'water',
      pieces: []
    },
    '522': {
      type: 'water',
      pieces: []
    },
    '523': {
      type: 'water',
      pieces: []
    },
    '524': {
      type: 'water',
      pieces: []
    },
    '525': {
      type: 'land',
      pieces: []
    },
    '526': {
      type: 'land',
      pieces: []
    },
    '527': {
      type: 'water',
      pieces: []
    },
    '528': {
      type: 'water',
      pieces: []
    },
    '529': {
      type: 'land',
      pieces: []
    },
    '530': {
      type: 'water',
      pieces: []
    },
    '531': {
      type: 'water',
      pieces: []
    },
    '532': {
      type: 'water',
      pieces: []
    },
    '533': {
      type: 'water',
      pieces: []
    },
    '534': {
      type: 'water',
      pieces: []
    },
    '535': {
      type: 'water',
      pieces: []
    },
    '536': {
      type: 'water',
      pieces: []
    },
    '537': {
      type: 'water',
      pieces: []
    },
    '538': {
      type: 'water',
      pieces: []
    },
    '539': {
      type: 'water',
      pieces: []
    },
    '540': {
      type: 'water',
      pieces: []
    },
    '541': {
      type: 'land',
      pieces: []
    },
    '542': {
      type: 'blue',
      pieces: []
    },
    '543': {
      type: 'land',
      pieces: []
    },
    '544': {
      type: 'land',
      pieces: []
    },
    '545': {
      type: 'land',
      pieces: []
    },
    '546': {
      type: 'land',
      pieces: []
    },
    '547': {
      type: 'water',
      pieces: []
    },
    '548': {
      type: 'water',
      pieces: []
    },
    '549': {
      type: 'water',
      pieces: []
    },
    '550': {
      type: 'water',
      pieces: []
    },
    '551': {
      type: 'water',
      pieces: []
    },
    '552': {
      type: 'water',
      pieces: []
    },
    '553': {
      type: 'water',
      pieces: []
    },
    '554': {
      type: 'water',
      pieces: []
    },
    '555': {
      type: 'water',
      pieces: []
    },
    '556': {
      type: 'water',
      pieces: []
    },
    '557': {
      type: 'water',
      pieces: []
    },
    '558': {
      type: 'water',
      pieces: []
    },
    '559': {
      type: 'land',
      pieces: []
    },
    '560': {
      type: 'land',
      pieces: []
    },
    '561': {
      type: 'land',
      pieces: []
    },
    '562': {
      type: 'land',
      pieces: []
    },
    '563': {
      type: 'land',
      pieces: []
    },
    '564': {
      type: 'land',
      pieces: []
    },
    '565': {
      type: 'water',
      pieces: []
    },
    '566': {
      type: 'water',
      pieces: []
    },
    '567': {
      type: 'water',
      pieces: []
    },
    '568': {
      type: 'water',
      pieces: []
    },
    '569': {
      type: 'water',
      pieces: []
    },
    '570': {
      type: 'water',
      pieces: []
    },
    '571': {
      type: 'land',
      pieces: []
    },
    '572': {
      type: 'water',
      pieces: []
    },
    '573': {
      type: 'water',
      pieces: []
    },
    '574': {
      type: 'water',
      pieces: []
    },
    '575': {
      type: 'water',
      pieces: []
    },
    '576': {
      type: 'land',
      pieces: []
    },
    '577': {
      type: 'land',
      pieces: []
    },
    '578': {
      type: 'land',
      pieces: []
    },
    '579': {
      type: 'land',
      pieces: []
    },
    '580': {
      type: 'water',
      pieces: []
    },
    '581': {
      type: 'water',
      pieces: []
    },
    '582': {
      type: 'water',
      pieces: []
    },
    '583': {
      type: 'water',
      pieces: []
    },
    '584': {
      type: 'water',
      pieces: []
    },
    '585': {
      type: 'water',
      pieces: []
    },
    '586': {
      type: 'water',
      pieces: []
    },
    '587': {
      type: 'land',
      pieces: []
    },
    '588': {
      type: 'land',
      pieces: []
    },
    '589': {
      type: 'water',
      pieces: []
    },
    '590': {
      type: 'water',
      pieces: []
    },
    '591': {
      type: 'water',
      pieces: []
    },
    '592': {
      type: 'water',
      pieces: []
    },
    '593': {
      type: 'water',
      pieces: []
    },
    '594': {
      type: 'land',
      pieces: []
    },
    '595': {
      type: 'land',
      pieces: []
    },
    '596': {
      type: 'land',
      pieces: []
    },
    '597': {
      type: 'water',
      pieces: []
    },
    '598': {
      type: 'water',
      pieces: []
    },
    '599': {
      type: 'water',
      pieces: []
    },
    '600': {
      type: 'water',
      pieces: []
    },
    '601': {
      type: 'water',
      pieces: []
    },
    '602': {
      type: 'water',
      pieces: []
    },
    '603': {
      type: 'water',
      pieces: []
    },
    '604': {
      type: 'land',
      pieces: []
    },
    '605': {
      type: 'land',
      pieces: []
    },
    '606': {
      type: 'land',
      pieces: []
    },
    '607': {
      type: 'water',
      pieces: []
    },
    '608': {
      type: 'water',
      pieces: []
    },
    '609': {
      type: 'water',
      pieces: []
    },
    '610': {
      type: 'water',
      pieces: []
    },
    '611': {
      type: 'land',
      pieces: []
    },
    '612': {
      type: 'land',
      pieces: []
    },
    '613': {
      type: 'land',
      pieces: []
    },
    '614': {
      type: 'water',
      pieces: []
    },
    '615': {
      type: 'water',
      pieces: []
    },
    '616': {
      type: 'water',
      pieces: []
    },
    '617': {
      type: 'missile',
      pieces: []
    },
    '618': {
      type: 'land',
      pieces: []
    },
    '619': {
      type: 'land',
      pieces: []
    },
    '620': {
      type: 'land',
      pieces: []
    },
    '621': {
      type: 'land',
      pieces: []
    },
    '622': {
      type: 'land',
      pieces: []
    },
    '623': {
      type: 'land',
      pieces: []
    },
    '624': {
      type: 'water',
      pieces: []
    },
    '625': {
      type: 'land',
      pieces: []
    },
    '626': {
      type: 'airfield',
      pieces: []
    },
    '627': {
      type: 'water',
      pieces: []
    },
    '628': {
      type: 'water',
      pieces: []
    },
    '629': {
      type: 'water',
      pieces: []
    },
    '630': {
      type: 'missile',
      pieces: []
    },
    '631': {
      type: 'water',
      pieces: []
    },
    '632': {
      type: 'water',
      pieces: []
    },
    '633': {
      type: 'water',
      pieces: []
    },
    '634': {
      type: 'water',
      pieces: []
    },
    '635': {
      type: 'land',
      pieces: []
    },
    '636': {
      type: 'land',
      pieces: []
    },
    '637': {
      type: 'land',
      pieces: []
    },
    '638': {
      type: 'land',
      pieces: []
    },
    '639': {
      type: 'land',
      pieces: []
    },
    '640': {
      type: 'airfield',
      pieces: []
    },
    '641': {
      type: 'land',
      pieces: []
    },
    '642': {
      type: 'land',
      pieces: []
    },
    '643': {
      type: 'land',
      pieces: []
    },
    '644': {
      type: 'land',
      pieces: []
    },
    '645': {
      type: 'water',
      pieces: []
    },
    '646': {
      type: 'water',
      pieces: []
    },
    '647': {
      type: 'water',
      pieces: []
    },
    '648': {
      type: 'water',
      pieces: []
    },
    '649': {
      type: 'water',
      pieces: []
    },
    '650': {
      type: 'water',
      pieces: []
    },
    '651': {
      type: 'water',
      pieces: []
    },
    '652': {
      type: 'land',
      pieces: []
    },
    '653': {
      type: 'land',
      pieces: []
    },
    '654': {
      type: 'land',
      pieces: []
    },
    '655': {
      type: 'land',
      pieces: []
    },
    '656': {
      type: 'land',
      pieces: []
    },
    '657': {
      type: 'land',
      pieces: []
    },
    '658': {
      type: 'land',
      pieces: []
    },
    '659': {
      type: 'land',
      pieces: []
    },
    '660': {
      type: 'land',
      pieces: []
    },
    '661': {
      type: 'land',
      pieces: []
    },
    '662': {
      type: 'land',
      pieces: []
    },
    '663': {
      type: 'water',
      pieces: []
    },
    '664': {
      type: 'water',
      pieces: []
    },
    '665': {
      type: 'water',
      pieces: []
    },
    '666': {
      type: 'water',
      pieces: []
    },
    '667': {
      type: 'water',
      pieces: []
    },
    '668': {
      type: 'water',
      pieces: []
    },
    '669': {
      type: 'land',
      pieces: []
    },
    '670': {
      type: 'blue',
      pieces: []
    },
    '671': {
      type: 'land',
      pieces: []
    },
    '672': {
      type: 'land',
      pieces: []
    },
    '673': {
      type: 'land',
      pieces: []
    },
    '674': {
      type: 'land',
      pieces: []
    },
    '675': {
      type: 'land',
      pieces: []
    },
    '676': {
      type: 'red',
      pieces: []
    },
    '677': {
      type: 'land',
      pieces: []
    },
    '678': {
      type: 'land',
      pieces: []
    },
    '679': {
      type: 'land',
      pieces: []
    },
    '680': {
      type: 'water',
      pieces: []
    },
    '681': {
      type: 'water',
      pieces: []
    },
    '682': {
      type: 'water',
      pieces: []
    },
    '683': {
      type: 'water',
      pieces: []
    },
    '684': {
      type: 'water',
      pieces: []
    },
    '685': {
      type: 'land',
      pieces: []
    },
    '686': {
      type: 'land',
      pieces: []
    },
    '687': {
      type: 'land',
      pieces: []
    },
    '688': {
      type: 'land',
      pieces: []
    },
    '689': {
      type: 'land',
      pieces: []
    },
    '690': {
      type: 'land',
      pieces: []
    },
    '691': {
      type: 'land',
      pieces: []
    },
    '692': {
      type: 'land',
      pieces: []
    },
    '693': {
      type: 'land',
      pieces: []
    },
    '694': {
      type: 'land',
      pieces: []
    },
    '695': {
      type: 'land',
      pieces: []
    },
    '696': {
      type: 'land',
      pieces: []
    },
    '697': {
      type: 'water',
      pieces: []
    },
    '698': {
      type: 'water',
      pieces: []
    },
    '699': {
      type: 'water',
      pieces: []
    },
    '700': {
      type: 'water',
      pieces: []
    },
    '701': {
      type: 'water',
      pieces: []
    },
    '702': {
      type: 'land',
      pieces: []
    },
    '703': {
      type: 'land',
      pieces: []
    },
    '704': {
      type: 'land',
      pieces: []
    },
    '705': {
      type: 'land',
      pieces: []
    },
    '706': {
      type: 'land',
      pieces: []
    },
    '707': {
      type: 'land',
      pieces: []
    },
    '708': {
      type: 'blue',
      pieces: []
    },
    '709': {
      type: 'land',
      pieces: []
    },
    '710': {
      type: 'land',
      pieces: []
    },
    '711': {
      type: 'land',
      pieces: []
    },
    '712': {
      type: 'land',
      pieces: []
    },
    '713': {
      type: 'water',
      pieces: []
    },
    '714': {
      type: 'water',
      pieces: []
    },
    '715': {
      type: 'water',
      pieces: []
    },
    '716': {
      type: 'water',
      pieces: []
    },
    '717': {
      type: 'water',
      pieces: []
    },
    '718': {
      type: 'water',
      pieces: []
    },
    '719': {
      type: 'water',
      pieces: []
    },
    '720': {
      type: 'land',
      pieces: []
    },
    '721': {
      type: 'airfield',
      pieces: []
    },
    '722': {
      type: 'land',
      pieces: []
    },
    '723': {
      type: 'land',
      pieces: []
    },
    '724': {
      type: 'land',
      pieces: []
    },
    '725': {
      type: 'land',
      pieces: []
    },
    '726': {
      type: 'land',
      pieces: []
    }
  };
