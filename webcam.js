(function($){ 'use strict';
	var root = "http://storm.benjojo.co.uk/webcam";
	var img = new Image();
	var cam = document.getElementById("vebcam");
	var timestamps = [];
	var last = "";

	img.addEventListener("load", function()
	{
		cam.src = img.src;
	});

	function update()
	{
		$.get(root + '/lfile.php').done(function( words )
		{
			if ( words !== last ) {
				img.src = root + '/' + words;
				last = words;
			}
		});
	}

	$.getJSON(root + "/files.php").done(function( files )
	{
		console.info( "Just loaded ", files.length, " files" );
		timestamps = files.map(function(file) {
			return parseInt(file.slice(0, -4), 10);
		});
	});

	// Fun and profit
	cam.src = root + "/latest.php";
	update();
	setInterval(update, 15000);
})(jQuery);