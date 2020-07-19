console.log("lecture client running!");

// main feedback loop
var LOOP_INTERVAL = 15000; // 15 seconds
var FEEDBACK_DURATION = 60000; // 1 minute

setInterval(() => {
	console.log("15 seconds");
	fetch('/lecture_get_feedback', {
			method: 'GET',
			headers: {'content-type': 'application/json' }
		})
		.then(response => response.json())
		.then(data => {
			console.log(data);
			parseFeedback(data);
		})
		.catch(error => console.log(error));
}, 15000);

var receivedFeedbacks = new Array();
function parseFeedback(feedbacks) {
	console.log(feedbacks);

	var relevantFeedbacks = new Array();

	var results = {
		positive: 0,
		negative: 0,
		repeat: 0,
		question: 0
	}
	feedbacks.forEach(feedback => {
		if (!receivedFeedbacks.includes(feedback)) {
			relevantFeedbacks.push(feedback);
			receivedFeedbacks.push(feedback);

			results[feedback.type]++;
		}
	});

	console.log(results);
}

/*
function hasReceived(newFeedback) {
	received.forEach(feedback => {
		if (newFeedback.type == feedback.type &&
			newFeedback.time) {
			return false;
		}
		else if (newFeedback.type == feedback)
	});
}*/

// exit detection

addEventListener('beforeunload', function (e) { 
    fetch('/lecture_exit', {method: 'POST'});
}); 

// get all feedback 
const get_all = document.getElementById('get_all');
get_all.addEventListener('click', function(e) {
	console.log("get all feedback request!");

	fetch('/lecture_get_all', {
		method: 'GET',
		headers: {'content-type': 'application/json' }
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
	})
	.catch(error => console.log(error));
});

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