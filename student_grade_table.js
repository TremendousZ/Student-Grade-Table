/* information about jsdocs: 
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
* 
/**
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp);

/**
 * Define all global variables here.  
 */

var student_array = [];
/***********************
 * student_array - global array to hold student objects
 * @type {Array}
 * example of student_array after input: 
 * student_array = [
 *  { name: 'Jake', course: 'Math', grade: 85 },
 *  { name: 'Jill', course: 'Comp Sci', grade: 85 }
 * ];
 */

/***************************************************************************************************
* initializeApp 
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions
*/
function initializeApp(){
      addClickHandlersToElements();
      clearAddStudentFormInputs();
      getStudentData();
      // showLogin();
}

/***************************************************************************************************
* addClickHandlerstoElements
* @params {undefined} 
* @returns  {undefined}
*     
*/
function addClickHandlersToElements(){
      $(".add").on("click", handleAddClicked);
      $(".cancel").on("click", handleCancelClick);
      $(".getData").on("click", getStudentData); 
      // $("#blackOut").on("click", closeModal);
      $("#closeModal").on("click", closeModal);
      
}


function getStudentData(){
      var studentData = {
            dataType:"json",
            url: "php_SGTserver/data.php",
            method:'GET',
            data: {action: 'readAll'},
            success: fillStudentTable,   
      }
      $.ajax(studentData);
}

function fillStudentTable( response ){
      student_array = response.data;
      $('tbody').empty();
      updateStudentList( student_array );
}



/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return: 
       none
 */
function handleAddClicked( event ){
      console.log("This Event", event);
      $("#studentGradeError").text('');
      let studentNameInput = $('#studentName').val();
      let studentCourseInput = $("#course").val();
      let studentGradeInput = $('#studentGrade').val();
      let studentObject = {
            name: studentNameInput,
            grade: studentGradeInput,
            course_name: studentCourseInput,
            id:null,
      }
      let nameRegexCheck = /^[a-zA-Z ]+$/;
      let courseRegexCheck = /^([A-Z]{1}[a-z ]{1,15}) [0-9]{3}/
      let gradeRegexCheck = /^[0-9]{1,3}/;

      let succesfulInput = $('<div>').addClass('glyphicon glyphicon-ok successfulInput').css('color','green');

      if ( nameRegexCheck.test(studentNameInput)) {
            $('#studentName').css('background-color', 'lightgrey');
            $('.goodInputName').append(succesfulInput);
          if(courseRegexCheck.test(studentCourseInput)) {
            $('#course').css('background-color', 'lightgrey');
            $('.goodInputCourse').append(succesfulInput);
            if(gradeRegexCheck.test(studentGradeInput)) {
                  $('#studentGrade').css('background-color', 'lightgrey');
                  $('.goodInputGrade').append(succesfulInput);
                  if(event !== undefined) {
                  addStudentToServer(studentObject);
                  clearAddStudentFormInputs();
                  getStudentData();
                  $("#studentCourseError").text('');
                  $('#studentNameError').text('');
                  $("#studentGradeError").text('');
                  }
            } else{
                  $("#studentCourseError").text('');
                  $("#studentGradeError").text("Please enter a number between 0 and 100");
            }
          } else {
                  $('#studentNameError').text('');
                  $("#studentCourseError").text("Please enter a Course Name with a capital first letter and a space before the course number. Ex: Math 415");
          }
      } else{
            $('#studentNameError').text("Please enter a student name that only contains letters");
      }
}

function verifyInput(){

}
/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClick(){
      clearAddStudentFormInputs();
}
/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */
// function addStudent(){
//       var student_obj = {
//             name: $("#studentName").val(),
//             course: $("#course").val(),
//             grade: $('#studentGrade').val(),    
//       };
      
//       student_array.push(student_obj);
//       console.log(student_obj);
//       clearAddStudentFormInputs();
//       updateStudentList(student_array);
// }

function addStudentToServer(student_obj){
    
      var studentToAdd = {
            dataType: 'json',
            url: "php_SGTserver/data.php",
            method:"GET",
            data: { 
                  action: 'insert',
                  name: student_obj.name,
                  course_name: student_obj.course_name,
                  grade: student_obj.grade,
                  student_id: student_obj.student_id,
            } ,
            success: function() {
                        getStudentData();
                        clearAddStudentFormInputs();    
            },
            failure: function(param, param2, param3){
                  debugger;

            }
      } 
      $.ajax(studentToAdd);
}
/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs(){
      $("#studentName").val("").css('background-color','white');
      $('.goodInputName').empty();
      $("#course").val("").css('background-color','white');
      $('.goodInputCourse').empty();
      $("#studentGrade").val("").css('background-color','white');
      $('.goodInputGrade').empty();
}

function editStudentFromServer (student_obj ) {
      studentToEdit = {
            dataType: "json",
            url: "php_SGTserver/data.php",
            method: "GET",
            data: {
                  action:'update',
                  name: student_obj.name,
                  course: student_obj.course,
                  grade: student_obj.grade,
                  id: student_obj.id,
             },
            success: function(response) {
                  getStudentData();
            },
            error: function(response){
                  console.log(response);
            }
            
            
      }
      $.ajax(studentToEdit);  
}

function deleteStudentFromServer (student_obj ) {
      studentToDelete = {
            dataType: "json",
            url: "php_SGTserver/data.php",
            method: "GET",
            data: {
                  action:'delete',
                  student_id: student_obj.id,
            },
            success: function(response) {
                  var deleteIndex = student_array.indexOf(student_obj);
                        student_array.splice(deleteIndex,1);
                        $('tbody').empty();
                        getStudentData();
            }
      }
      $.ajax(studentToDelete);
}
/***************************************************************************************************
 * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} studentObj a single student object with course, name, and grade inside
 */
