"use strict";

var question_list = null;
const capitals_list = Object.values(capitals);
const date = new Date();
var state = {"score": 0, "start_time": 0, "end_time": 0, "finishedGame": true};

var answersHTML = document.getElementById('answers');
var answerAHTML = document.getElementById('answer_a');
var answerBHTML = document.getElementById('answer_b');
var answerCHTML = document.getElementById('answer_c');
var answerDHTML = document.getElementById('answer_d');
var scoreHTML = document.getElementById('score');
var questionHTML = document.getElementById('question');

function init() {
	// reset states list, score, end_time; start timer for game;
	question_list = Object.keys(capitals).sort(() => Math.random()-0.5);
	answersHTML.style.display = "";
	state.finishedGame = false;
	state.score = 0;
	state.end_time = 0;
	state.start_time = date.getTime();
	updateState();
	updateScreen();
}

function updateState() {
	// check if game is over
	if (question_list.length == 0) {
		state.finishedGame = true;
		return;
	}

	// set up new question
	var newQuestion = question_list.pop();
	var options = []
	while (options.length < 4) {
		var c = capitals_list[Math.floor(Math.random()*capitals_list.length)];
		if (c !== capitals[newQuestion] && !options.includes(c)){
			options.push(c);
		}
	}
	console.log(options)
	options[Math.floor(Math.random()*4)] = capitals[newQuestion];
	console.log(options)

	state.question = newQuestion;
	state.options = options;
	state.answer = capitals[newQuestion];
}

function updateScreen(){
	scoreHTML.innerHTML = state.score;
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
	// check if answer to previous question  was correct
	state.score += 1 ? state.options[answer] == state.answer : 0;

	console.log("got click: " + answer);
	updateState();
	updateScreen();
}

answerAHTML.addEventListener('click', () => processClick(0));
answerBHTML.addEventListener('click', () => processClick(1));
answerCHTML.addEventListener('click', () => processClick(2));
answerDHTML.addEventListener('click', () => processClick(3));
questionHTML.addEventListener('click', () => init());
document.addEventListener('keydown', e => {
	if (e.code == "Digit1") processClick(0);
	if (e.code == "Digit2") processClick(1);
	if (e.code == "Digit3") processClick(2);
	if (e.code == "Digit4") processClick(3);
	if (e.code == "Space") init();
});
