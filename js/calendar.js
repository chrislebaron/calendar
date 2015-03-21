$( document ).ready(function() { 

	//initial variable setup
	var today = new Date();
	var firstOfMonth = new Date(today.getFullYear(), today.getMonth(), today.getDate()-today.getDate()+1);
	var firstOfNextMonth = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth()+1, 1);
	var firstOfLastMonth = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth() -1, 1);
	var lastOfMonth = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth()+1, 0);
	var monthLength = lastOfMonth.getDate();
	var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	var setupDates = function(today) {
		// today = new Date(2015, 3, 15);
		firstOfMonth = new Date(today.getFullYear(), today.getMonth(), today.getDate()-today.getDate()+1);
		firstOfNextMonth = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth()+1, 1);
		firstOfLastMonth = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth() -1, 1);
		lastOfMonth = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth()+1, 0);
		monthLength = lastOfMonth.getDate();
		
	}
	

	var populateDays = function(){
		var lastMonthDays = firstOfMonth.getDay() + 1;
		var nextMonthDays = 7 - lastOfMonth.getDay();
		var totalDays = monthLength + lastMonthDays + nextMonthDays;
		console.log("lastMonthDays: " + lastMonthDays + "<br />nextMonthDays: " + nextMonthDays + "totalDays: " + totalDays);
		var date = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth(), firstOfMonth.getDate() - lastMonthDays );
		console.log(date);
		var output = '';
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
		$("#month-name").html('<span id="back-month"><</span> ' + monthNames[today.getMonth()] + " " + today.getFullYear() + ' <span id="forward-month">></span>' );
	};

	var viewNextMonth = function() {
		setupDates(firstOfNextMonth);
		populateDays();
	}

$('forward-month').click(function(event){
	alert('Ha');
	viewNextMonth();
})

populateDays();

});