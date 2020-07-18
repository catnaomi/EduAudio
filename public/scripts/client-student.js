console.log("student client running!");

const positive = document.getElementById('student_positive');
positive.addEventListener('click', function(e) {
	console.log("positive click!");

	fetch('/student_positive', {method: 'POST'})
		.then(function(response) {
			if (response.ok) {
				console.log("positive acknowledged!");
				return;
			}
			throw new Error('Positive Request failed.');
		})
		.catch(function(error) {
			console.log(error);
		});
});
const repeat = document.getElementById('student_repeat');
repeat.addEventListener('click', function(e) {
	console.log("repeat click!");

	fetch('/student_repeat', {method: 'POST'})
		.then(function(response) {
			if (response.ok) {
				console.log("repeat acknowledged!");
				return;
			}
			throw new Error('Repeat Request failed.');
		})
		.catch(function(error) {
			console.log(error);
		});
});
const negative = document.getElementById('student_negative');
negative.addEventListener('click', function(e) {
	console.log("negative click!");

	fetch('/student_negative', {method: 'POST'})
		.then(function(response) {
			if (response.ok) {
				console.log("negative acknowledged!");
				return;
			}
			throw new Error('negative Request failed.');
		})
		.catch(function(error) {
			console.log(error);
		});
});
const question = document.getElementById('student_question');
question.addEventListener('click', function(e) {
	console.log("question click!");

	fetch('/student_question', {method: 'POST'})
		.then(function(response) {
			if (response.ok) {
				console.log("question acknowledged!");
				return;
			}
			throw new Error('question Request failed.');
		})
		.catch(function(error) {
			console.log(error);
		});
});


addEventListener('beforeunload', function (e) { 
    fetch('/student_exit', {method: 'POST'});
}); 