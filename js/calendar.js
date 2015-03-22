$( document ).ready(function() { 

	//initial variable setup
	var today = new Date();
	var firstOfMonth = new Date(today.getFullYear(), today.getMonth(), today.getDate()-today.getDate()+1);
	var firstOfNextMonth = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth()+1, 1);
	var firstOfLastMonth = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth() -1, 1);
	var lastOfMonth = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth()+1, 0);
	var monthLength = lastOfMonth.getDate();
	var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	var popupHTML = '<div id="popup">\
						<div id="close-popup">\
							x\
						</div>\
						<h4>New Event</h4>\
						<form id="new-event">\
							<div id="new-event-date">\
								When:\
							</div>\
\
							<!-- Event Label -->\
							<div class="row">\
								<div class="field form-group">\
									<label class="col-sm-4 control-label" for="event_name">Event Name:</label>\
									<div class="col-sm-8 col-lg-6">\
										<input class="form-control" id="event_name" name="event_name" type="text" />\
									</div>\
								</div>\
							</div>\
							\
							<div class="row">\
								<div class="field form-group">\
									<label class="col-sm-4 control-label" for="event_time">Event Time:</label>\
									<div class="col-sm-8 col-lg-6">\
										<input type="time" name="event_time" class="form-control">\
									</div>\
								</div>\
							</div>\
							<div class="row">\
								<div class="field form-group">\
									<div class="col-xs-12">\
										<button type="submit" class="btn btn-default" id="new-event-submit">Submit</button>\
									</div>\
								</div>\
							</div>\
						</form>\
					</div>';

	var setupDates = function(refDate) {
		// refDate = new Date(2015, 3, 15);
		firstOfMonth = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate()-refDate.getDate()+1);
		firstOfNextMonth = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth()+1, 1);
		firstOfLastMonth = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth() -1, 1);
		lastOfMonth = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth()+1, 0);
		monthLength = lastOfMonth.getDate();
		
	};

	

	var populateDays = function(){
		$('#calendar-table').html('');
		var lastMonthDays = firstOfMonth.getDay() + 1;
		var nextMonthDays = 7 - lastOfMonth.getDay();
		var totalDays = monthLength + lastMonthDays + nextMonthDays;
		var date = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth(), firstOfMonth.getDate() - lastMonthDays );

		$("#month-name").html('<span id="back-month"><</span> ' + monthNames[firstOfMonth.getMonth()] + " " + firstOfMonth.getFullYear() + ' <span id="forward-month">></span>' );

		var output = '';
		output += '<tr><th class="col-xs-1">Sun</th><th class="col-xs-1">Mon</th><th class="col-xs-1">Tues</th><th class="col-xs-1">Wed</th><th class="col-xs-1">Thurs</th><th class="col-xs-1">Fri</th><th class="col-xs-1">Sat</th></tr>';
		for (var week = 0; week < monthLength/7; week++) {
			
			// console.log(date);
			output += '<tr>';
			for (var day = 0; day < 7; day++) {
				date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
				output += '<td year="'+ date.getFullYear()+'" month="'+ date.getMonth() +'" date="'+ date.getDate() +'">' + date.getDate() + ' </td>';
			};
			output += '</tr>';
		};
		$(output).appendTo('#calendar-table');

		clickHandlers();
		

	};

	var viewNextMonth = function() {
		setupDates(firstOfNextMonth);
		populateDays();
	};

	var viewLastMonth = function() {
		setupDates(firstOfLastMonth);
		populateDays();
	};

	var popUpForm = function(date, td) {
		$('#popup').remove();
		$(popupHTML).appendTo('body');
		$('#new-event-date').text("When: " + monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear());
		$("#close-popup").click(function(event){
			$('#popup').remove();
		});
		$("#new-event-submit").click(function(e) {
			e.preventDefault();
			var $formData = $( '#new-event' ).serializeArray();
			var formTime = $formData[1]["value"];
			var hour = formTime.substring(0,2);
			var min = formTime.substring(3);
			var eventName = $formData[0]["value"];
			date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, min);
			if (formTime && eventName){
				createEvent(date, td, eventName);
				$('#popup').remove();
			} else {
				$('<div style="color:red; text-align:center;">Please fill out all form fields and resubmit.</div>').appendTo('#popup');
			}
			
			
		});
		
		
	};

	var createEvent = function(date, td, eventName) {
		var hour = date.getHours();
		var min = date.getMinutes();
		var ampm = ''
		if(hour > 12){
			hour -= 12;
			ampm = "p";
		} else {
			ampm += "a";
		};
		if(min == 0){
			min = "00";
		};
		$('<div class="calendar-event">'+ hour + ":" + min + ampm + " - " + eventName +'</div>').appendTo(td);
	};

	var clickHandlers = function() {
		$( "#forward-month" ).click(function() {
	  		viewNextMonth();
		});

		$( "#back-month" ).click(function() {
	  		viewLastMonth();
		});

		$("#calendar-table").click(function(event){
			if ($(event.target).is('td')) {
				var year = $(event.target).attr('year');
				var month = $(event.target).attr('month');
				var date = $(event.target).attr('date');
				popUpForm(new Date(year, month, date), event.target);
			};
		});		
	};


	populateDays();

});