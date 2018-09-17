<?php

//check if you have all the data you need from the client-side call.  
if(!$_GET){
	print('no data');
} else {
//if not, add an appropriate error to errors
	$name = $_GET['name'];
	$grade = $_GET['grade'];
	$course_name = $_GET['course_name'];
}


//write a query that inserts the data into the database.  remember that ID doesn't need to be set as it is auto incrementing
$insertData = "INSERT INTO `student_data` (`name`, `grade`, `course_name`) VALUES ('$name','$grade','$course_name')";

$result = $conn->query($insertData);
//send the query to the database, store the result of the query into $result


//check if $result is empty.  
if(empty($result)){
	//if it is, add 'database error' to errors
	$output['error'][] = 'database error';
} else {
	//else: 
	//check if the number of affected rows is 1
	if (mysqli_affected_rows($conn) > 0){
		//if it did, change output success to true
		$output['success'] = true;
		//get the insert ID of the row that was added
		
		$last_id = $conn->insert_id;
		//add 'insertID' to $outut and set the value to the row's insert ID
		$output = $last_id;
		
	}else{
	//if not, add to the errors: 'insert error'
	$output['errors'][] = 'insert error';
	}
}
	


?>