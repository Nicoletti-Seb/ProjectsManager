'use strict';

/* eslint-disable vars-on-top */
var $ = require('jquery');
var domready = require('./domready');
//https://www.npmjs.com/package/socket.io-client
var socket = require('socket.io-client')();

socket.on('error', function onError(err) {
	console.log(err);
});

// on connection to server, ask for user's name with an anonymous callback
socket.on('connect', function onConnect() {
	console.log('connected');
	// call the server-side function 'adduser' and send one parameter (value of prompt)
	socket.emit('adduser', 'toto');
});

// listener, whenever the server emits 'updatechat', this updates the chat body
socket.on('updatechat', function onUpdateChat(username, data) {
	$('#conversation').append('<b>' + username + ':</b> ' + data + '<br>');
});

// listener, whenever the server emits 'updaterooms', this updates the room the client is in
socket.on('updaterooms', function onUpdateRooms(rooms, currentRoom) {
	console.log('onUpdateRooms');
	$('#rooms').empty();
	$.each(rooms, function onLoopRooms(key, value) {
		console.log('value ', value + ' currentRoom ', currentRoom);
		if (value === currentRoom) {
			return;
		}

		$('#rooms')
			.append('<div><a class="switchRoom" data-name="'
				+ value + '"  href="#" >' + value + '</a></div>');
	});
});

domready(function onDOMReady() {
	// when the client clicks SEND
	$('#datasend').click(function onClickDataSend() {
		var message = $('#data').val();
		$('#data').val('');
		// tell server to execute 'sendchat' and send along one parameter
		socket.emit('sendchat', message);
	});

	// when the client hits ENTER on their keyboard
	$('#data').keypress(function onKeyPress(e) {
		if (e.which === 13) {
			$(this).blur();
			$('#datasend').focus().click();
		}
	});

	$('.rooms').on('click', '.switchRoom', function onSwitchRoom() {
		socket.emit('switchRoom', $(this).data('name'));
	});
});

