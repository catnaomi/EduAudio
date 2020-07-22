console.log("student client running!");

var socket = io("/student");

const positive = document.getElementById('student_positive');
positive.addEventListener('click', function(e) {
	console.log("positive click!");

	socket.emit('feedback', 'positive');

	textNotification("Feedback Sent!");
});

const repeat = document.getElementById('student_repeat');
repeat.addEventListener('click', function(e) {
	console.log("repeat click!");

	socket.emit('feedback', 'repeat');

	textNotification("Repeat Requested.");
});

const negative = document.getElementById('student_negative');
negative.addEventListener('click', function(e) {
	console.log("negative click!");

	socket.emit('feedback', 'negative');

	textNotification("Feedback Sent!");
});

const question = document.getElementById('student_question');
question.addEventListener('click', function(e) {
	console.log("question click!");

	socket.emit('question');

	textNotification("Lecturer notified of question!");
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
	textNotification("Survey started!");
	openSurvey(true);
}

function endSurvey() {
	//TODO: close survey options
	console.log("survey completed and/or responded to!");
	openSurvey(false);
}

var muteBox = document.getElementById("lecture_audio");

muteBox.addEventListener('click', function() {
    muteLecture(!muted);
});


function textNotification(text) {
	var notif = document.getElementById("notification");
	notif.innerHTML = text;
	notif.className = "open";
	setTimeout(() => {
		notif.className = "closed";
	}, 10000);
}

function openSurvey(open) {
	var survey = document.getElementById("survey_input");
	if (open) {
		survey.className = "open";
	}
	else {
		survey.className = "closed";
	}
}

// audio setup

const ac = new AudioContext();

var masterGain = ac.createGain(); // user input gain

var filteredGain = ac.createGain(); // gain of filtered lecture track
var unfilteredGain = ac.createGain(); // gain of unfiltered lecture track
unfilteredGain.gain.value = 0;

var muted;
muteLecture(true);

// gain slider input

var gain = 1;
var gain_slider = document.getElementById("master_gain_slider");
gain_slider.addEventListener('input', function() {
    gain = this.value;
    if (!muted) {
    	masterGain.gain.value = gain;
    }
}, false);
gain_slider.value = 1;

// filter setup
// filter is a band-pass filter to approximate human vocal range (55-255Hz)

var filter = ac.createBiquadFilter();

filter.type = "bandpass";
filter.frequency = 155;
filter.Q = 200;

filter.connect(filteredGain);

var sound_survey = createSound("audio_lecture", ac);
sound_survey.track.connect(filter);
sound_survey.track.connect(unfilteredGain);

sound_survey.element.loop = true;
sound_survey.element.play();

filteredGain.connect(masterGain);
unfilteredGain.connect(masterGain);
masterGain.connect(ac.destination);

var toggle = document.getElementById("filter_toggle");
toggle.addEventListener('change', function () {
	if (!this.checked) {
		filteredGain.gain.value = 1;
		unfilteredGain.gain.value = 0;
		textNotification("Filter on!");
	}
	else {
		filteredGain.gain.value = 0;
		unfilteredGain.gain.value = 1;
		textNotification("Filter off.");
	}
});
toggle.checked = false;

function createSound(name, context) {
	var newElement = document.getElementById(name);
	var newTrack = context.createMediaElementSource(newElement);
	var obj = {
		element: newElement,
		track: newTrack,
	};
	return obj;
}

function muteLecture(mute) {
	// handle lecture mute audio w/ filters
	console.log("Lecture audio muted? " + mute);
	muted = mute;
	if (mute) {
		masterGain.gain.value = 0;
	}
	else {
		masterGain.gain.value = gain;
	}
}