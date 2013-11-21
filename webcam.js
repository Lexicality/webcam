(function(){ 'use strict';
	var root = "http://storm.benjojo.co.uk/webcam";
	var img = new Image();
	var cam = document.getElementById("vebcam");
	var timestamps = [];
	var latest = "";
	var caption = document.getElementById("caption");
	var paused = false;
	var btnPause = document.getElementById("btn-pause");
	var timeshift = document.getElementById("time-sel");
	var latestDate = new Date();
	var latestFetcher = new XMLHttpRequest();


	function updateImage()
	{
		img.src = root + '/' + latest;
	}

	function timestampFromFile( file )
	{
		return parseInt( file.slice(0, -4), 10 ) * 1000;
	}

	img.addEventListener("load", function()
	{
		cam.src = img.src;
		var date = new Date( timestampFromFile( img.src.slice(-14) ) );
		caption.textContent = date.toUTCString();
		if ( ! paused )
			timeshift.valueAsDate = date;
	});

	latestFetcher.addEventListener('load', function()
	{
		var words = this.responseText;
		if ( words === latest )
			return;
		latest = words;
		var timestamp = timestampFromFile( words );
		timestamps.push( timestamp );
		latestDate.setTime( timestamp );
		if ( ! paused )
			updateImage();
	});
	function update()
	{
		latestFetcher.open('GET', root + '/lfile.php', true);
		latestFetcher.send();
	}

	(function(){
		var req = new XMLHttpRequest();
		req.responseType = 'json';
		req.addEventListener('load', function()
		{
			timestamps = this.response.map(timestampFromFile);
		});
		req.open('GET', root + "/files.php", true);
		req.send();
	})();

	function pause()
	{
		if ( paused )
			return;
		paused = true;
		caption.classList.add( "paused" );
		caption.classList.remove( "playing" );
		btnPause.textContent = "Go to Live";
		console.info("Paused!");
	}
	function unpause()
	{
		if ( ! paused )
			return;
		paused = false;
		caption.classList.remove( "paused" );
		caption.classList.add( "playing" );
		btnPause.textContent = "Freeze";
		updateImage();
		console.info("Unpaused!");
	}

	function togglePause()
	{
		if ( paused )
			unpause();
		else
			pause();
	}

	btnPause.addEventListener("click", function(event)
	{
		event.preventDefault();
		togglePause();
	});
	document.getElementById("btn-cycle").addEventListener("click", function(event)
	{
		event.preventDefault();
		timeshift.valueAsDate = latestDate;
	});

	// Fun and profit
	cam.src = root + "/latest.php";
	update();
	setInterval(update, 15000);
})();