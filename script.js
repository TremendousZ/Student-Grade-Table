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
}


function getStudentData(){
      var studentData = {
            dataType:"json",
            url: "http://s-apis.learningfuze.com/sgt/get",
            method:'POST',
            data: {api_key:'gmXk1sAmOs'},
            success: fillStudentTable,
            
      }
      $.ajax(studentData);
}

 function fillStudentTable( response ){
       debugger;
      // var lfzStudentData = [];
      student_array = response.data;
      // for (var index = 0; index < student_array.length; index++) {
      //       var student = student_array[index]
      //       var studentObject = {
      //             name: student.name,
      //             course: student.course,
      //             grade: student.grade,
      //       }
      //       lfzStudentData.push(studentObject);
      
      // }

      updateStudentList( student_array );
 }



/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return: 
       none
 */
function handleAddClicked( event ){
      // $('tbody').empty();
      let studentNameInput = $('#studentName').val();
      let studentCourseInput = $("#course").val();
      let studentGradeInput = $('#studentGrade').val();
      let nameRegexCheck = /^[a-zA-Z]/;
      let gradeRegexCheck = /^[0-9]{3}/;
      // if(nameRegexCheck.test(studentNameInput) && nameRegexCheck.test(studentCourseInput) && gradeRegexCheck.test(studentGradeInput)){
      //       addStudentToServer();
      // } else {
      //       clearAddStudentFormInputs();

      // }
      
      if ( nameRegexCheck.test(studentNameInput)) {
            
      } else{
           let nameError = $('<div>').text("Please enter a student name that only contains letters");
           $('.errorMessage').append(nameError);

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

function addStudentToServer(){
    
      var studentToAdd = {
            dataType: 'json',
            url: "http://s-apis.learningfuze.com/sgt/create",
            method:"POST",
            data: { api_key : 'gmXk1sAmOs',
            name:$("#studentName").val() ,
            course:$("#course").val(),
            grade: $('#studentGrade').val(),
            } ,
            success: function( responseObject) {
                
                  if( responseObject.success ) {
                        var student_obj = {
                              name: $('#studentName').val(),
                              course:$("#course").val(),
                              grade: $('#studentGrade').val(),
                              student_id: responseObject.new_id
                        }
                        student_array.push(student_obj);
                        updateStudentList(student_array);
                        clearAddStudentFormInputs();
                  } else {
                        debugger;
                  }
                  
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




function deleteStudentFromServer (student_obj, studentId ) {
      studentToDelete = {
            dataType: "json",
            url: "http://s-apis.learningfuze.com/sgt/delete",
            method: "post",
            data: {api_key: 'gmXk1sAmOs',
            student_id: studentId },
            success: function(response) {
                  console.log(response);
                  var deleteIndex = student_array.indexOf(student_obj);
                        student_array.splice(deleteIndex,1);
                        $('tbody').empty();
                        updateStudentList(student_array);

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
      var studentCourseDiv = $('<td>').text(student_obj.course)
      var studentGradeDiv = $('<td>').text(student_obj.grade);
      var operationTd = $('<td>');
      var deleteButton = $('<button>').addClass('btn btn-danger delete').text("Delete");
      deleteButton.on('click', ()=>{
            deleteStudentFromServer(student_obj, student_obj.student_id);
      });
      
      // function() {
      //       var deleteIndex = student_array.indexOf(student_obj);
      //       student_array.splice(deleteIndex,1);
      //       $('tbody').empty();
      //       updateStudentList(student_array);
      // })
      operationTd.append(deleteButton);
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
}



