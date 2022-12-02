// actions.js
// ============================================================================
// ============================================================================

//////////////////
// MENU ACTIONS //
//////////////////
function setActiveMenu(menu) {
	state.menus.active = menu;
	renderMenus();
}

/////////////////
// HUD ACTIONS //
/////////////////
function setLvlScore(score) {
	state.game.lvlScore = score;
	renderScoreHud();
}

function setTotalScore(score) {
	state.game.totalScore = score;
	renderScoreHud();
}

function changeScore(delta) {
	if (isInGame()) {
		state.game.lvlScore += delta;
		if (state.game.lvlScore < 0) {
			state.game.lvlScore = 0;
		}
		renderScoreHud();
	}
}

function setLevel(level) {
	state.game.level = level;
}

//////////////////
// GAME ACTIONS //
//////////////////
function resetGame() {
	state.game.time = 0;
	for (var member in state.game.correctAns) delete state.game.correctAns[member];
	clearInterval(intervalId);
	setLevel(0);
	setLvlScore(0);
	setTotalScore(0);
	renderScoreHud();
	$(".duplicates").innerHTML = "<h2>You have found these isomers</h2>";
}

function pauseGame() {
	clearInterval(intervalId);
	isInGame() && setActiveMenu(MENU_PAUSE);
}

function resumeGame() {
	isPaused() && setActiveMenu(null);
}

function endLevel() {
	levelScoreLblNode.innerText = formatNumber(state.game.lvlScore);
	setActiveMenu(MENU_NEXT);
	setLevel(state.game.level + 1);
	$(".duplicates").innerHTML = "<h2>You have found these isomers</h2>";
	clearInterval(intervalId);
	for (var member in state.game.correctAns) delete state.game.correctAns[member];
	localStorage.setItem(curLvlKey, state.game.level);
	localStorage.setItem(curScoreKey, state.game.totalScore);
	setLvlScore(0);
}

function endGame() {
	$(".final-score-lbl").innerText = formatNumber(state.game.lvlScore);
	setActiveMenu(MENU_OVER);
	clearInterval(intervalId);
	for (var member in state.game.correctAns) delete state.game.correctAns[member];
	$(".duplicates").innerHTML = "<h2>You have found these isomers</h2>";
	localStorage.setItem(curLvlKey, 0);
	localStorage.setItem(curLvlScore, 0);
}



//////////////////
//      API     //
//////////////////

async function postData(url = "", data = {}) {
	await fetch(url, {
		method: "POST",
		mode: "cors",
		cache: "no-cache",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json",
		},
		referrerPolicy: "no-referrer",
		body: JSON.stringify(data),
	});

	return data;
}

async function getData(url = "") {
	const response = await fetch(url, {
		method: "GET",
		mode: "cors",
		cache: "no-cache",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json",
		},
		referrerPolicy: "no-referrer",
	});

	return response.json();
}

const checkOneMol = async () => {
	let correct = false;
	let notDup = false;
	const molBlock = getMolBlockStr(sketcher);

	await postData(endPoint + "/game_input", {
		molBlock: molBlock,
		level: state.game.level,
		correctAns: state.game.correctAns,
	})
		.then(async (data) => {
			console.log(data);

			await getData(endPoint + "/single_result").then((response) => {
				correct = response["correct"];
				notDup = response["notDup"];
				const isomerName = response["isomer"];
				state.game.correctAns = response["correctAns"];

				console.log(response);

				if (correct && notDup) {
					changeScore(levels[state.game.level].molScore);
					displayCorrectAns(data["molBlock"], isomerName);
					clearCanvas();
					correctSound.play();
					getMolAlert(correctIcon, CORRECT);
				} else if (!notDup) {
					changeScore(-dupDeduct);
					wrongDupSound.play();
					getMolAlert(duplicateIcon, DUPLICATED);
				} else {
					changeScore(-incorrectDeduct);
					wrongDupSound.play();
					getMolAlert(wrongIcon, INCORRECT);
				}
			});
		})
		.catch((e) => {
			console.log(e);
		});
};

const checkMolAndLvl = async () => {
	const molBlock = getMolBlockStr(sketcher);

	postData(endPoint + "/game_input", {
		molBlock: molBlock,
		level: state.game.level,
		correctAns: state.game.correctAns,
	})
		.then((data) => {
			console.log(data);

			getData(endPoint + "/level_result").then((response) => {
				let foundAll = response["foundAll"];
				let notDup = response["notDup"];
				let correct = response["correct"];

				console.log(response);
				if (correct && notDup)
					changeScore(levels[state.game.level].molScore);

				// assuming that for every 10 seconds early, add [bonusRate] points
				const timeEarly =
					levels[state.game.level].maxTime - state.game.time;
				state.game.totalScore +=
					state.game.lvlScore +
					(timeEarly > 0
						? parseInt(timeEarly / 10, 10) * bonusRate
						: 0);

				if (foundAll) {
					clearInterval(intervalId);
					clearCanvas();
					if (state.game.level == 7) {
						endGame();
					} else {
						endLevel();
					}
				} else {
					wrongDupSound.play();
					getMolAlert(unfinishIcon, UNFINISHED);
				}
			});
		})
		.catch((e) => {
			console.log(e);
		});
};