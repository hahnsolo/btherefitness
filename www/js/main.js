function check() {
    if((window.localStorage.getItem("preWorkout") !== null) && (window.localStorage.getItem("postWorkout") === null)){
		if(checkTime()){
			hideSelect("pwt");
			$("#awt").css("display", "block");
			$("#postButtons").css("display", "block");
		}
		else{
			window.localStorage.removeItem("preWorkout");
			location.reload();
		}
    }
	else if((window.localStorage.getItem("preWorkout") === null) && (window.localStorage.getItem("postWorkout") !== null)){
		hideSelect("awt");
		$("#pwt").css("display", "block");
		$("#preButtons").css("display", "block");
	}
    else if((window.localStorage.getItem("preWorkout") !== null) && (window.localStorage.getItem("postWorkout") !== null)){
		hideSelect("pwt");
		hideSelect("awt");
	}
	else{
        $("#pwt").css("display", "block");
		$("#preButtons").css("display", "block");
		$("#awt").css("display", "block");
		$("#postButtons").css("display", "block");
    }
}

function hideSelect(id){
	$("#" + id).hide();
	$("#" + id).css("color", "green");
	$("#" + id).html("Workout Mood Recorded!!!");
	var imgValue = "";
	if(id === "pwt"){
		$("[id^='pw']:not(#pwt)").fadeOut();
		imgValue = JSON.parse(window.localStorage.getItem("preWorkout"))[0];
		$("#preButtons").append("<img style='margin-left:auto; margin-right:auto; display:block;' id='pFinal' src='img/" + imgValue + ".PNG' />");
		$("#preButtons").append("<button type='button' class='btn-primary act-button' onclick='pRetry();'>Re-enter post-workout mood?</button>");
		$("#pwt").show("slow");
		$("#preButtons").show("slow");
	}
	else if(id === "awt"){
		$("[id^='aw']:not(#awt)").fadeOut();
		imgValue = JSON.parse(window.localStorage.getItem("postWorkout"))[0];
		$("#postButtons").append('<img style="margin-left:auto; margin-right:auto; display:block;" id="aFinal" src="img/' + imgValue + '.PNG" />');
		$("#postButtons").append("<button type='button' class='btn-primary act-button' onclick='aRetry();'>Re-enter post-workout mood?</button>");
		$("#awt").show("slow");
		$("#postButtons").show("slow");
	}
	$("#grayOut").removeClass("gray-out");
}

function preCalc(elmnt, value) {
	if(window.localStorage.getItem("preWorkout") === null){
		var data = [];
		$("#pwt").hide();
		$("[id^='pw']").fadeOut();
		$("#pwt").css('color', 'green');
		$("#pwt").html('Workout Mood Recorded!!!');
		data.push(value);
		$("#preButtons").append("<img style='margin-left:auto; margin-right:auto; display:block;' id='pFinal' src='img/" + value + ".PNG' />");
		var time = grabTime();
		data.push(time);
		window.localStorage.setItem("preWorkout", JSON.stringify(data));
		$("#preButtons").append("<button type='button'" +  
			"class='btn-primary act-button' onclick='pRetry();'>" + 
			"Re-enter pre-workout mood?</button>");
		$("#pwt").show("slow");
		$("#grayOut").removeClass("gray-out");
	}
}

function pRetry(){
	$("#pwt").hide();
	$("#preButtons button").fadeOut();
	$("#pFinal").fadeOut();
	$("#pwt").css("color", "");
	$("#pwt").html("Pre-Workout Mood");
	$("#preButtons button").remove();
	$("#pFinal").remove();
	window.localStorage.removeItem("preWorkout");
	$("#pwt").show("slow");
	$("[id^='pw']").show("slow");
	aRetry();
	if(window.localStorage.getItem("postWorkout") === null){
		$("#grayOut").addClass("gray-out");
	}
}

function postCalc(elmnt, value){
	if((window.localStorage.getItem("postWorkout") === null) && (window.localStorage.getItem("preWorkout") !== null)){
		var data = [];
		$("#awt").hide();
		$("[id^='aw']").fadeOut();
		$("#awt").css('color', 'green');
		$("#awt").html('Workout Mood Recorded!!!');
		data.push(value);
		$("#postButtons").append("<img style='margin-left:auto; margin-right:auto; display:block;' id='aFinal' src='img/" + value + ".PNG' />");
		var time = grabTime();
		data.push(time);
		window.localStorage.setItem("postWorkout", JSON.stringify(data));
		$("#postButtons").append("<button type='button' class='btn-primary act-button' onclick='aRetry();'>Re-enter post-workout mood?</button>");
		$("#awt").show("slow");
	}
}

function aRetry(){
	$("#awt").hide();
	$("#postButtons button").fadeOut();
	$("#aFinal").fadeOut();
	$("#awt").css("color", "");
	$("#awt").html("Post-Workout Mood");
	$("#postButtons button").remove();
	$("#aFinal").remove();
	window.localStorage.removeItem("postWorkout");
	$("#awt").show("slow");
	$("[id^='aw']").show("slow");
}

function submitMoods(){
	$("#subButton").attr("disabled", true);
	if((window.localStorage.getItem("preWorkout") !== null) && (window.localStorage.getItem("postWorkout") !== null)){
		var preDat = JSON.parse(window.localStorage.getItem("preWorkout"));
		var posDat = JSON.parse(window.localStorage.getItem("postWorkout"));
		/*
		preWork: window.localStorage.getItem("preWorkout"),
					posWork: window.localStorage.getItem("postWorkout")
					*/
		if((preDat.length == 2) && (posDat.length == 2)){
			var a = "a";
			var b = "b";
			$.ajax({
				type: "POST",
				async: "true",
				url: "http://www.greenseedmusic.com/btherecheckmeet.php",
				data: {
					preWork: a,
					posWork: b
				},
				success: function(data){
					alert("S: " + data);
				},
				error: function(e){
					alert("E: " + e.status);
				}
			}).done(function(){
				window.localStorage.removeItem("preWorkout");
				window.localStorage.removeItem("postWorkout");
				location.reload();
			});
			/*
			*	Put into "Success" once PHP complete...
			*/
		}
	}
	else{
		alert("Please ensure all inputs - moods - have been input, then hit the button again.");
	}
	$("#subButton").attr("disabled", false);
}

function hideButtons(type){
	$("img[id^='" + type + "']").css("display", "none");
}

function showButtons(type){
	$("img[id^='" + type + "']").css("display", "block");
}

function grabTime(){
	var date = new Date(),
		hour = date.getHours(),
		minu = date.getMinutes(),
		seco = date.getSeconds(),
		time = hour + ":" + minu + ":" + seco;
	return time;
}

function checkTime(){
	var storTime = JSON.parse(window.localStorage.getItem("preWorkout"))[1];
	var time1 = getTimeInSec(storTime);
	var time2 = getTimeInSec(grabTime());
	var tDiff = time2 - time1;
	if(tDiff > (3600 * 3)){
		return false;
	}
	return true;
}

function getTimeInSec(time){
	var arr = time.split(":");
	var timeInSec = (arr[0] * 3600) + (arr[1] * 60) + (arr[2]);
	return timeInSec;
}

/*	Defunct Code */
/*
$(".col-xs-3").append("<img src='img/gray.png' class='img-circle' style='opacity:0.5; position:absolute; width:36px; top:0px;'>");
*/