function renderStudentOnDom(student_obj){
      var studentRow = $('<tr>');
      var studentNameDiv = $('<td>').text(student_obj.name);
      studentNameDiv.on('click', ()=>{
            studentReportCard(student_obj.name);
      })
      var studentCourseDiv = $('<td>').text(student_obj.course_name);
      studentCourseDiv.on('click', ()=>{
            courseReportCard(student_obj.course_name);
      }) 
      var studentGradeDiv = $('<td>').text(student_obj.grade).addClass('studentGrade');
      var operationTd = $('<td>').addClass('operationContainer');
      var editButton = $('<div>').addClass('glyphicon glyphicon-pencil editButton');
      editButton.on('click', ()=>{
            editStudent(student_obj);
            
      })
      var deleteButton = $('<div>').addClass('glyphicon glyphicon-trash deleteButton');
      deleteButton.on('click', ()=>{
            deleteStudentCheck(student_obj);
            // deleteStudentFromServer(student_obj);
      });
      operationTd.append(editButton,deleteButton);
      studentRow.append( studentNameDiv, studentCourseDiv, studentGradeDiv, operationTd);
      $("#tableDataGoesHere").append( studentRow);
}

/***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateStudentList(array){
      console.log('student Array:', array );
      for (var index = 0; index < array.length; index++) {
      renderStudentOnDom(array[index]);
      renderGradeAverage(calculateGradeAverage(array));
      }
}
/***************************************************************************************************
 * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
 * @param: {array} students  the array of student objects
 * @returns {number}
 */
function calculateGradeAverage( array ){
      var gradeTotal = 0;
      for(var index = 0; index < array.length; index++) {
            var numberValue = parseInt(array[index].grade);
            gradeTotal += numberValue;
            var gradeAverage = Math.round(gradeTotal / array.length);  
      }
      return gradeAverage;
}



/***************************************************************************************************
 * renderGradeAverage - updates the on-page grade average
 * @param: {number} average    the grade average
 * @returns {undefined} none
 */
function renderGradeAverage( number ){
      $('.avgGrade').text( number );
};



function editStudent(student_obj){
      $("#blackOut").addClass('show');
      $('.currentStudentName span').text(student_obj.name);
      $('.currentStudentCourse span').text(student_obj.course_name);
      $('.currentStudentGrade span').text(student_obj.grade);
      $('#studentIdNumber').text(student_obj.id);
      $('#editStudentButton').on('click', closeModal);
}

function closeModal(){
      $('#blackOut').removeClass('show');
      $('.blackOut2').removeClass('show');
      $('.blackOut3').removeClass('show');
}

function addEditedStudent(){
      event.preventDefault();
      let newStudentName = $("#editStudentName").val();
      if(newStudentName === ""){
            newStudentName = $('.currentStudentName span').text();
      }
      let newStudentCourse = $("#editStudentCourse").val();
      if(newStudentCourse === ""){
            newStudentCourse = $('.currentStudentCourse span').text();
      }
      let newStudentGrade = $("#editStudentGrade").val();
      if(newStudentGrade === ""){
            newStudentGrade = $('.currentStudentGrade span').text();
      }  

      let studentId = $("#studentIdNumber").text();

      
      var editedStudent_obj = {
            name: newStudentName,
            course: newStudentCourse,
            grade: newStudentGrade,
            id: studentId
      }
      
      editStudentFromServer(editedStudent_obj);
      
}

function showLogin(){
      $("#login").addClass('show');

}

function deleteStudentCheck(student_obj){
      $('.blackOut2').addClass('show');
      $('#deleteName').text(`Student Name :  ${student_obj.name}`);
      $('#deleteCourse').text(`Course Name :  ${student_obj.course_name}`);
      $('#deleteGrade').text(`Grade :  ${student_obj.grade}`);
      $('#cancelDelete').on('click', closeModal )
      $('#confirmDelete').on('click', ()=> {deleteStudentFromServer(student_obj)});
      $('#confirmDelete').on('click', closeModal )
}

function studentReportCard(name){
      $('.blackOut3').addClass('show');
      $('.rc-studentName').text(name);
      
}

{/* <div class ="editModal container col-xs-8 col-xs-offset-2">
<button class="btn btn-danger" id="closeModal" >X</button>
<form class="col-xs-offset-1 col-xs-10" onsubmit='addEditedStudent()'>
<div class = "form-group">
    <label class="currentStudentName">Current Student Name: <span></span></label>
    <input type = "text" class = "form-control" id= "editStudentName" placeholder= "New Student Name" />
</div>
<div class = "form-group">
    <label class="currentStudentCourse">Current Student Course: <span></span></label>
    <input type = "text" class = "form-control" id= "editStudentCourse" placeholder= "New Course Name" />
</div>
<div class = "form-group">
    <label class ="currentStudentGrade">Current Student Grade: <span></span></label>
    <input type = "text" class = "form-control" id= "editStudentGrade" placeholder= "New Grade" />
</div>
<button type = "button" class = "btn btn-danger">Clear</button>
<button type = "submit" class = "btn btn-success" id="editStudentButton" >Submit Changes</button>
<p id="studentIdNumber"></p>
</form>
</div> */}

// function launchEditModal(){
//       let editModal = $("<div>").addClass("editModal container col-xs-8 col-xs-offset-2");
//       let closeButton = $("<button>").addClass("btn btn-danger").attr("id","closeModal").text("X");
//       let editForm = $("<form>").addClass("col-xs-offset-1 col-xs-10").attr("onsubmit","addEditedStudent()");
//       let formGroup1 = $("<div>").addClass("form-group");
//       let fg1_label = $("<label>").addClass("currentStudentName").text()
// }