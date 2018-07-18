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
}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return: 
       none
 */
function handleAddClicked( event ){
      $('tbody').empty()
      addStudent();
      // renderStudentOnDom(student_obj);
      clearAddStudentFormInputs();
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
function addStudent(){
      var student_obj = {
            studentName: $("#studentName").val(),
            course: $("#course").val(),
            grade: $('#studentGrade').val()    
      };
      student_array.push(student_obj);
      console.log(student_obj);
      clearAddStudentFormInputs();
      updateStudentList(student_array);
}
/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs(){
      $("#studentName").val("");
      $("#course").val("");
      $("#studentGrade").val("");

}
/***************************************************************************************************
 * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} studentObj a single student object with course, name, and grade inside
 */
function renderStudentOnDom(student_obj){
      var studentRow = $('<tr>');
      var studentNameDiv = $('<td>').text(student_obj.studentName);
      var studentCourseDiv = $('<td>').text(student_obj.course)
      var studentGradeDiv = $('<td>').text(student_obj.grade);
      var operationTd = $('<td>');
      var deleteButton = $('<button>').addClass("btn btn-danger").text("Delete");
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
      debugger;
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
      debugger;
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





