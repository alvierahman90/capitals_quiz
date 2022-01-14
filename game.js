"use strict";

const ALL_REGIONS = "All Regions";
const FLAG_DIR = "flags";

const answersHTML = document.getElementById("answers");
const answerAHTML = document.getElementById("answer_a");
const answerBHTML = document.getElementById("answer_b");
const answerCHTML = document.getElementById("answer_c");
const answerDHTML = document.getElementById("answer_d");
const bodyHTML = document.getElementsByTagName("body")[0]
const incorrectAnswersTable = document.getElementById('incorrectAnswersTable');
const correctAnswersTable = document.getElementById('correctAnswersTable');
const previousQuestionAnswer = document.getElementById('previousQuestionAnswer');
const previousQuestionText = document.getElementById('previousQuestionText');
const regionListHTML = document.getElementById("regionList");
const resultsHTML = document.getElementById("results");
const scoreHTML = document.getElementById("score");
const settingsHTML = document.getElementById("settings");
const questionHTML = document.getElementById("question");
const timeHTML = document.getElementById("time");

var gameTimeStartTime = 0;
var gameTimeIntervalId = 0;
var selectedRegion = null;

const guessCapital = () => document.getElementById('questionTypeCapital').checked;
const guessCountry = () => document.getElementById('questionTypeCountry').checked;
const guessFlag = () => document.getElementById('questionTypeFlag').checked;
const guessReverseFlag = () => document.getElementById('questionTypeReverseFlag').checked;

const updateTime = () => {
    const secondsPassed = ((new Date().getTime() - gameTimeStartTime.getTime())/1000)
        .toFixed(3);
    timeHTML.innerHTML = secondsPassed;
}

const getMasterQuestionList = () => {
  if(guessCountry()) return capitals
  return countries;
}

const getQuestionHTML = (state) => {
  if(guessCountry())
    return `what country is <span id="questionCapital">${state.question.capital}</span> the capital of?`
  if (guessCapital())
    return `what is the capital of <span id="questionCountry">${state.question.countryname}</span>?`
  if(guessFlag())
    return `what is the flag of <span id="questionCountry">${state.question.countryname}</span>?`
  if(guessReverseFlag())
    return `which country's flag is ${getImageURLFromCountryCode(state.question.code)}?`
}

const answer_list = () => {
  return Object.values(getMasterQuestionList());
}

const getImageURLFromCountryCode = (code) => `<img src="${FLAG_DIR}/${code}.svg" />`;


const regionList = () => [...new Set(Object.values(getMasterQuestionList()).map(item => item.region))]
    .concat([...new Set(Object.values(getMasterQuestionList()).map(item => item.subregion))])
    .concat([ALL_REGIONS])
    .sort();
const date = new Date();

var questionList, state;

var resultsChart = new Chart(
	document.getElementById('resultsChart'),
	{
		type: 'doughnut',
		data: {
			labels: [],
			datasets: [
				{
					labels: [],
					data: [],
					backgroundColor: [
						"#a1b56c",
						"#ab4642",
					]

				}
			]
		},
		options: {}
	}
);


// set up game
function init() {
    // generate question list
    questionList = Object.values(getMasterQuestionList())
        .filter(q => q.region == selectedRegion || q.subregion == selectedRegion || selectedRegion == ALL_REGIONS)
        .sort(() => Math.random()-0.5);

    // set up state variable
    state.endTime = 0;
    state.finishedGame = false;
    state.startedGame = true;
    state.maxScore = questionList.length;
    state.score = 0;
    state.startTime = date.getTime();
    state.correctAnswers = [];
    state.incorrectAnswers = [];
    state.userAnswer = null;

    // show and hide appropriate elements
    answersHTML.style.display = "";
    settingsHTML.style.display = "none";
    questionHTML.onclick = deinit;
    incorrectAnswersTable.innerHTML = "<tr> <th> question </th> <th> answer </th> <th> your answer </th> </tr>";
    correctAnswersTable.innerHTML = "<tr> <th> country </th> <th> capital </th>  </tr>";

    // start game
    updateState();
    updateScreen();
    gameTimeStartTime = new Date()
    gameTimeIntervalId = setInterval(updateTime, 1);
}


