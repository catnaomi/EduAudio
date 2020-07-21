console.log("lecture client running!");

var socket = io("/lecture");

// main feedback loop
var LOOP_INTERVAL = 15000; // 15 seconds
var FEEDBACK_DURATION = 60000; // 1 minute
var SURVEY_DURATION = 30000; // 30 seconds

setInterval(() => {
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
	notifySurveyStart();
	socket.emit('start survey', SURVEY_DURATION, function(surveyResults) {
		// on survey complete callback function
		console.log("survey complete!");
		handleSurveyAudio(surveyResults);
	});
}

// audio setup

const ac = new AudioContext();

var masterGain = ac.createGain(); // user input gain

var tempGain = ac.createGain(); // changes based on notification volume

var notifGain = ac.createGain(); // contains all notifications

var surveyPositivePanner = ac.createStereoPanner();
var surveyNegativePanner = ac.createStereoPanner();
var surveyPositiveDelay = ac.createDelay();
var surveyNegativeDelay = ac.createDelay();

var notifPlaying = false;

var audioQueue = [];

document.getElementById("master_gain_slider").addEventListener('input', function() {
    masterGain.gain.value = this.value;
    document.getElementById("master_gain_display").innerHTML = this.value;
}, false);

masterGain.connect(ac.destination);

notifGain.connect(masterGain);
tempGain.connect(notifGain);

notifGain.gain = 1;

surveyPositivePanner.connect(tempGain);
surveyNegativePanner.connect(tempGain);
surveyPositiveDelay.connect(surveyPositivePanner);
surveyNegativeDelay.connect(surveyNegativePanner);

// sound objects

var sound_confusion = createSound("audio_confusion", ac);
sound_confusion.track.connect(tempGain);

var sound_question = createSound("audio_question", ac);
sound_question.track.connect(tempGain);

var sound_positive = createSound("audio_positive", ac);
sound_positive.track.connect(tempGain);

var sound_negative = createSound("audio_negative", ac);
sound_negative.track.connect(tempGain);

var sound_repeat = createSound("audio_repeat", ac);
sound_repeat.track.connect(tempGain);

var sound_survey = createSound("audio_survey", ac);
sound_survey.track.connect(tempGain);

var sound_lowengage = createSound("audio_lowengage", ac);
sound_lowengage.track.connect(tempGain);

var sound_survey = createSound("audio_survey", ac);
sound_repeat.track.connect(tempGain);

var sound_lowengage = createSound("audio_lowengage", ac);
sound_lowengage.track.connect(tempGain);

var sound_survey_positive = createSound("audio_survey_positive", ac);
sound_survey_positive.track.connect(surveyPositiveDelay);
surveyPositivePanner.pan = -1;

var sound_survey_negative = createSound("audio_survey_negative", ac);
sound_survey_negative.track.connect(surveyNegativeDelay);
surveyNegativePanner.pan = 1;

function createSound(name, context) {
	var newElement = document.getElementById(name);
	var newTrack = context.createMediaElementSource(newElement);
	var obj = {
		element: newElement,
		track: newTrack,
	};
	return obj;
}


function queueFunct() {
	notifPlaying = false;
	var next = audioQueue.pop();
	if (next != null) {
		playNotification(next.snd, true, next.gain);
	}
}

function playNotification(sound, isPriority, g) {
	if (!notifPlaying) {
		tempGain.gain.value = g;
		sound.element.play();
		notifPlaying = true;
		sound.element.removeEventListener('ended', queueFunct);
		sound.element.addEventListener('ended', queueFunct);
	}
	else
	{
		var soundWrapper = {
			snd: sound,
			gain: g,
		}
		if (true) {
			audioQueue.push(soundWrapper);
		}
		else {
			audioQueue.unshift(soundWrapper);
		}
	}
	return sound;
}

function handleFeedbackAudio(feedbackResults) {
	// convert feedback results into audio.

	console.log(feedbackResults);

	if (feedbackResults.positive > 0 && feedbackResults.negative > 0) {
		if (feedbackResults.positive > feedbackResults.negative) {
			// play positive sound louder than negative
			// indicates that most responders understand.
			playNotification(sound_positive, false, 2);
			playNotification(sound_negative, false, 0.25);
		}
		else {
			// play negative sound louder than positive
			// indicates that most responders do not understand.
			playNotification(sound_negative, false, 1.5);
			playNotification(sound_positive, false, 0.75);
		}
	}
	else if (feedbackResults.positive > 0) {
		playNotification(sound_positive, false, 1);
	}
	else if (feedbackResults.negative > 0) {
		playNotification(sound_negative, false, 1);
	}

	// play repeat sound if a student requests it, increasing in volume if more students request it.
	if (feedbackResults.repeat > 10) {
		playNotification(sound_repeat, false, 2);
	}
	else if (feedbackResults.repeat > 3) {
		playNotification(sound_repeat, false, 1);
	}
	else if (feedbackResults.repeat > 1) {
		playNotification(sound_repeat, false, 0.5);
	}

}

function handleQuestionAudio(questionSrc) {
	// audio prompt on question asked.	
	console.log("Student " + questionSrc + " has a question!");

	playNotification(sound_question, true, 1);

}

function notifySurveyStart() {
	// audio notification when survey started
	playNotification(sound_survey, false, 1);
}

function handleSurveyAudio(surveyResults) {
	// sonify survey results
	console.log(surveyResults);


	var last = playNotification(sound_survey, false, 0.75);

	if (surveyResults.noresponse >= (surveyResults.count / 2)) {
		last = playNotification(sound_lowengage, false, 1);
	}

	var responseDiff = (surveyResults.yes - surveyResults.no) / (surveyResults.count - surveyResults.noresponse); // difference between yes and no answers

	if (surveyResults.no < surveyResults.yes) {
		surveyPositiveDelay.delayTime = 500;
		playNotification(sound_survey_positive, false, 1 + responseDiff);

		surveyNegativeDelay.delayTime = 2500;
		playNotification(sound_survey_negative, false, 1 - responseDiff);
	}
	else {
		surveyNegativeDelay.delayTime = 500;
		playNotification(sound_survey_negative, false, 1 - responseDiff);

		surveyPositiveDelay.delayTime = 2500;
		playNotification(sound_survey_positive, false, 1 + responseDiff);
	}

	/*
	surveyPositiveGain = 1 + responseDiff;
	surveyNegativeGain = 1 - responseDiff;

	// TODO: make more distinct
	sound_survey_positive.element.play();
	sound_survey_negative.element.play();
	*/
}