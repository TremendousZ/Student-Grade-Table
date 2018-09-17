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
      let nameRegexCheck = /^[a-zA-Z]+$/;
      let courseRegexCheck = /^([A-Z]{1}[a-z]{1,15}) [0-9]{3}/
      let gradeRegexCheck = /[0-9]{1,3}/;

      if ( nameRegexCheck.test(studentNameInput)) {
          if(courseRegexCheck.test(studentCourseInput)) {
            if(gradeRegexCheck.test(studentGradeInput)) {
                  addStudentToServer(studentObject);
                  clearAddStudentFormInputs();
                  getStudentData();
                  $("#studentCourseError").text('');
                  $('#studentNameError').text('');
                  $("#studentGradeError").text('');
            } else{
                  $("#studentCourseError").text('');
                  $("#studentGradeError").text("Please enter a number between 1 and 100");
            }
          } else {
                  $('#studentNameError').text('');
                  $("#studentCourseError").text("Please enter a Course Name with a capital first letter and a space before the course number. Ex: Math 415");
          }
      } else{
            $('#studentNameError').text("Please enter a student name that only contains letters");
      }
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
      $("#studentName").val("");
      $("#course").val("");
      $("#studentGrade").val("");
}

function editStudentFromServer (student_obj ) {
      studentToEdit = {
            dataType: "json",
            url: "php_SGTserver/data.php",
            method: "GET",
            data: {
                  action:'update',
                  name: student_obj.name,
                  course_name: student_obj.course_name,
                  grade: student_obj.grade,
                  student_id: student_obj.student_id,
             },
            success: function(response) {
                  getStudentData();
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
      var studentCourseDiv = $('<td>').text(student_obj.course_name)
      var studentGradeDiv = $('<td>').text(student_obj.grade);
      var operationTd = $('<td>');
      var editButton = $('<button>').addClass('btn btn-warning').text("Edit");
      editButton.on('click', ()=>{
            editStudent(student_obj.name,student_obj.course,student_obj.grade,student_obj.student_id);
            $(".blackOut").addClass('show');
      })
      var deleteButton = $('<button>').addClass('btn btn-danger delete').text("Delete");
      deleteButton.on('click', ()=>{
            deleteStudentFromServer(student_obj);
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



function editStudent(name , course , grade, studentId){
      $('.currentStudentName span').text(name);
      let newStudentName = $("#editStudentName").val();
      if(newStudentName === ""){
            newStudentName = name;
      }
      
      $('.currentStudentCourse span').text(course);
      let newStudentCourse = $("#editStudentCourse").val();
      if(newStudentCourse === ""){
            newStudentCourse = course;
      }
      
      $('.currentStudentGrade span').text(grade);
      let newStudentGrade = $("#editstudentGrade").val();
      if(newStudentGrade === ""){
            newStudentGrade = grade;
      }  
}

function closeModal(){
      $('#blackOut').removeClass('show');
}

function addEditedStudent(name, course, grade, studentId){

      var editedStudent_obj = {
            name: name,
            course: course,
            grade: grade,
            student_id: studentId
      }
      
      editStudentFromServer(editedStudent_obj,studentId);
      
}

function showLogin(){
      $("#login").addClass('show');

}