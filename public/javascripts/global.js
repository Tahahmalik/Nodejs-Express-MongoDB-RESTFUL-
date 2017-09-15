// Userlist data array for filling in info box
var userLIstData = [];
//


// DOM Ready ============================================================================
$(document).ready(function(){

	//Populate the user table on initial page load
	populateTable();

});


	// Username link click
	$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

	// Add User button click
	$('#btnAddUser').on('click', addUser);

	// Delete User link click
	$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

	// Update user link click
	$('#UpdatePopulate').click(function(){
		$("#addUser").addClass("slideLeft");

		$("#updateUser").addClass("fadeIn");
		$("#addUser").css("display","none");
		//$("#updateUser").css("display","block");
		// Populate information of user to be updates
		populateUpdate();
	});

	$('#btnUpdateUser').on('click', postUpdate);

// Function ==============================================================================

// Fill table with data
function populateTable(){

	// Empty content string
	var tableContent = '';

	// jQuery AJAX call for JSON
	$.getJSON( '/users/userlist', function( data ){
		userListData = data;
		// For each item in our JSON, add a table row and cells to the content string
		$.each(data, function(){
		    tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
		});
		
		// Inject the whole content string into our existing HTML table
		$('#userList table tbody').html(tableContent);

	});
};

//Show User Info
function showUserInfo(event){
	// Prevent Link from Firing
	event.preventDefault();

	// Retrieve username from link rel attribute
	var thisUsername = $(this).attr('rel');
	
	
	
	// Get index of object based on id value
	var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username;}).indexOf(thisUsername);

	// Get User Object
	var thisUserObject = userListData[arrayPosition];

	//Populate Info Box
	$('#userInfoName').text(thisUserObject.fullname);
	$('#userInfoAge').text(thisUserObject.age);
	$('#userInfoGender').text(thisUserObject.gender);
	$('#userInfoLocation').text(thisUserObject.location);
	$('#UpdatePopulate').attr("rel", thisUserObject._id);
	
};

// Add User 
function addUser(event) {
	event.preventDefault();

	// Basic validation , checking for empty fields
	var errorCount = 0 ;
	$('#addUser input').each(function(index,val){
		if($(this).val() === '') { errorCount++;}
		
	});

	// Check and make sure errorCount still at zero
	if(errorCount === 0) {
		// If true , then compile all info into single object
		var newUser = {
			'username': $('#addUser fieldset input#inputUserName').val(),
			'email': $('#addUser fieldset input#inputUserEmail').val(),
			'fullname': $('#addUser fieldset input#inputUserFullname').val(),
			'age': $('#addUser fieldset input#inputUserAge').val(),
			'location': $('#addUser fieldset input#inputUserLocation').val(),
			'gender': $('#addUser fieldset input#inputUserGender').val()
		}

		// Use AJAX to post the object to our adduser service
		$.ajax({
			type: 'POST',
			data: newUser,
			url: '/users/adduser',
			dataType: 'JSON'
		}).done(function(response){
			// Check for succesful resposne
			if (response.msg === '') {

				// Clear the form inputs
				$('#addUser fieldset input').val('');

				// Update the table
				populateTable();
			}
			else{
				// If something goes wrong, display the error message
				alert('Error:' + response.msg);
			}
		});


	}
	else {
		// If errorCount is more than 0 , error out
		alert('Please fill in all fields');
		return false;
	}

};

// Delete User
function deleteUser(event){
	event.preventDefault();

	// Pop up a confirmation dialog
	var confirmation = confirm('Are you sure you want to delete this user?');

	//Check to make sure the user confirmed 
	if (confirmation === true ) {
		// Do delete
		$.ajax({
			type: 'DELETE',
			url: '/users/deleteuser/' + $(this).attr('rel')
		}).done(function( response ){
			// Check for succesful blank response 
			if ( response.msg === '') {
		}
		else {
			alert('Error:' + response.msg);
		}
		//Update the table
		populateTable();
		});


	}
	else {
		//If user does not confirm
		return false;
	}
};

function populateUpdate(event){
	

	// Retrieve username from id text box
var idtoupdate = ($('#UpdatePopulate').attr('rel'));

	
	
	// Get index of object based on id value
	var arrayPosition = userListData.map(function(arrayItem) { return arrayItem._id;}).indexOf(idtoupdate);


	// Get User Object
	var thisUserObject = userListData[arrayPosition];
	console.log(thisUserObject);
	
	$('#updateUserFullname').val(thisUserObject.fullname);
	$('#updateUserEmail').val(thisUserObject.email);
	$('#updateUserAge').val(thisUserObject.age);
	$('#updateUserGender').val(thisUserObject.gender);
	$('#updateUserLocation').val(thisUserObject.location);

	$('#UpdateUsertag').append(": " +thisUserObject.username);
	$('#btnUpdateUser').attr("rel", thisUserObject._id);


	
}



function postUpdate(event){

event.preventDefault();

	// Basic validation , checking for empty fields
	var errorCount = 0 ;
	$('#updateUser input').each(function(index,val){
		if($(this).val() === '') { errorCount++;}
		
	});

	// Check and make sure errorCount still at zero
	if(errorCount === 0) {
		// If true , then compile all info into single object
		var arrayPosition = userListData.map(function(arrayItem) { return arrayItem._id;}).indexOf($(this).attr('rel'));


	// Get User Object
	var thisUserObject = userListData[arrayPosition];

		var updateUser = {
			'username': thisUserObject.username,
			'email': $('#updateUser fieldset input#updateUserEmail').val(),
			'fullname': $('#updateUser fieldset input#updateUserFullname').val(),
			'age': $('#updateUser fieldset input#updateUserAge').val(),
			'location': $('#updateUser fieldset input#updateUserLocation').val(),
			'gender': $('#updateUser fieldset input#updateUserGender').val()
		}

		// Use AJAX to post the object to our adduser service
		$.ajax({
			type: 'PUT',
			data: updateUser,
			url: '/users/updateuser/'+$(this).attr('rel'),
			dataType: 'JSON'
		}).done(function(response){
			// Check for succesful resposne
			if (response.msg === '') {

				// Update the table
				alert('Succesful!');

				// Clear the form inputs
				$('#updateUser fieldset input').val('');

				$("#addUser").css("display","block");
		 		$("#updateUser").css("display","none");

				// Populate table again with new user info
				populateTable();

			}
			else{
				// If something goes wrong, display the error message
				alert('Error:' + response.msg);
			}
		});


	}
	else {
		// If errorCount is more than 0 , error out
		alert('Please fill in all fields');
		return false;
	}

};