// stop game, go back to start screen
function deinit() {
    clearInterval(gameTimeIntervalId);
    
    answersHTML.style.display = "none";
    resultsHTML.style.display = "none";
    settingsHTML.style.display = "";
    questionHTML.innerHTML = "capitals_quiz - select a region to start!";
    scoreHTML.innerHTML = "score";
    questionHTML.onclick = init;
    timeHTML.innerHTML = "time";

    questionList = null;
    state = {
        "score": 0,
        "maxScore": 0,
        "startTime": 0,
        "endTime": 0,
        "finishedGame": true,
        "startedGame": false,
    };
}


function updateState() {
    // check if game is over
    if (questionList.length == 0) { state.finishedGame = true; return; }

    // set up new question
    const newQuestion = questionList.pop();
    console.log(newQuestion);

    var options = []
    while (options.length < 4) {
        var c = answer_list()[Math.floor(Math.random()*answer_list().length)];
        var question = getMasterQuestionList()[newQuestion.countryname];
        if (question == undefined) question = getMasterQuestionList()[newQuestion.capital];
        console.log(c);
        console.log(question);
        if (c !== getMasterQuestionList()[newQuestion.countryname]&& !options.includes(c)){
            options.push(c);
        }
    }
    var question = getMasterQuestionList()[newQuestion.countryname];
    if (question == undefined) question = getMasterQuestionList()[newQuestion.capital];
    options[Math.floor(Math.random()*4)] = question;

    if (state.question) state.previousQuestion = {
        "question": state.question,
        "options": state.options,
        "answer": state.answer
    };

    state.question = newQuestion;
    state.options = options;
    state.answer = question;
    console.log(state);
}


// update HTML elements to reflect values of state
function updateScreen(){
    scoreHTML.innerHTML = state.score + "/" + state.maxScore;
    if (state.finishedGame) {
	    displayEndScreen();
        return;
    }
    if (!guessFlag() && !guessReverseFlag()) {
      answerAHTML.getElementsByClassName("text")[0].innerHTML = state.options[0].answer;
      answerBHTML.getElementsByClassName("text")[0].innerHTML = state.options[1].answer;
      answerCHTML.getElementsByClassName("text")[0].innerHTML = state.options[2].answer;
      answerDHTML.getElementsByClassName("text")[0].innerHTML = state.options[3].answer;
    } else if (guessReverseFlag()) {
      answerAHTML.getElementsByClassName("text")[0].innerHTML = state.options[0].countryname;
      answerBHTML.getElementsByClassName("text")[0].innerHTML = state.options[1].countryname;
      answerCHTML.getElementsByClassName("text")[0].innerHTML = state.options[2].countryname;
      answerDHTML.getElementsByClassName("text")[0].innerHTML = state.options[3].countryname;
    } else {
      answerAHTML.getElementsByClassName("text")[0].innerHTML = getImageURLFromCountryCode(state.options[0].code);
      answerBHTML.getElementsByClassName("text")[0].innerHTML = getImageURLFromCountryCode(state.options[1].code);
      answerCHTML.getElementsByClassName("text")[0].innerHTML = getImageURLFromCountryCode(state.options[2].code);
      answerDHTML.getElementsByClassName("text")[0].innerHTML = getImageURLFromCountryCode(state.options[3].code);
    }
    questionHTML.innerHTML = getQuestionHTML(state)
    if (state.previousQuestion ) {
        previousQuestionAnswer.innerHTML = state.previousQuestion.question.answer;
        previousQuestionText.style.display = "";
    }
}


