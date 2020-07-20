console.log("lecture client running!");

var socket = io("/lecture");

// main feedback loop
var LOOP_INTERVAL = 15000; // 15 seconds
var FEEDBACK_DURATION = 60000; // 1 minute
var SURVEY_DURATION = 30000; // 30 seconds

setInterval(() => {
	console.log("15 seconds");
	requestFeedback();
}, 15000);

// feedback handling

function requestFeedback() {
	socket.emit('get feedback', FEEDBACK_DURATION);
}

socket.on('receive feedbacks', function(feedbacks) {
	parseFeedback(feedbacks);
});

var receivedFeedbacks = new Array();
function parseFeedback(feedbacks) {
	var results = {
		positive: 0,
		negative: 0,
		repeat: 0,
	}
	feedbacks.forEach(feedback => {
		if (!isDuplicate(feedback)) {
			receivedFeedbacks.push(feedback);
			results[feedback.type]++;
		}
	});

	handleFeedbackAudio(results);
}


function isDuplicate(newFeedback) {
	var match = false;
	receivedFeedbacks.forEach(feedback => {
		var srcMatch = (newFeedback.src == feedback.src);
		var typeMatch = (newFeedback.type == feedback.type);
		var timeMatch = (newFeedback.time == feedback.time);
		if (srcMatch && typeMatch && timeMatch) {
			match = true;
		}
	});
	return match;
}

// question handling

socket.on('question', function(src) {
	handleQuestionAudio(src);
});

// get all feedback 
const get_all = document.getElementById('get_all');
get_all.addEventListener('click', function(e) {
	console.log("get current feedback request!");
	requestFeedback();
});

// survey handling

const survey_button = document.getElementById('survey');
survey_button.addEventListener('click', function(e) {
	startSurvey();
});

function startSurvey() {
	console.log("start survey!");
	socket.emit('start survey', SURVEY_DURATION, function(surveyResults) {
		// on survey complete callback function
		console.log("survey complete!");
		handleSurveyAudio(surveyResults);
	});
}

// audio setup


function initAudio() {
	const ac = new AudioContext();

	const audio_confusion = document.querySelector('audio');
	console.log(audio_confusion);
	const track_confusion = ac.createMediaElementSource(audio_confusion);

	track_confusion.connect(ac.destination);

	const test_confusion = document.getElementById('test_confusion');
	test_confusion.addEventListener('click', function(e) {
		console.log("play audio: confusion");
		audio_confusion.play();
	});
}

window.addEventListener('load', initAudio, false);

function handleFeedbackAudio(feedbackResults) {
	//TODO: convert results into audio.
	console.log("Results audio not yet implemented.");
	console.log(feedbackResults);
}

function handleQuestionAudio(questionSrc) {
	//TODO: audio prompt on question asked.
	console.log("Question audio not yet implemented.");
	console.log("Student " + questionSrc + " has a question!");
}

function notifySurveyStart() {
	//TODO: audio notification when survey started
	console.log("Survey notification not yet implemented.");
}
function handleSurveyAudio(surveyResults) {
	//TODO: sonify survey results
	console.log("Survey audio not yet implemented.");
	console.log(surveyResults);
}