(function($){ 'use strict';
	var root = "http://storm.benjojo.co.uk/webcam";
	var img = new Image();
	var cam = document.getElementById("vebcam");
	var timestamps = [];
	var latest = "";
	var caption = document.getElementById("caption");
	var paused = false;

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
		caption.textContent = new Date( timestampFromFile( img.src.slice(-14) ) ).toUTCString();
	});

	function gotLatest(words)
	{
		if ( words === latest )
			return;
		latest = words;
		timestamps.push( timestampFromFile( words ) );
		if ( ! paused )
			updateImage();
	}
	function update()
	{
		$.get( root + '/lfile.php' ).done( gotLatest );
	}

	$.getJSON(root + "/files.php").done(function(files) {
		timestamps = files.map(timestampFromFile);
	});

	function pause()
	{
		if ( paused )
			return;
		paused = true;
		caption.classList.add( "paused" );
		caption.classList.remove( "playing" );
		console.info("Paused!");
	}
	function unpause()
	{
		if ( ! paused )
			return;
		paused = false;
		caption.classList.remove( "paused" );
		caption.classList.add( "playing" );
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

	document.getElementById("btn-pause").addEventListener("click", function(event)
	{
		event.preventDefault();
		togglePause();
	});


	// Fun and profit
	cam.src = root + "/latest.php";
	update();
	setInterval(update, 15000);
})(jQuery);