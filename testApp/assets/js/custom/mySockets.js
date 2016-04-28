/******************************************
*
* MY ATTEMPT TO CONNECT SOME SOCKETS, ULP!
*
******************************************/

// The automatically-created socket is exposed as io.socket.
// Use .on() to subscribe to the 'hello' event on the client
io.socket.on('hello', function gotHelloMessage (data) {
  //console.log('Socket `' + data.id + '` joined the party!');
});

// subscribe to future updates.
io.socket.on('userUpdate', function gotUpdate (data) {
    updateUserList(data.id, data.loggedIn);
    flashMessage(data.name + " has logged " + (data.loggedIn ? 'in' : 'out'));
})

io.socket.on('userCreate', function gotCreate (data) {
    addToUserList(data);
    flashMessage("New User: " + data.name);
})

io.socket.on('userDelete', function gotDelete(data) {
    deleteUser(data.id);
    flashMessage("User Deleted: " + data.name);
})

// Use .get() to contact the server
console.log("CALLING IO.SOCKET.GET...");
io.socket.get('/user/subscribe', function gotResponse(body, response) {
  console.log('Server responded with status code ' + response.statusCode + ' and data: ', body);
});

function updateUserList(id, loggedIn) {
    var icon = $("tr[data-id='" + id + "'][data-model='user'] td img").first();
    var newSource = '/images/' + (loggedIn ? 'check' : 'minus') + '.png';
    icon.attr('src', newSource);
}

function addToUserList(userData) {
    // the userData is actually a user model object.  Copy needed properties for template
    var userObj = {
        csrf : window.overlord.csrf,
        id : userData.id,
        name : userData.name,
        title : userData.title,
        email : userData.email,
        admin : userData.admin,
        online : userData.online
    };
    $("table#allUsers").append(
        JST['assets/templates/userRow.ejs'](userObj)
    );
}

function deleteUser(id) {
    $("tr[data-id='" + id + "']").remove();
}

function flashMessage(message) {
    $(".navbar").after("<div class='alert alert-success' style='position: absolute;'>" + message + "</div>");
    $("#notify")[0].play();
    $(".alert").fadeOut(5000);
}