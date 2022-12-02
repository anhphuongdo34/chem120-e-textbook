///////////////////
// Local Storage //
///////////////////

export const highScoreKey = "__highScore";
export const curLvlKey = "__curLvl";
export const curScoreKey = "__curScore";

export const getLocalStorage = (key) => {
	const raw = localStorage.getItem(key);
	return raw ? parseInt(raw, 10) : 0;
};

export const setHighScore = (score) => {
	localStorage.setItem(highScoreKey, String(score));
};

export const isNewHighScore = () =>
	state.game.totalScore > getLocalStorage(highScoreKey);

///////////
// Enums //
///////////

// Available Menus
export const MENU_MAIN = Symbol("MENU_MAIN");
export const MENU_PAUSE = Symbol("MENU_PAUSE");
export const MENU_OVER = Symbol("MENU_OVER");
export const MENU_NEXT = Symbol("MENU_NEXT");
export const MENU_TUTORIAL_PAUSE = Symbol("MENU_TUTORIAL_PAUSE");
export const MENU_TUTORIAL_MAIN = Symbol("MENU_TUTORIAL_MAIN");

// Answer Check
export const CORRECT = "Correct!";
export const INCORRECT = "Incorrect!";
export const DUPLICATED = "Duplicated!";
export const UNFINISHED = "Incomplete.\nKeep trying!";

///////////
// Icons //
///////////
export const soundOn =
	"<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' fill='white' viewBox='0 0 16 16'><path d='M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z'/><path d='M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z'/><path d='M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z'/></svg>";
export const soundOff =
	"<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' fill='white' class='bi bi-volume-mute-fill' viewBox='0 0 16 16'><path d='M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z'/></svg>";

//////////////////
// Global State //
//////////////////

export const state = {
	game: {
		level: 0,
		// Run time of current game.
		time: 0,
		// List of the correct answers so far
		correctAns: {},
		// Score of the current level
		lvlScore: 0,
		// Score of all level
		totalScore: 0,
	},
	menus: {
		// Set to `null` to hide all menus
		active: MENU_MAIN,
	},
	sound: true,
};

////////////////////////////
// Global State Selectors //
////////////////////////////

export const isInGame = () => !state.menus.active;
export const isMenuVisible = () => !!state.menus.active;
export const isPaused = () => state.menus.active === MENU_PAUSE;
