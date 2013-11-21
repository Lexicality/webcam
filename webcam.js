(function(){ "use strict";
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
	var offsetDate = new Date(0);


	function updateImage( fileName )
	{
		img.src = root + "/" + fileName;
	}

	function timestampFromFile( file )
	{
		return parseInt( file.slice(0, -4), 10 ) * 1000;
	}

	img.addEventListener("load", function()
	{
		var src = this.src;
		cam.src = src;
		var date = new Date( timestampFromFile( src.slice(-14) ) );
		caption.textContent = date.toUTCString();
		if ( ! paused )
			timeshift.valueAsDate = date;
	});

	latestFetcher.addEventListener("load", function()
	{
		var words = this.responseText;
		if ( words === latest )
			return;
		latest = words;
		var timestamp = timestampFromFile( words );
		timestamps.push( timestamp );
		latestDate.setTime( timestamp );
		if ( ! paused )
			updateImage( latest );
	});
	function update()
	{
		latestFetcher.open( "GET", root + "/lfile.php", true );
		latestFetcher.send();
	}

	(function resetTimestamps(){
		var req = new XMLHttpRequest();
		req.responseType = "json";
		req.addEventListener("load", function()
		{
			offsetDate = new Date();
			offsetDate.setHours(0);
			offsetDate.setMinutes(0);
			offsetDate.setSeconds(0);
			offsetDate.setMilliseconds(0);
			timestamps = this.response.map( timestampFromFile );
			req = null; // hi gc
		});
		req.open( "GET", root + "/files.php", true );
		req.send();
		var then = new Date();
		// if ( then.getHours() >= 6 ) // If the next 6 AM is tomorrow
			then.setTime( then.getTime() + 86400000 ); // uh
		// then.setHours(6);
		then.setHours(0);
		then.setMinutes(2); // Deal with cron being late
		then.setSeconds(0);
		then.setMilliseconds(0);
		// Make sure everything gets reset it the page is left open overnight
		window.setTimeout(resetTimestamps, then.getTime() - new Date().getTime());
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