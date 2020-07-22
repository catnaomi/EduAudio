// setup

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

server.listen(8080, () => {
	console.log('EduAudio Server Started on Port 8080');
});


// socket handling

const lecturers = io.of("/lecture");
const students = io.of("/student");

students.on('connection', socket => {
	console.log("Student " + socket.id + " has connected.");
	socket.on('disconnect', () => {
		console.log("Student " + socket.id + " disconnected.");
	});
	socket.on('feedback', (fbType) => {
		logFeedback(fbType, socket.id);
	});
	socket.on('question', () => {
		console.log("Student " + socket.id + " has a question!");
		lecturers.emit('question', socket.id);
	});

	socket.on('survey response', (response) => {
		handleSurveyResponse(socket.id, response);
	});
});

app.get('/student', function(req, res) {
	res.sendFile(__dirname + '/views/student2.html');
	console.log("A student has been sent student page.");
});

app.get('/lecture', function(req, res) {
	res.sendFile(__dirname + '/views/lecture.html');
	console.log("A lecturer has been sent student page.");
});

lecturers.on('connection', socket => {
	console.log("Lecturer " + socket.id + " has connected.");
	socket.on('disconnect', () => {
		console.log("Lecturer " + socket.id + " disconnected.");
	});
	socket.on('get feedback', (duration) => {
		console.log(socket.id + " requested feedback with duration: " + duration);
		socket.emit('receive feedbacks', getFeedbacks(duration));
	});

	// survey handling

	socket.on('start survey', (duration, callback) => {
		handleSurvey(socket, duration, callback);
	});
});


// student request handling

var feedbacks = new Array();

function logFeedback(fbType, sid) {
	var feedback = {
		src: sid,
		type: fbType,
		time: new Date(),
	}

	feedbacks.push(feedback);

	console.log(feedback);
};

// lecturer request handling

function getFeedbacks(duration) {
	var validFeedbacks = new Array();

	var currentTime = new Date();
	feedbacks.forEach(feedback => {
		if (feedback.time >= currentTime - duration) {
			validFeedbacks.push(feedback);
		}
	});

	return validFeedbacks;
}

var currentSurveyResults;
var isSurveyInProgress;

async function handleSurvey(requester, duration, callback) {
	console.log("Survey of duration " + duration + "ms started at " + new Date());


	currentSurveyResults = {
		count: 0,
		yes: 0,
		no: 0,
		noresponse: 0
	};
	isSurveyInProgress = true;

	students.clients((error, clients) => {
		if (error) throw error;
		clients.forEach(client => {
			currentSurveyResults[client] = "no response";
			currentSurveyResults.count++;
		});
	});

	students.emit('start survey', duration);

	await setTimeout(() => {
		console.log("Survey completed at " + new Date());
		isSurveyInProgress = false;
		students.emit('end survey');
		currentSurveyResults.noresponse = currentSurveyResults.count - (currentSurveyResults.yes + currentSurveyResults.no);
		callback(currentSurveyResults);
	}, duration);
}

function handleSurveyResponse(respondent, response) {
	if (isSurveyInProgress) {
		console.log("Student " + respondent + " responded with " + response + " to survey");
		currentSurveyResults[respondent] = response;
		if (response == "yes") {
			currentSurveyResults.yes++;
		}
		else if (response == "no") {
			currentSurveyResults.no++;
		}
	}
}