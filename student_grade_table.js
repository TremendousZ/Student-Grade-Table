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
let studentUser = false;
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
      showLogin();
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
      $("#blackOut").on("click", closeModal);
      $("#closeModal").on("click", closeModal);
      $('#clearEditInputs').on('click', clearInputs);
      $('.editModal').on("click",function(){
            event.stopPropagation();
      });
      $('.deleteCheck').on("click",function(){
            event.stopPropagation();
      });
      $('.studentReportCard').on("click",function(){
            event.stopPropagation();
      });    
      $('.courseReport').on('click',()=>{
            event.stopPropagation();
      }) 
      $("#userIsStudent").on('click', studentPortal);
      $("#userIsTeacher").on('click', teacherPortal);
      $('#teacherLogIn').on('click',enterTeacherPortal);
      $('#studentLogIn').on('click',enterStudentPortal);
      $('#logOut').on('click',showLogin);
      $('.reset').on('click',reset);
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

function getStudentCourseList(studentName){
      let studentData = {
            datatype: "json",
            url: "php_SGTserver/data.php",
            method: 'GET',
            data: {action:'readOne',
            name: studentName,
            },
            success: populateReportCard,
      }
      $.ajax(studentData);
}

function populateReportCard(response){
      let dataObject = JSON.parse(response);
      let classList = dataObject.data;
      for(let index = 0; index< classList.length; index++){
            let studentReportCard = $('<tr>');
            let studentCourseDiv = $('<td>').text(classList[index].course_name);
            let studentGradeDiv = $('<td>').text(classList[index].grade).addClass('studentGrade');
            studentReportCard.append(studentCourseDiv, studentGradeDiv);
            $("#courseList").append( studentReportCard);
      }
      $('.rc-studentGradeAvg span').append(calculateGradeAverage(classList));
      $('.rc-gpa span').append(calculateGPA(classList));
}

function getCourseReport(courseName){
      let studentData = {
            datatype: "json",
            url: "php_SGTserver/data.php",
            method: 'GET',
            data: {
                  action:'oneClass',
                  course: courseName,
            },
            success: populateCourseReportCard,
      }
      $.ajax(studentData);
}

function populateCourseReportCard(response){
      let dataObject = JSON.parse(response);
      let studentList = dataObject.data;
      for(let index = 0; index< studentList.length; index++){
            let courseReportCard = $('<tr>');
            let studentNameDiv = $('<td>').text(studentList[index].name);
            let studentGradeDiv = $('<td>').text(studentList[index].grade).addClass('studentGrade');
            courseReportCard.append(studentNameDiv, studentGradeDiv);
            $("#studentList").append( courseReportCard);
      }
      $('.cr-courseGradeAvg span').append(calculateGradeAverage(studentList));
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
      let nameRegexCheck = /^[a-zA-Z ]+$/;
      let courseRegexCheck = /^([A-Z]{1}[a-z ]{1,15}) [0-9]{3}/
      let gradeRegexCheck = /(?:\b|-)([1-9]{1,2}[0]?|100)\b/g;

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
      });
      operationTd.append(editButton,deleteButton);
      studentRow.append( studentNameDiv, studentCourseDiv, studentGradeDiv, operationTd);
      $("#tableDataGoesHere").append( studentRow);
}

function renderReportCard(){
      var studentReportCard = $('<tr>');
      var studentCourseDiv = $('<td>').text(student_obj.course_name);
      var studentGradeDiv = $('<td>').text(student_obj.grade).addClass('studentGrade');
      studentRow.append(studentCourseDiv, studentGradeDiv);
      $(".courseList").append( studentReportCard);
}

