const pool = require("../database");

// prettier-ignore
//TODO: better news table = cleaner functions here
const news = (gameId, newsOrder, newsOptions) => {
	// const newsTeam = newsOptions.newsTeam == undefined ? -1 : newsOptions.newsTeam;
	// const newsPieces = newsOptions.newsPieces == undefined ? -1 : newsOptions.newsPieces;
	// const newsEffect = newsOptions.newsEffect == undefined ? -1 : newsOptions.newsEffect;
	// const newsRoll = newsOptions.newsRoll == undefined ? -1 : newsOptions.newsRoll;
	// const newsLength = newsOptions.newsLength == undefined ? -1 : newsOptions.newsLength;
	// const newsZone = newsOptions.newsZone == undefined ? -1 : newsOptions.newsZone;
	const newsTitle = newsOptions.newsTitle == undefined ? "Default Title" : newsOptions.newsTitle;
	const newsInfo = newsOptions.newsInfo == undefined ? "Default Info" : newsOptions.newsInfo;
	// const newsActivated = newsOptions.newsActivated == undefined ? 0 : newsOptions.newsActivated;

	// return [gameId, newsTeam, newsOrder, newsPieces, newsEffect, newsRoll, newsLength, newsZone, newsTitle, newsInfo, newsActivated];
	return [gameId, newsOrder, newsTitle, newsInfo];
};

const gameInitialNews = async gameId => {
	let newsOrder = 0;

	const allInserts = [
		news(gameId, newsOrder++, {
			newsTitle: "Apollo, Oh No! Solar Flare causes disruption.",
			newsInfo: "Rising coronal activity sends large amounts of radioation earthbound knocking out satellite systems."
		}),
		news(gameId, newsOrder++, {
			newsTitle: "Typhoon Lagoon",
			newsInfo: "Due to intense global warming, rising amounts of rainfall cause typhoon to strike northeast region"
		}),
		news(gameId, newsOrder++, {
			newsTitle: "Tsunami!",
			newsInfo: "Underwater earthquake causes gigantic 250 f oot wave to cascase over island. Surfers rush to area. "
		}),
		news(gameId, newsOrder++, {
			newsTitle: "April Showers Bring... Terror?",
			newsInfo: "Government misuse of GDP leads to lack of goods in stores, violent uprisings ensue."
		}),
		news(gameId, newsOrder++, {
			newsTitle: "Who Put Coke in the JP-8?",
			newsInfo: "Airfields are shut down until the contaiminated JP-8 can be replaced."
		}),
		news(gameId, newsOrder++, {
			newsTitle: "Contanminated Water!",
			newsInfo: "Desalinization plant malfunctions, leading to sewage system rerouted as potable water"
		}),
		news(gameId, newsOrder++, {
			newsTitle: '"Have You Seen My Wrench?"',
			newsInfo: "Incorrect parts issued to helicopter maintainers"
		}),
		news(gameId, newsOrder++, {
			newsTitle: "Diphtheria Oubreak",
			newsInfo: "Outbreak of disease leads to death of a least 30 people, with death toll rapidly rising. Please vaccinate your children.  "
		}),
		news(gameId, newsOrder++, {
			newsTitle: "***Breaking***",
			newsInfo: "Island is rapidly sinking. Please evacuate island as soon as possible, take only essentials. Outside sources claim this is fake news."
		}),
		news(gameId, newsOrder++, {
			newsTitle: "Volcanic Erupion",
			newsInfo:
				"Locals claim Dura, god of the sea is angry, causing erruption of large volcano. Scientist counter this claim, citing years of research. Please see pg 5 for references."
		}),
		news(gameId, newsOrder++, {
			newsTitle: "O2 System Failure",
			newsInfo: "Due to logistics oversight, plastic cone adaptor needed for compatability were not purchased to replace failing parts."
		}),
		news(gameId, newsOrder++, {
			newsTitle: "***Breaking***",
			newsInfo: "Following other seismic activity in the region, massive earthquake hits capital. Geologists warn of possible aftershocks due to unstable tetonic plates."
		}),
		news(gameId, newsOrder++, {
			newsTitle: "Military Coup",
			newsInfo:
				'Continued "poor" decisions by top brass lead to subordinate members taking matters into their own hands, engaging in military coup. Quotes from rebel leaders include, "It\'s an infantry run island, they said." "We\'re here for you, they said."'
		}),
		news(gameId, newsOrder++, {
			newsTitle: "Hurrican Kristin",
			newsInfo: "Not-so-tropical depression sweeps area, all resources turned to relief efforts."
		}),
		news(gameId, newsOrder++, {
			newsTitle: "Economic Recession Sweeps Region",
			newsInfo: "Failth in Cryptocurrency over traditional assets proved to be misplaced. Markets crash, chaos ensues."
		}),
		news(gameId, newsOrder++, {
			newsTitle: "From the STEM Column:",
			newsInfo: "Breakthrough in research and development on tank tracks greatly improves overall mobility of vehicle."
		}),
		news(gameId, newsOrder++, {
			newsTitle: 'Is This the New "Military Amazon"?',
			newsInfo: "Parts distribution center built on island to increase availabilty of equipment"
		}),
		news(gameId, newsOrder++, {
			newsTitle: "You've Heard of Bitcoin, But Have You Heard of RushCoin?",
			newsInfo: "New regional cryptocurrency has as strong spike during the month of April"
		}),
		news(gameId, newsOrder++, {
			newsTitle: "The Strike of Beep-Net",
			newsInfo: "Buggy update for maritime radar system prematurely released to entire naval force, creates uncertainty of current detection protocol capability."
		})
	];

	const queryString = "INSERT INTO news (newsGameId, newsOrder, newsTitle, newsInfo) VALUES ?";
	const inserts = [allInserts];
	await pool.query(queryString, inserts);
};

module.exports = gameInitialNews;
