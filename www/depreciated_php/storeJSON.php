<?php
	$file = "storage.json";
	$set1 = json_decode($_POST["set1"], true);
	$set2 = json_decode($_POST["set2"], true);
	
	$temp = array(
		"workout" => array(
			"start" => array(
				"mood" => $set1[0],
				"time" => $set1[1]
			),
			"end" => array(
				"mood" => $set2[0],
				"time" => $set2[1]
			)
		)
	);
	
	$old;
	$input = file_get_contents($file);
	if(filesize($file) > 0){
		$old = json_decode($input);
		foreach($old->w/o as $work){
			array_push($temp, $work);
		}
	}
	//rray_push($temp, json_decode($old, true));
	
	$json = json_encode($temp);
	file_put_contents($file, $json);
?>