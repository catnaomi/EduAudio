console.log("student client running!");

var socket = io("/student");

const positive = document.getElementById('student_positive');
positive.addEventListener('click', function(e) {
	console.log("positive click!");

	socket.emit('feedback', 'positive');
});

const repeat = document.getElementById('student_repeat');
repeat.addEventListener('click', function(e) {
	console.log("repeat click!");

	socket.emit('feedback', 'repeat');
});

const negative = document.getElementById('student_negative');
negative.addEventListener('click', function(e) {
	console.log("negative click!");

	socket.emit('feedback', 'negative');
});

const question = document.getElementById('student_question');
question.addEventListener('click', function(e) {
	console.log("question click!");

	socket.emit('question');
});

const yes_button = document.getElementById('survey_yes');
yes_button.addEventListener('click', function(e) {
	console.log("survey response: yes");

	socket.emit('survey response', "yes");
	endSurvey();
});

const no_button = document.getElementById('survey_no');
no_button.addEventListener('click', function(e) {
	console.log("survey response: no");

	socket.emit('survey response', "no");
	endSurvey();
});

socket.on('start survey', function(duration) {
	startSurvey(duration);
});

socket.on('end survey', function() {
	endSurvey();
});

function startSurvey(duration) {
	//TODO: sound notification of survey start, open survey options. show countdown?
	console.log("survey started! " + duration + "ms to respond!");
}

function endSurvey() {
	//TODO: close survey options
	console.log("survey completed and/or responded to!");
}

var muteBox = document.getElementById("lecture_audio");

muteBox.addEventListener('change', function() {
    muteLecture(!this.checked);
});

function muteLecture(mute) {
	//TODO: handle lecture mute audio w/ filters
	console.log("Lecture audio not yet implemented");
	console.log("Lecture audio muted? " + mute);
}