function displayEndScreen() {
    questionHTML.innerHTML = "you did it! click here to restart";
    answers.style.display = "none";
    answers.style.display = "none";
    
    clearInterval(gameTimeIntervalId);

    if (guessReverseFlag() || guessFlag()) {
      incorrectAnswersTable.innerHTML = "<tr> <th> country </th> <th> answer </th> <th> your answer </th> </tr>";
      correctAnswersTable.innerHTML = "<tr> <th> flag </th> <th> country </th>  </tr>";
    }

  if (guessReverseFlag()) {
    state.incorrectAnswers.forEach(ans => {
      var tr = document.createElement('tr');
      console.log(ans)

      tr.appendChild(document.createElement('td'))
      tr.lastChild.innerHTML = ans.question.countryname

      tr.appendChild(document.createElement('td'))
      tr.lastChild.innerHTML = getImageURLFromCountryCode(ans.answer.code);

      tr.appendChild(document.createElement('td'))
      tr.lastChild.innerHTML = getImageURLFromCountryCode(ans.options[ans.userAnswer].code);

      incorrectAnswersTable.appendChild(tr);
    })
    if (state.incorrectAnswers.length <= 0)
      incorrectAnswersTable.innerHTML = "no incorrect answers! go you!";

    state.correctAnswers.forEach(ans => {
      var tr = document.createElement('tr');
      tr.appendChild(document.createElement('td'))
      tr.lastChild.innerHTML = getImageURLFromCountryCode(ans.question.code);
      tr.appendChild(document.createElement('td'))
      tr.lastChild.innerHTML = ans.answer.countryname;
      correctAnswersTable.appendChild(tr);
    })
  } else {
    state.incorrectAnswers.forEach(ans => {
      var tr = document.createElement('tr');
      console.log(ans)

      tr.appendChild(document.createElement('td'))
      if (guessCountry()) tr.lastChild.innerHTML = ans.question.capital
      else tr.lastChild.innerHTML = ans.question.countryname

      tr.appendChild(document.createElement('td'))
      if (guessFlag()) tr.lastChild.innerHTML = getImageURLFromCountryCode(ans.answer.code);
      else tr.lastChild.innerHTML = ans.answer.answer;

      tr.appendChild(document.createElement('td'))
      if (guessFlag()) tr.lastChild.innerHTML = getImageURLFromCountryCode(ans.options[ans.userAnswer].code);
      else tr.lastChild.innerHTML = ans.options[ans.userAnswer].answer;

      incorrectAnswersTable.appendChild(tr);
    })
    if (state.incorrectAnswers.length <= 0)
      incorrectAnswersTable.innerHTML = "no incorrect answers! go you!";

    state.correctAnswers.forEach(ans => {
      var tr = document.createElement('tr');
      tr.appendChild(document.createElement('td'))
      tr.lastChild.innerHTML = ans.question.countryname
      tr.appendChild(document.createElement('td'))
      if (guessFlag()) tr.lastChild.innerHTML = getImageURLFromCountryCode(ans.answer.code);
      else tr.lastChild.innerHTML = ans.answer.capital;
      correctAnswersTable.appendChild(tr);
    })
  }
	if (state.correctAnswers.length <= 0)
		correctAnswersTable.innerHTML = "no correct answers. better luck next time :')";

	resultsChart.config.data.labels = ["correct", "incorrect"];
	resultsChart.config.data.labels = ["correct", "incorrect"];
	resultsChart.config.data.datasets[0].labels = ["correct", "incorrect"];
	resultsChart.config.data.datasets[0].data = [state.correctAnswers.length,state.incorrectAnswers.length];
	resultsChart.update();
	resultsHTML.style.display = "";
}


function processClick(answer) {
    if (state.finishedGame) return;
    // check if answer to previous question  was correct
    var isAnswerCorrect = state.options[answer] == state.answer
    state.score += isAnswerCorrect ? 1 : 0;
    state.userAnswer = answer;
    state[isAnswerCorrect ? "correctAnswers" : "incorrectAnswers"].push({
        "question": state.question,
        "options": state.options,
        "userAnswer": state.userAnswer,
        "answer": state.answer
    });
    state.userAnswer = null;

    // change background color based on if answer was correct for 500ms
    bodyHTML.classList.add(isAnswerCorrect ? "correct" : "incorrect")
    setTimeout(() => bodyHTML.classList = [], 500)

    updateState();
    updateScreen();
}


function setRegion(region) {
    selectedRegion = region
}

// set up event listeners

answerAHTML.addEventListener("click", () => processClick(0));
answerBHTML.addEventListener("click", () => processClick(1));
answerCHTML.addEventListener("click", () => processClick(2));
answerDHTML.addEventListener("click", () => processClick(3));
document.addEventListener("keyup", e => {
    if (e.code == "Digit1") processClick(0);
    if (e.code == "Digit2") processClick(1);
    if (e.code == "Digit3") processClick(2);
    if (e.code == "Digit4") processClick(3);
    if (e.code == "Enter" && settingsHTML.style.display === "none" && state.finishedGame) {
        deinit();
        return;
    }
    if (e.code == "Enter" && !state.startedGame) init();
});

// start game

deinit();
regionListHTML.innerHTML = regionList()
    .map(region => {
        return `<div class="regionListItem" onclick="setRegion('${region}'); init()"> ${region} </div>`
    })
    .sort()
    .join("");
