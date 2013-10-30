(function($){ 'use strict';
	var root = "http://storm.benjojo.co.uk/webcam";
	var img = new Image();
	var cam = document.getElementById("vebcam");
	var timestamps = [];
	var last = "";
	var caption = document.getElementById("caption");

	img.addEventListener("load", function()
	{
		cam.src = img.src;
		caption.textContent = (new Date( parseInt( img.src.slice(-14, -4), 10 ) * 1000 ).toUTCString() );
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
		console.log(timestamps);
	});

	// Fun and profit
	cam.src = root + "/latest.php";
	update();
	setInterval(update, 15000);
})(jQuery);