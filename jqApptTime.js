(function($) {

	// Replace with Globalize.js eventually and accept culture info in plugin params
	Date.prototype.format = function(format) {
	    var returnStr = "";
	    var replace = Date.replaceChars;
	    for (var i = 0; i < format.length; i++) {       
	    	var curChar = format.charAt(i);
	    	if (i - 1 >= 0 && format.charAt(i - 1) == "\\") {
	            returnStr += curChar;
	        }
	        else if (replace[curChar]) {
	            returnStr += replace[curChar].call(this);
	        } 
	        else if (curChar != "\\"){
	            returnStr += curChar;
	        }
	    }
	    return returnStr;
	};

	Date.replaceChars = {
	    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	    shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	    
	    d: function() { return this.getDate(); },
	    D: function() { return Date.replaceChars.shortDays[this.getDay()]; },	
	    M: function() { return Date.replaceChars.shortMonths[this.getMonth()]; },	    
	};

	function createOpt(value, text) {
				var opt = $(document.createElement("option"));
				opt.val(value);
				opt.text((arguments.length == 2) ? text : value);

				return opt;
			}

	function leadingZero(value) {
		return (value < 10) ? "0" + value : value;
	}

	function range(start, end) {
		var a = []; 
		for (var i = start; i < end; ++i) { 
			a.push(i); 
		} 
		return a;
	}

	$.fn.jqApptTime = function(args) {

		var datetimePattern = /((\d{4})\-(\d{2})\-(\d{2}))?(\s?(\d{1,2})\:(\d{2}))?/;

		var params = args || { };

		params.date = (params.date != null) ? params.date : true;
		params.time = (params.time != null) ? params.time : true;
		params.maxDays = params.maxDays || 30;
		params.minuteIntervals = params.minuteIntervals || range(1, 60);

		return this.each(function() {

			var textInput = $(this);
			var parent = textInput.parent();			
			var dateSel;
			var hourSel;
			var minuteSel;
			var ampmSel; 
			var valParts = $.trim(textInput.val()).match(datetimePattern);
			var now = new Date();

			textInput.hide();

			if (params.date) {

				var dateParts = valParts.slice(2,5);

				dateSel = $(document.createElement("select"));

				for(var day = 0; day < params.maxDays; day++) {

					var present = new Date();
					var date = new Date(present.setDate(present.getDate() + day));

					dateSel.append(createOpt(date.getFullYear() + "-" + leadingZero((date.getMonth() + 1)) + "-" + leadingZero(date.getDate()), date.format("D M d")));
				}

				dateSel.val((dateParts[0] || now.getFullYear()) + "-" + (dateParts[1] || (now.getMonth() + 1)) + "-" + (dateParts[2] || now.getDate()));

				parent.append(dateSel);
			}

			if (params.time) {

				var timeParts = valParts.slice(6,8);
				var hour = parseInt(timeParts[0] || now.getHours());
				var minutes = parseInt(timeParts[1] || now.getMinutes());

				hourSel = $(document.createElement("select"));
				minuteSel = $(document.createElement("select"));
				ampmSel = $(document.createElement("select"));

				for(var i = 0; i < 12; i++) {
					hourSel.append(createOpt(leadingZero(i + 1)));
				}

				for(var i = 0; i < params.minuteIntervals.length; i++) {
					minuteSel.append(createOpt(leadingZero(params.minuteIntervals[i])));				
				}

				ampmSel.append(createOpt(0, "AM"));
				ampmSel.append(createOpt(1, "PM"));

				hourSel.val(leadingZero(hour > 12 ? hour - 12 : hour));
				minuteSel.val(leadingZero(minutes));
				ampmSel.val(hour > 12 ? 1 : 0);

				parent.append(hourSel);
				parent.append(minuteSel);
				parent.append(ampmSel);
			}			

			function timeChanged() {
				
				var value = "";

				if (params.date) {
					value = dateSel.val() + " ";
				}

				if (params.time) {
					var hour = parseInt(hourSel.val()) + (parseInt(ampmSel.val()) * 12);
					value += leadingZero(hour) + ":" + minuteSel.val();
				}

				textInput.val(value);
			}

			if (params.date) {
				dateSel.change(timeChanged);
			}

			if (params.time) {			
				hourSel.change(timeChanged);
				minuteSel.change(timeChanged);
				ampmSel.change(timeChanged);
			}
		});		
	}
})(jQuery);