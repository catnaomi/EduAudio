console.log("lecture client running!");

// main feedback loop

setInterval(() => {
console.log("15 seconds!");
}, 15000);

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