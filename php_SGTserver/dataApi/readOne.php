<?php
//check if you have all the data you need from the client-side call.  
if(!$_GET){
	print('no data');
} else {
//if not, add an appropriate error to errors
	$name = $_GET['name'];
}
$selectOne = "SELECT * FROM `student_data` WHERE `name` = '$name'"; 

$result = $conn->query($selectOne);
 
if(empty($result)){
	$output['error'][]= "no data";
} else {
	if(mysqli_num_rows($result)>0){
	$output['success'] = true;
	while($row = mysqli_fetch_assoc($result)){
		$output['data'][]=$row;
	}

	}

}

?>