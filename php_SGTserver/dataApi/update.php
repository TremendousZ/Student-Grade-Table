<?php

//check if you have all the data you need from the client-side call.  This should include the fields being changed and the ID of the student to be changed
if(!$_GET){
	print('no data');
} else {
	$name = $_GET['name'];
	$grade = $_GET['grade'];
	$course_name = $_GET['course'];
	$id = $_GET['id'];
//if not, add an appropriate error to errors
}

//write a query that updates the data at the given student ID.  
$editStudent = "UPDATE `student_data` SET `name` = '$name', `grade` = '$grade', `course_name` = '$course_name' WHERE `id` = '$id'";


//send the query to the database, store the result of the query into $result
$result = $conn->query($editStudent);

//check if $result is empty. 
if(empty($result)){
	$output['error'][] = 'database error';
} else {
	if(mysqli_affected_rows($conn) === 1){
		$output['success'] = true;
	} else {
		$output['error'] = 'update error';
	}
}
	//if it is, add 'database error' to errors
//else: 
	//check if the number of affected rows is 1.  Please note that if the data updated is EXCACTLY the same as the original data, it will show a result of 0
		//if it did, change output success to true
	//if not, add to the errors: 'update error'

?>