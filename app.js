// express setup

var express = require('express');
var app = express();

app.use(express.static('public'));

app.listen(8080, () => {
	console.log('EduAudio Server Started on Port 8080');
});


// state variables

var students = 0;
var lecturers = 0;

app.get('/student/', function(req, res) {
	res.sendFile(__dirname + '/views/student.html');
	students++;
	console.log("A student has connected. Student count: " + students);
});

app.get('/lecture/', function(req, res) {
	res.sendFile(__dirname + '/views/lecture.html');
	lecturers++;
	console.log("A lecturer has connected. Lecturer count: " + lecturers);
});

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
})