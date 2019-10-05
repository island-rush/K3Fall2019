// prettier-ignore
const news = (gameId, newsOrder, newsOptions) => {
	const newsTeam = newsOptions.newsTeam == undefined ? -1 : newsOptions.newsTeam;
	const newsPieces = newsOptions.newsPieces == undefined ? -1 : newsOptions.newsPieces;
	const newsEffect = newsOptions.newsEffect == undefined ? -1 : newsOptions.newsEffect;
	const newsRoll = newsOptions.newsRoll == undefined ? -1 : newsOptions.newsRoll;
	const newsLength = newsOptions.newsLength == undefined ? -1 : newsOptions.newsLength;
	const newsZone = newsOptions.newsZone == undefined ? -1 : newsOptions.newsZone;
	const newsTitle = newsOptions.newsTitle == undefined ? "Default Title" : newsOptions.newsTitle;
	const newsInfo = newsOptions.newsInfo == undefined ? "Default Info" : newsOptions.newsInfo;
	const newsActivated = newsOptions.newsActivated == undefined ? 0 : newsOptions.newsActivated;

	return [gameId, newsTeam, newsOrder, newsPieces, newsEffect, newsRoll, newsLength, newsZone, newsTitle, newsInfo, newsActivated];
};

const gameInitialNews = async (conn, gameId) => {
	let newsOrder = 0;

	const allInserts = [
		news(gameId, newsOrder++, {
			newsTitle: "Title 1",
			newsInfo: "Info 1",
			newsActivated: 1
		}),
		news(gameId, newsOrder++, {
			newsTitle: "Title 2",
			newsInfo: "Info 2"
		}),
		news(gameId, newsOrder++, {
			newsTitle: "Title 3",
			newsInfo: "Info 3"
		})
	];

	const queryString = "INSERT INTO news (newsGameId, newsTeam, newsOrder, newsPieces, newsEffect, newsRoll, newsLength, newsZone, newsTitle, newsInfo, newsActivated) VALUES ?";
	const inserts = [allInserts];
	await conn.query(queryString, inserts);
};

module.exports = gameInitialNews;
