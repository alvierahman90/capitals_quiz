"use strict";

var question_list = null;
const capitals_list = Object.values(countries).map(country => country.capital);
const regionList = [...new Set(Object.values(countries).map(country => country.region))]
	.concat([...new Set(Object.values(countries).map(country => country.subregion))]);
const date = new Date();
var selectorMatches = []

const answersHTML = document.getElementById('answers');
const answerAHTML = document.getElementById('answer_a');
const answerBHTML = document.getElementById('answer_b');
const answerCHTML = document.getElementById('answer_c');
const answerDHTML = document.getElementById('answer_d');
const bodyHTML = document.getElementsByTagName('body')[0]
const scoreHTML = document.getElementById('score');
const settingsHTML = document.getElementById('settings');
const selectorHTML = document.getElementById('region_selector');
const selectorResultsHTML = document.getElementById('selector_results');
const questionHTML = document.getElementById('question');

var state = {
	"score": 0,
	"max_score": 0,
	"start_time": 0,
	"end_time": 0,
	"finishedGame": true,
};

function init() {
	// reset states list, score, end_time; start timer for game;
	var regex;
	if (selectorHTML.value === "") {
		regex = new RegExp(".*");
	} else {
		regex = new RegExp(selectorHTML.value, 'gi');
	}
	question_list = Object.keys(countries)
		.filter(c => countries[c].region.match(regex) || countries[c].subregion.match(regex))
		.sort(() => Math.random()-0.5);
	state.maxScore = question_list.length;
	answersHTML.style.display = "";
	settingsHTML.style.display = "none";
	state.finishedGame = false;
	state.score = 0;
	state.end_time = 0;
	state.start_time = date.getTime();
	questionHTML.onclick = deinit;
	updateState();
	updateScreen();
}

function deinit() {
	answersHTML.style.display = "none";
	settingsHTML.style.display = "";
	questionHTML.innerHTML = "tap here or press enter to start";
	questionHTML.onclick = init;
	scoreHTML.innerHTML = "score";
}

function updateState() {
	// check if game is over
	if (question_list.length == 0) { state.finishedGame = true; return; }

	// set up new question
	console.log(1);
	var newQuestion = question_list.pop();
	console.log(newQuestion);
	console.log(2);
	var options = []
	while (options.length < 4) {
		var c = capitals_list[Math.floor(Math.random()*capitals_list.length)];
		if (c !== countries[newQuestion].capital && !options.includes(c)){
			options.push(c);
		}
	}
	console.log(options)
	options[Math.floor(Math.random()*4)] = countries[newQuestion].capital;
	console.log(options)

	state.question = newQuestion;
	state.options = options;
	state.answer = countries[newQuestion].capital;
}

function updateScreen(){
	scoreHTML.innerHTML = state.score + "/" + state.maxScore;
	if (state.finishedGame) {
		questionHTML.innerHTML = "you finishedeededede!!! tap here or press space to restart";
		answers.style.display = "none";
		return;
	}
	answerAHTML.getElementsByClassName('text')[0].innerHTML = state.options[0];
	answerBHTML.getElementsByClassName('text')[0].innerHTML = state.options[1];
	answerCHTML.getElementsByClassName('text')[0].innerHTML = state.options[2];
	answerDHTML.getElementsByClassName('text')[0].innerHTML = state.options[3];
	questionHTML.innerHTML = "what is the capital of <span id=\"questionCountry\">" + state.question + "</span>?";
}

function processClick(answer) {
	console.log("got click: " + answer);
	if (state.finishedGame) return;
	console.log(1);
	// check if answer to previous question  was correct
	state.score += 1 ? state.options[answer] == state.answer : 0;
	console.log(state.options[answer] == state.answer ? 'correct' : 'incorrect')
	bodyHTML.classList.add(state.options[answer] == state.answer ? 'correct' : 'incorrect')
	setTimeout(() => bodyHTML.classList = [], 500)

	console.log("got click: " + answer);
	updateState();
	updateScreen();
}


function setSelectorMatches(value){
	const regex = new RegExp(selectorHTML.value, 'gi');
	selectorMatches = regionList
			.filter(region => region.match(regex))
	displaySelectorMatches();
}

function displaySelectorMatches(){
	selectorResultsHTML.innerHTML = selectorMatches
		.map(region => {
			return `<div class="selector_result" onclick="setSelectorValue('${region}')"> ${region} </div>`
		})
		.join('');
}

function setSelectorValue(value) {
	selectorHTML.value = value;
}

answerAHTML.addEventListener('click', () => processClick(0));
answerBHTML.addEventListener('click', () => processClick(1));
answerCHTML.addEventListener('click', () => processClick(2));
answerDHTML.addEventListener('click', () => processClick(3));
document.addEventListener('keyup', e => {
	if (e.code == "Digit1") processClick(0);
	if (e.code == "Digit2") processClick(1);
	if (e.code == "Digit3") processClick(2);
	if (e.code == "Digit4") processClick(3);
	if (e.code == "Enter" && document.activeElement !== selectorHTML) init();
});

selectorHTML.addEventListener('change', setSelectorMatches);
selectorHTML.addEventListener('keyup', e => {
	console.log(e.code);
	var topResult = document.getElementsByClassName('selector_result')[0]
	if (e.code == "Enter" && selectorHTML.value === "") {
		init();
		return;
	}
	if (e.code == "Enter" && selectorHTML.value === topResult.innerHTML.trim()) {
		init();
		return;
	}
	if (e.code == "Enter")
		selectorHTML.value = topResult.innerHTML.trim();

	setSelectorMatches();
});

deinit();
selectorHTML.focus();
setSelectorMatches();
