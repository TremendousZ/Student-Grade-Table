<?php

//check if you have all the data you need from the client-side call. 
if(){

} else{
//if not, add an appropriate error to errors

}
//write a query that deletes the student by the given student ID 
$deleteStudent = 'DELETE FROM student_data WHERE id = studentId';


//send the query to the database, store the result of the query into $result
$result = $conn->query($deleteStudent);

//check if $result is empty.  
if(empty($result)){
	$output['error'][]= "database error";
} else {
	if(mysqli_num_rows($result) === 1){
		$output['success'] = true;
	} else {
		$output['error'] = 'delete error';
	}
}
	//if it is, add 'database error' to errors
//else: 
	//check if the number of affected rows is 1
		//if it did, change output success to true
		
	//if not, add to the errors: 'delete error'

?>