function renderCourseReport(){
      var courseReport = $('<tr>');
      var studentNameDiv = $('<td>').text(student_obj.name);
      var studentGradeDiv = $('<td>').text(student_obj.grade).addClass('studentGrade');
      studentRow.append(studentNameDiv, studentGradeDiv);
      $(".studentList").append(courseReport);
}
/***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateStudentList(array){
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

function calculateGPA(array){
      let gpaArray = [];
      for(var index = 0; index < array.length; index++) {
            let currentGrade = parseInt(array[index].grade);
            if( currentGrade > 93){
                  gpaArray.push(4.00);
            } else if(currentGrade > 89 && currentGrade < 94){
                  gpaArray.push(3.70);
            } else if(currentGrade > 86 && currentGrade < 90){
                  gpaArray.push(3.33);
            } else if(currentGrade > 82 && currentGrade < 87){
                  gpaArray.push(3.00);
            } else if(currentGrade > 79 && currentGrade < 83){
                  gpaArray.push(2.70);
            } else if(currentGrade > 76 && currentGrade < 80){
                  gpaArray.push(2.30);
            } else if(currentGrade > 72 && currentGrade < 77){
                  gpaArray.push(2.00);
            } else if(currentGrade > 69 && currentGrade < 73){
                  gpaArray.push(1.70);
            } else if(currentGrade > 66 && currentGrade < 70){
                  gpaArray.push(1.30);
            } else if(currentGrade > 62 && currentGrade < 67){
                  gpaArray.push(1.00);
            } else if(currentGrade > 59 && currentGrade < 63){
                  gpaArray.push(0.70);
            } else if(currentGrade <= 59){
                  gpaArray.push(0.00);
            }
      }
      let currentGPA = ((gpaArray.reduce((a,b)=>a + b))/gpaArray.length).toFixed(2)
      if(currentGPA < 2.00){
            $('#academicProbationWarning').text("Warning: Your GPA needs to be higher than a 2.00 to avoid academic probation.").css('color', 'red');
      }
      return currentGPA;
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
      event.preventDefault();
      $("#blackOut").removeClass('hidden').addClass('visible');
      $(".editModal").addClass('show');
      $('.currentStudentName span').text(student_obj.name);
      $("#editStudentName").val("").css('background-color', 'white');
      $("#editStudentCourse").val("").css('background-color', 'white');
      $("#editStudentGrade").val("").css('background-color', 'white');
      $('.goodEditName').empty();
      $('.goodEditCourse').empty();
      $('.goodEditGrade').empty();
      $('.currentStudentCourse span').text(student_obj.course_name);
      $('.currentStudentGrade span').text(student_obj.grade);
      $('#studentIdNumber').text(student_obj.id);
      //$('#editStudentButton').on('click', closeModal);
}

function closeModal(){
      
      if(studentUser == true){
            return;
      }
      $('#blackOut').addClass('hidden').removeClass('visible');
      $('.editModal').removeClass('show');
      $('.deleteCheck').removeClass('show');
      $('.studentReportCard').removeClass('show');
      $('.courseReport').removeClass('show');
      $('#courseList').empty();
      $('.rc-studentName span').text('');
      $('.rc-studentGradeAvg span').text('');
      $('.rc-gpa span').text('');
      $('#academicProbationWarning').text('');
      $('.cr-courseName span').text('');
      $('.cr-courseGradeAvg span').text('');
      $('#studentList').empty();
      clearInputs();
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
      closeModal();      
      
}

function showLogin(){
      $("#login").addClass('show');
      $("#blackOut").removeClass("whiteOut");
      $(".welcomeHeader").removeClass("hidden hidden-fade").addClass("visible");
      $('#studentLogOut').addClass('hidden');
      studentUser = false;
      closeModal();
}

// Show modal to confirm if the listing should be deleted

function deleteStudentCheck(student_obj){
      $('.deleteCheck').addClass('show');
      $('#blackOut').removeClass('hidden').addClass('visible');
      $('#deleteName').text(`Student Name :  ${student_obj.name}`);
      $('#deleteCourse').text(`Course Name :  ${student_obj.course_name}`);
      $('#deleteGrade').text(`Grade :  ${student_obj.grade}`);
      $('#cancelDelete').on('click', ()=>{
            closeModal();
            student_obj='';
      } );
      $('#blackOut').on('click', ()=>{
            closeModal();
            student_obj='';
      } );
      $('#cancelDelete').on('click', ()=>{
            closeModal();
            student_obj='';
      } )
      $('#confirmDelete').on('click', ()=> {
            deleteStudentFromServer(student_obj);
            closeModal();
      })   
}

// Show the report card, get the grade average, and get the GPA

function studentReportCard(name){
      $('#blackOut').removeClass('hidden').addClass('visible');
      $('.studentReportCard').addClass('show');
      $('#closeModalRC').removeClass('hidden');
      $('.rc-studentName span').text(`${name}`);   
      getStudentCourseList(name);  
}

function checkNameInput(){
      let succesfulInput = $('<div>').addClass('glyphicon glyphicon-ok successfulEditInput').css('color','green');
      let nameRegexCheck = /^[a-zA-Z ]+$/;
      let editStudentInput = $('#editStudentName').val();

      if(nameRegexCheck.test(editStudentInput)){
            $('#editStudentName').css('background-color', 'lightgrey');
            $('.goodEditName').append(succesfulInput);
            $('#editStudentName').removeClass('error');
            $('.editNameError').text("");
      } else {
            $('.editNameError').text("Please enter a student name that only contains letters");
            $('#editStudentName').addClass('error');
      }
}

function checkCourseInput(){
      let succesfulInput = $('<div>').addClass('glyphicon glyphicon-ok successfulCourseInput').css('color','green');
      let courseRegexCheck = /^([A-Z]{1}[a-z ]{1,15}) [0-9]{3}/
      let editCourseInput = $('#editStudentCourse').val();

      if(courseRegexCheck.test(editCourseInput)){
            $('#editStudentCourse').css('background-color', 'lightgrey');
            $('.goodEditCourse').append(succesfulInput);
            $('#editStudentCourse').removeClass('error');
            $('.editCourseError').text('')
      } else {
            $('.editCourseError').text("Please enter a Course Name with a capital first letter and a space before the course number. Ex: Math 415");
            $('#editStudentCourse').addClass('error');
      }
}

function checkGradeInput(){
      let succesfulInput = $('<div>').addClass('glyphicon glyphicon-ok successfulGradeInput').css('color','green');
      let gradeRegexCheck = /(?:\b|-)([1-9]{1,2}[0]?|100)\b/g;
      let editGradeInput = $('#editStudentGrade').val();

      if(gradeRegexCheck.test(editGradeInput)){
            $('#editStudentGrade').css('background-color', 'lightgrey');
            $('.goodEditGrade').append(succesfulInput);
            $('#editStudentGrade').removeClass('error');
            $('.editGradeError').text('')
      } else {
            $('.editGradeError').text("Please enter a number between 1 and 100");
            $('#editStudentGrade').addClass('error');
      }
}

function clearInputs(){
      debugger;
      $('#editStudentName').val('').css('background-color', 'white').removeClass('error');
      $('#editStudentCourse').val('').css('background-color', 'white').removeClass('error');
      $('#editStudentGrade').val('').css('background-color', 'white').removeClass('error');
      $('.goodEditName').empty();
      $('.goodEditCourse').empty();
      $('.goodEditGrade').empty();
      $('.editNameError').text('');
      $('.editCourseError').text('');
      $('.editGradeError').text('');
}

function courseReportCard(course){
      $('#blackOut').removeClass('hidden').addClass('visible');
      $('.courseReport').addClass('show');
      $('.cr-courseName span').text(`${course}`);   
      getCourseReport(course);  
}

function studentPortal(){
      let header = $('.welcomeHeader');
      header.addClass('hidden-fade');
      $('.rightColumn').removeClass('hidden').addClass('visible');
      $('.studentLogo').removeClass('hidden').addClass('visible');
      setTimeout(()=>{header.addClass('hidden')},1000);     
}

function teacherPortal(){
      let header = $('.welcomeHeader');
      header.addClass('hidden-fade');
      $('.leftColumn').removeClass("hidden").addClass('visible');
      $('.teacherLogo').removeClass('hidden').addClass('visible');
      setTimeout(()=>{header.addClass('hidden')},1000);
}

function reset(){
      let header = $('.welcomeHeader');
      header.removeClass('hidden-fade');
      $('.rightColumn').addClass('hidden').removeClass('visible');
      $('.studentLogo').addClass('hidden').removeClass('visible');
      $('.leftColumn').addClass("hidden").removeClass('visible');
      $('.teacherLogo').addClass('hidden').removeClass('visible');
      setTimeout(()=>{header.removeClass('hidden')},1000);  

}

function enterTeacherPortal(){
      let userTeacherIdInput = $('#teacherLoginInfo').val();
      let userTeacherPassword = $('#teacherPassword').val();

      if(userTeacherIdInput === "bsmith"){
            if(userTeacherPassword==="cpp123"){
                  $('#login').removeClass('show');
                  $('.mainBody').addClass('visible'); 
                  $('.leftColumn').removeClass('visible').addClass("hidden");
                  $('.teacherLogo').removeClass('visible').addClass("hidden"); 
                  $('.teacherPassword span').text("");

            }else{
                  $('.teacherUserName span').text("");
                  $('.teacherPassword span').text(" Please Enter a Valid Password").css('color','red');      
            }
             
      } else{
            $('.teacherUserName span').text(" Please Enter a Valid Teacher Login ID").css('color','red');
            return;
      }
      
}

function enterStudentPortal(){
      let name;
      let userEnteredStudentId = $('#studentLoginId').val();
      switch(userEnteredStudentId){
            case "jcarlisle":
            name = "John Carlisle";
            break;
            case "hmartin":
            name = "Howard Martin";
            break;
            case "ftaylor":
            name = "Fred Taylor";
            break;
            default:
            $('.studentUserName span').text(" Please enter a valid student ID").css('color','red');
            return;     
      }
      $('.studentUserName span').text("");
      $(".rightColumn").removeClass('visible').addClass("hidden");
      $('.studentLogo').removeClass('visible').addClass("hidden"); 
      studentReportCard(name);
      studentView()
}

function studentView(){
      $('#blackOut').addClass('whiteOut');
      $('#studentLogOut').removeClass('hidden').on('click',()=>{showLogin()});
      $('#closeModalRC').addClass('hidden');
      studentUser = true;
}

function clearInputs(){
      $('#teacherLoginInfo').val("");
      $('#teacherPassword').val("");
      $('#studentLoginId').val("");
}