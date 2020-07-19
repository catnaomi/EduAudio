// setup

var http = require('http').createServer(app);
var io = require('socket.io')(http);
var express = require('express');
var app = express();

app.use(express.static('public'));

app.listen(8080, () => {
	console.log('EduAudio Server Started on Port 8080');
});


// state variables

const lecturers = io.of("/lecture");
const students = io.of("/student");

app.get('/student', function(req, res) {
	res.sendFile(__dirname + '/views/student.html');
	console.log("A student has been sent student page.");
});

students.use((socket, next) => {
	next();
});

students.on('connection', socket => {
	console.log("Student " + socket.id + " has connected.");
	socket.on('disconnect', () => {
		console.log("Student " + socket.id + " disconnected.");
	});
});

app.get('/lecture', function(req, res) {
	res.sendFile(__dirname + '/views/lecture.html');
	console.log("A lecturer has been sent student page.");
});

lecturers.use((socket, next) => {
	next();
});

lecturers.on('connection', socket => {
	console.log("Lecturer " + socket.id + " has connected.");
	socket.on('disconnect', () => {
		console.log("Lecturer " + socket.id + " disconnected.");
	});
});

/*io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});*/



// student request handling

var feedbacks = new Array();

app.post('/student_positive', (req, res) => {
  console.log("A student indicated positive.");

  var feedback = {
  	type: "positive",
  	time: new Date(),
  };

  feedbacks.push(feedback);

  console.log(feedback);

  res.sendStatus(201);
});
app.post('/student_negative', (req, res) => {
  console.log("A student indicated negative.");

  var feedback = {
  	type: "negative",
  	time: new Date(),
  };

  feedbacks.push(feedback);

  console.log(feedback);

  res.sendStatus(201);
});
app.post('/student_repeat', (req, res) => {
  console.log("A student wants a repeat.");


  var feedback = {
  	type: "repeat",
  	time: new Date(),
  };

  feedbacks.push(feedback);

  console.log(feedback);

  res.sendStatus(201);
});

app.post('/student_question', (req, res) => {
  console.log("A student has a question.");
  
  var feedback = {
  	type: "question",
  	time: new Date(),
  };

  feedbacks.push(feedback);

  console.log(feedback);

  res.sendStatus(201);
});

app.post('/student_exit', (req, res) => {
	students--;
	console.log("A student has disconnected. Student count: " + students);
});

// lecturer request handling

app.post('/lecture_exit', (req, res) => {
	lecturers--;
	console.log("A lecturer has disconnected. Lecturer count: " + lecturers);
});

app.get('/lecture_get_all', (req, res) => {
	res.send(JSON.stringify(feedbacks));
});

app.get('/lecture_get_feedback/', (req, res) => {
	var validFeedbacks = new Array();

	var currentTime = new Date();
	feedbacks.forEach(feedback => {
		if (feedback.time >= currentTime - 60000) {
			validFeedbacks.push(feedback);
		}
	});
	console.log("feedback response:");
	console.log(JSON.stringify(validFeedbacks));
	res.send(JSON.stringify(validFeedbacks));
});