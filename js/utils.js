/////////
// DOM //
/////////

const $ = (selector) => document.querySelector(selector);
const handleClick = (element, handler) =>
	element.addEventListener("click", handler);
const handlePointerDown = (element, handler) => {
	element.addEventListener("touchstart", handler);
	element.addEventListener("mousedown", handler);
};

////////////////////////
// Formatting Helpers //
////////////////////////

// Converts a number into a formatted string with thousand separators.
const formatNumber = (num) => num.toLocaleString();

// hud.js
// ============================================================================
// ============================================================================

const hudContainerNode = $(".hud");

function setHudVisibility(visible) {
	const gameNode = $(".game");
	if (visible) {
		hudContainerNode.style.display = "flex";
		gameNode.classList.add("active");
		renderTimeHud();
	} else {
		hudContainerNode.style.display = "none";
		gameNode.classList.remove("active");
	}
}

////////////
//  Time  //
////////////
const timerNode = $(".timer");
var intervalId;
function renderTimeHud() {
	function pad(value) {
		return value > 9 ? value : "0" + value;
	}
	intervalId = setInterval(() => {
		const seconds = pad(++state.game.time % 60);
		timerNode.innerText = `0:${pad(
			parseInt(state.game.time / 60, 10)
		)}:${seconds}`;
	}, 1000);
}

const bonusNodeNext = $(".time-bonus--next");
const bonusNodeOver = $(".time-bonus--over");
var bonusIntervalId;
function renderBonusEffect(timeNode, totalScoreNode) {
	function pad(value) {
		return value > 9 ? value : "0" + value;
	}
	const countingUpRate = 5;
	bonusIntervalId = setInterval(() => {
		if (state.game.time < levels[state.game.level].maxTime) {
			timeUpSound.play();
			const seconds = pad(++state.game.time % 60);
			timeNode.innerText = `0:${pad(
				parseInt(state.game.time / 60, 10)
			)}:${seconds}`;
		} else {
			timeUpSound.pause();
			totalScoreNode.innerText = formatNumber(state.game.totalScore);
			state.game.time = 0;
			bonusSound.play();
			if (isNewHighScore()) {
				highScoreLblNode.textContent = "New High Score!";
				setHighScore(state.game.totalScore);
				localStorage.setItem(highScoreKey, state.game.totalScore);
			} else {
				highScoreLblNode.textContent = `High Score: ${formatNumber(
					getLocalStorage(highScoreKey)
				)}`;
			}
			clearInterval(bonusIntervalId);
		}
	}, countingUpRate);
}

const formatTargetTime = (timeInSecs) => {
	const minutes = parseInt(timeInSecs/60)
	const seconds = parseInt(timeInSecs%60)
	return `${minutes} mins ${seconds ? `${seconds} secs` : ""}` 
}

///////////
// Score //
///////////
const levelNode = $(".level");
const scoreNode = $(".level-score");

function renderScoreHud() {
	levelNode.innerHTML = `LEVEL ${state.game.level + 1}: ${
		levels[state.game.level].name
	}`;
	scoreNode.style.display = "block";
	scoreNode.style.opacity = 0.85;
	console.log(state.game);
	scoreNode.innerText = `SCORE: ${
		state.game.totalScore + state.game.lvlScore
	}`;
}

///////////
// Check //
///////////
const wrongIcon = $("#icon-wrong");
const correctIcon = $("#icon-correct");
const duplicateIcon = $("#icon-duplicate");
const unfinishIcon = $("#icon-unfinish");
const checkMessageNode = $(".alert");

const getMolAlert = (iconNode, alertMessage) => {
	iconNode.classList.add("active");
	checkMessageNode.innerText = alertMessage;
	checkMessageNode.classList.add("active");

	setTimeout(() => {
		iconNode.classList.remove("active");
		checkMessageNode.classList.remove("active");
	}, 1500);
};

///////////
// Sound //
///////////
$("#bg-music").src = "./js/bg-music/bgMusic.wav"
$("#bg-music").muted = false;
const soundBtnNode = $(".sound-control");
function renderSoundIcon() {
	soundBtnNode.innerHTML = state.sound ? soundOn : soundOff;
}
renderSoundIcon();

const bonusSound = new Audio("./js/bg-music/bonusPoint.mp3");
const correctSound = new Audio("./js/bg-music/correctAns.mp3");
const timeUpSound = new Audio("./js/bg-music/rackingUpBonus.mp3");
const wrongDupSound = new Audio("./js/bg-music/wrongDupAns.mp3");

//////////////////
// Pause Button //
//////////////////

handlePointerDown($(".pause-btn"), () => pauseGame());

// menus.js
// ============================================================================
// ============================================================================

