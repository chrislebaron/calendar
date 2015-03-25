$( document ).ready(function() { 

	//initial variable setup
	var today = new Date();
	var firstOfMonth = new Date(today.getFullYear(), today.getMonth(), today.getDate()-today.getDate()+1);
	var firstOfNextMonth = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth()+1, 1);
	var firstOfLastMonth = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth() -1, 1);
	var lastOfMonth = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth()+1, 0);
	var monthLength = lastOfMonth.getDate();
	var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	eventList = [];

	var view = "calendar-view";

	// Reset date variables when new month is called up.				
	var setupDates = function(refDate) {
		// refDate = new Date(2015, 3, 15);
		firstOfMonth = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate()-refDate.getDate()+1);
		firstOfNextMonth = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth()+1, 1);
		firstOfLastMonth = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth() -1, 1);
		lastOfMonth = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth()+1, 0);
		monthLength = lastOfMonth.getDate();
		
	};

	

	var populateDays = function(){
		$('<table id="calendar-table"></table>').appendTo('#main-window');
		$('#calendar-table').html('');
		var lastMonthDays = firstOfMonth.getDay() + 1;
		var nextMonthDays = 7 - lastOfMonth.getDay();
		var totalDays = monthLength + lastMonthDays + nextMonthDays;
		var date = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth(), firstOfMonth.getDate() - lastMonthDays );

		// Populate the HTML to create the #calendar-table
		$("#month-name").html('<span id="back-month"><</span> ' + monthNames[firstOfMonth.getMonth()] + " " + firstOfMonth.getFullYear() + ' <span id="forward-month">></span>' );

		var output = '';
		output += '<tr><th class="col-xs-1">Sun</th><th class="col-xs-1">Mon</th><th class="col-xs-1">Tues</th><th class="col-xs-1">Wed</th><th class="col-xs-1">Thurs</th><th class="col-xs-1">Fri</th><th class="col-xs-1">Sat</th></tr>';
		for (var week = 0; week < monthLength/7; week++) {
			
			// console.log(date);
			output += '<tr>';
			for (var day = 0; day < 7; day++) {
				date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
				if (date.getMonth() === firstOfMonth.getMonth()){
					output += '<td year="'+ date.getFullYear()+'" month="'+ date.getMonth() +'" date="'+ date.getDate() +'">' + date.getDate() + ' </td>';
				} else {
					output += '<td class="different-month" year="'+ date.getFullYear()+'" month="'+ date.getMonth() +'" date="'+ date.getDate() +'">' + date.getDate() + ' </td>';
				};
				
			};
			output += '</tr>';
		};
		$(output).appendTo('#calendar-table');

		//add click handlers to new page elements & load previously saved events
		clickHandlers();
		loadEvents();
		

	};

	// Sets up the next month
	var viewNextMonth = function() {
		setupDates(firstOfNextMonth);
		populateDays();
	};
	// Sets up the previous month
	var viewLastMonth = function() {
		setupDates(firstOfLastMonth);
		populateDays();
	};

	// HTML for popUpForm
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
										<input class="form-control" id="event_name" name="event_name" type="text" autofocus  />\
									</div>\
								</div>\
							</div>\
							\
							<div class="row">\
								<div class="field form-group">\
									<label class="col-sm-4 control-label" for="event_time">Event Time:</label>\
									<div class="col-sm-8 col-lg-6">\
										<input type="time" name="event_time" id="event_time" class="form-control">\
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

	//Pops up form for creating an event.
	var popUpForm = function(date, td) {
		//remove the popup if it's there from a different date.
		$('#popup').remove();
		//append it to the body.
		$(popupHTML).appendTo('body');
		// set the month & year at the top of the page
		$('#new-event-date').text("When: " + monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear());
		// click event for the close button
		$("#close-popup").click(function(event){
			$('#popup').remove();
		});

		$("#new-event-submit").click(function(e) {
			e.preventDefault();
			//Serialize the form data
			var $formData = $( '#new-event' ).serializeArray();
			// get the time, hour, minute & eventName from the form
			var formTime = $formData[1]["value"];
			var hour = formTime.substring(0,2);
			var min = formTime.substring(3);
			var eventName = $formData[0]["value"];
			// Set up a new date element with the hour and minute from the form, and the date from the date variable.
			date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, min);
			// make sure the form isn't empty
			if (formTime && eventName){
				// create and save the event, close the form.
				createEvent(date, td, eventName);
				saveEvent(date, eventName);
				$('#popup').remove();
			} else {
				// show error message
				$('<div style="color:red; text-align:center;">Please fill out all form fields and resubmit.</div>').appendTo('#popup');
			}
		});		
	};

	// create event to be printed on page.
	var createEvent = function(date, td, eventName) {
		var hour = date.getHours();
		var min = date.getMinutes();
		var ampm = '';
		var month = date.getMonth();
		var year = date.getFullYear();
		var monthDate = date.getDate();
		//convert to 12 hour clock
		if(hour >= 12){
			var newHour = hour - 12;
			ampm = "p";
		} else {
			ampm += "a";
			var newHour = hour;
		};
		// make sure minutes show correctly
		if(min < 10){
			min = "0" + min;
		};
		if (view == 'calendar-view'){
			$('<div class="calendar-event" hour="'+ hour +'" min="'+ min +'" eventName="'+ eventName +'">'+ newHour + ":" + min + ampm + " - " + eventName +'</div>').appendTo(td);
		} else {
			//it's list view
			$dateDiv = $('div[year="'+ year +'"][month="'+ month +'"][date="'+ monthDate +'"]');
			if ($dateDiv[0]){
				$('<div class="list-event-div"><p>' + newHour + ":" + min + ampm + ": " + eventName + "</p></div>").appendTo($dateDiv[0]);
			} else {
				var listDayDiv = '<div class="list-day-div" year="' + year + '" month="'+ month + '" date="'+ monthDate +'" ><h5>'+ monthNames[month] + " " + monthDate + ", " + year +'</h5></div>'
				$(listDayDiv).appendTo('#list-div');
				var eventDiv = '<div class="list-event-div"><p>' + newHour + ":" + min + ampm + ": " + eventName + "</p></div>";
				$(eventDiv).appendTo('#list-div');
			}
			console.log($dateDiv[0]);
			// if($dateDiv){
			// 	$('testing').appendTo($dateDiv);
			// }else {
			// 	$("didn't work").appendTo('#list-div');
			// }
			
		};
		
	};

	//saves the event to JSON so we can navigate to a different month and it'll be there when we come back
	var saveEvent = function(date, eventName){
		var jsonEvent = {
			datetime:date,
			eventName:eventName
		};
		eventList.push(jsonEvent);
	};

	var updateEvent = function(oldDate, oldEventName, newDate, newEventName){
		// alert("updating stuff");
		for (var i = 0; i < eventList.length; i++){
			var oldEvent = eventList[i];
			if (oldEvent.datetime.toString() === oldDate.toString() && oldEventName === oldEvent.eventName) {
				oldEvent.datetime = newDate;
				oldEvent.eventName = newEventName;
				$td = $('td[year="'+ newDate.getFullYear() +'"][month="' + newDate.getMonth() + '"][date="' + newDate.getDate() +'"]');
				createEvent(newDate, $td, newEventName);
			};
		};

	};

	var deleteEvent = function(delDiv, delEventDate, delEventName){
		for (var i = 0; i < eventList.length; i++){
			var oldEvent = eventList[i];
			if (oldEvent.datetime.toString() === delEventDate.toString() && delEventName === oldEvent.eventName) {
				eventList.splice(i, 1);
				delDiv.remove();
				$('#popup').remove();
			};
		};

	};

	//loads the events from JSON
	var loadEvents = function(){
		for (var i = 0; i < eventList.length; i++){
			var calendarEvent = eventList[i];
			var date = calendarEvent.datetime;
			var eventName = calendarEvent.eventName;
			$td = $('td[year="'+ date.getFullYear() +'"][month="' + date.getMonth() + '"][date="' + date.getDate() +'"]');
			createEvent(date, $td, eventName);
			// console.log($td);
		}
	};

	// sets up click handlers at start, and every time new month is created.
	var clickHandlers = function() {
		$( "#forward-month" ).click(function() {
	  		viewNextMonth();
		});

		$( "#back-month" ).click(function() {
	  		viewLastMonth();
		});

		$('#list-view').click(function(){
			view = "list-view";
			// unhide calendar-view button
			$('#calendar-view').show();
			$('#list-view').hide();
			$('#month-name').hide();
			var html = '<div class="container"><div class="row"><div id="list-div" class="col-xs-12"><h4>List of Events</h4></div></div></div>';
			$('#main-window').html(html);

			for(var i = 0; i < eventList.length; i++ ){
				listEvent = eventList[i];
				var placeholder = '';
				if (listEvent.datetime > today){
					createEvent(listEvent.datetime, placeholder, listEvent.eventName);
				};
				
			};
		});

		$('#calendar-view').click(function(){
			view = "calendar-view";
			// unhide calendar-view button
			$('#calendar-view').hide();
			$('#list-view').show();
			$('#month-name').show();
			$('#main-window').html('')
			populateDays();
		});

		$("#calendar-table").click(function(event){
			if ($(event.target).is('td')) {
				var year = $(event.target).attr('year');
				var month = $(event.target).attr('month');
				var date = $(event.target).attr('date');
				popUpForm(new Date(year, month, date), event.target);
			};
			// if click on existing event, popup form again to edit
			if ($(event.target).is('.calendar-event')) {
				// pull all of the variables out of HTML data
				var oldHour = $(event.target).attr('hour');
				if(oldHour < 10){
					oldHour = "0" + oldHour;
				};
				var oldMin = $(event.target).attr('min');
				if(oldMin < 10){
					oldMin = "0" + oldMin;
				};
				var oldEventName = $(event.target).attr('eventName');
				var $par = $(event.target).parent();
				var year = $par.attr('year');
				var month = $par.attr('month');
				var date = $par.attr('date');
				var oldEventDate = new Date(year, month, date, oldHour, oldMin);
				//popup the form to edit
				popUpForm(oldEventDate, $par);
				//remove event from submit button
				$("#new-event-submit").unbind();
				//change the ID of the submit button & add old values to form
				$('#new-event-submit').attr("ID", "update-event");
				$('#event_name').val(oldEventName);
				$('#event_time').val(oldHour + ':' + oldMin);

				// add a delete button
				$('<a id="delete-event">Delete Event</a>').appendTo('#popup');

				// Delete button click handler
				var $calEvent = event.target;
				$('#delete-event').click(function(event){
					deleteEvent($calEvent, oldEventDate, oldEventName)

				})

				// define new event for submit button
				$("#update-event").click(function(e) {
					e.preventDefault();

					// alert(oldEventDate);

					var $formData = $( '#new-event' ).serializeArray();
					// get the time, hour, minute & eventName from the form
					var formTime = $formData[1]["value"];
					var newHour = formTime.substring(0,2);
					var newMin = formTime.substring(3);
					var newEventName = $formData[0]["value"];
					// Set up a new date element with the hour and minute from the form, and the date from the date variable.
					newEventDate = new Date(oldEventDate.getFullYear(), oldEventDate.getMonth(), oldEventDate.getDate(), newHour, newMin);
					// make sure the form isn't empty
					if (formTime && newEventName){
						event.target.remove();
						updateEvent(oldEventDate, oldEventName, newEventDate, newEventName);
						$('#popup').remove();
					} else {
						// show error message
						$('<div style="color:red; text-align:center;">Please fill out all form fields and resubmit.</div>').appendTo('#popup');
					}
				});
			};
		});		
	};


	populateDays();

});