// Top-level menu containers
const menuContainerNode = $(".menus");
const menuMainNode = $(".menu--main");
const menuPauseNode = $(".menu--pause");
const menuOverNode = $(".menu--over");
const menuNextNode = $(".menu--next");
const tutorialNodeMain = $(".menu--tutorial-main");
const tutorialNodePause = $(".menu--tutorial-pause");

const highScoreMainNode = $(".high-score-lbl--main");
const finalScoreLblNode = $(".final-score-lbl");
const highScoreLblNode = $(".high-score-lbl");
const levelScoreLblNode = $(".level-score-lbl");

function showMenu(node) {
	node.classList.add("active");
}

function hideMenu(node) {
	node.classList.remove("active");
}

function renderMenus() {
	hideMenu(menuMainNode);
	hideMenu(menuPauseNode);
	hideMenu(menuOverNode);
	hideMenu(menuNextNode);
	hideMenu(tutorialNodeMain);
	hideMenu(tutorialNodePause);

	switch (state.menus.active) {
		case MENU_MAIN:
			highScoreMainNode.innerText = getLocalStorage(highScoreKey);
			showMenu(menuMainNode);
			break;
		case MENU_PAUSE:
			showMenu(menuPauseNode);
			break;
		case MENU_OVER:
			showMenu(menuOverNode);
			renderBonusEffect(bonusNodeOver, finalScoreLblNode);
			break;
		case MENU_NEXT:
			showMenu(menuNextNode);
			renderBonusEffect(bonusNodeNext, levelScoreLblNode);
			break;
		case MENU_TUTORIAL_MAIN:
			showMenu(tutorialNodeMain);
			break;
		case MENU_TUTORIAL_PAUSE:
			showMenu(tutorialNodePause);
			break;
	}

	setHudVisibility(!isMenuVisible());
	menuContainerNode.classList.toggle("has-active", isMenuVisible());
	menuContainerNode.classList.toggle(
		"interactive-mode",
		isMenuVisible() && pointerIsDown
	);
}

renderMenus();

////////////////////
// Button Actions //
////////////////////
const startGameLvl1 = () => {
	$(".target-time").innerText = `Target time: ${formatTargetTime(levels[state.game.level].maxTime)}`
	clearInterval(intervalId);
	$(".duplicates").innerHTML = "<h2>You have found these isomers</h2>";
	$(".timer").innerText = "0:00:00";
	resetGame();
	setLevel(0);
	setActiveMenu(null);
};

const startLvl = () => {
	$(".target-time").innerText = `Target time: ${formatTargetTime(levels[state.game.level].maxTime)}`
	$(".duplicates").innerHTML = "<h2>You have found these isomers</h2>";
	clearInterval(intervalId);
	$(".timer").innerText = "0:00:00";
	setLevel(getLocalStorage(curLvlKey));
	setTotalScore(getLocalStorage(curScoreKey));
	setActiveMenu(null);
};

// Sound Control
const soundBtn = $(".sound-control");
const bgMusicNode = $("#bg-music");
bgMusicNode.volume = 0.2;
handleClick(soundBtn, () => {
	state.sound = !state.sound;
	bgMusicNode.muted = !bgMusicNode.muted;
	renderSoundIcon();
});

// Main Menu
handleClick($(".start-btn"), startGameLvl1);

handleClick($(".cont-btn"), startLvl);

handleClick($(".tutorial-btn--main"), () => {
	setActiveMenu(MENU_TUTORIAL_MAIN);
});

// Pause Menu
handleClick($(".resume-btn"), () => resumeGame());
handleClick($(".restart-btn"), startGameLvl1);
handleClick($(".menu-btn--pause"), () => setActiveMenu(MENU_MAIN));
handleClick($(".tutorial-btn--pause"), () =>
	setActiveMenu(MENU_TUTORIAL_PAUSE)
);

// Game Over Menu
handleClick($(".play-again-btn"), startGameLvl1);
handleClick($(".menu-btn--over"), () => setActiveMenu(MENU_MAIN));

// Next Level Menu
handleClick($(".next-level-btn"), startLvl);
handleClick($(".menu-btn--next"), () => setActiveMenu(MENU_MAIN));

// Tutorial
handleClick($(".close-tutorial-btn--main"), () => {
	setActiveMenu(MENU_MAIN);
});
handleClick($(".close-tutorial-btn--pause"), () => {
	setActiveMenu(MENU_PAUSE);
});


// Game Buttons
handleClick($("#check-single"), checkOneMol);
handleClick($("#check-level"), checkMolAndLvl);

////////////////////////
// KEYBOARD SHORTCUTS //
////////////////////////
window.addEventListener("keydown", (event) => {
	if (event.key === "p") {
		isPaused() ? resumeGame() : pauseGame();
	}
});

window.addEventListener("keypress", async (event) => {
	if (event.key === "Enter" && !isPaused()) {
		await checkOneMol();
	}
});