
var Backbone = require('backbone');
var Twilio = require('twilio');
var Video = require('twilio-video');
var config = require('./visio-config');


/*

options = {
	remoteMediaEl: el
	localMediaEl: el
	onConnected: callback
	onDisconnected: callback
	onParticipantConnected: callback
	onParticipantDisconnected: callback
}

*/

module.exports = module.exports = Backbone.Model.extend(function VisioClass() {
	var client = null;
	var localMedia = null;
	var room = null;
	var options = {};

	function webRTCIsAvailable() {
		return !(navigator.webkitGetUserMedia && navigator.mozGetUserMedia);
	}

	function isInRoom() {
		return !!(room);
	}


	function setOptions(opt) {
		options = Object.assign(options, opt);
	}


	function createAccessToTwilio() {
		var grant = null;

		// Create an access token which we will sign and return to the client,
		// containing the grant we just created
		var token = new Twilio.AccessToken(
			config.TWILIO_ACCOUNT_SID,
			config.TWILIO_API_KEY,
			config.TWILIO_API_SECRET
		);

		// Assign the generated identity to the token
		token.identity = config.identity;

		//grant the access token Twilio Video capabilities
		grant = new Twilio.AccessToken.ConversationsGrant();
		grant.configurationProfileSid = config.TWILIO_CONFIGURATION_SID;
		token.addGrant(grant);

		return token.toJwt();
	}

	function close() {
		if (localMedia) {
			localMedia.stop();
		}

		if (room) {
			room.disconnect();
			room = null;
		}
	}

	function setupRoom() {
		//Attach participants's cam, if participants are already in the room
		room.participants.forEach(function loopParticipant(participant) {
			console.log('Participant ' + participant.identity + ' is already connected to the Room');
			if (options.remoteMediaEl) {
				participant.media.attach(options.remoteMediaEl);
			}
		});

		room.on('disconnected', function onDisconnected() {
			console.log('On disconnected');
			close();

			if (options.onDisconnected) {
				options.onDisconnected();
			}
		});

		// Log new Participants as they connect to the Room
		room.on('participantConnected', function onParticipantConnected(participant) {
			console.log('Participant ' + participant.identity + ' has connected to the Room');
			if (options.remoteMediaEl) {
				participant.media.attach(options.remoteMediaEl);
			}

			if (options.onParticipantConnected) {
				options.onParticipantConnected(participant);
			}
		});

		// Log Participants as they disconnect from the Room
		room.on('participantDisconnected', function onParticipantdisconnected(participant) {
			console.log('Participant ' + participant.identity + ' has disconnected to the Room');
			if (options.remoteMediaEl) {
				participant.media.detach(options.remoteMediaEl);
			}

			if (options.onParticipantDisconnected) {
				options.onParticipantDisconnected(participant);
			}
		});
	}

	function createRoom(id) {
		if (room) {
			return new Promise.resolve();
		}

		console.log('create room ', config);
		console.log('localMedia ', localMedia);

		return client.connect({
			to: config.roomName + id,
			localMedia: localMedia
		}).then(function onCreateRoom(roomCreated) {
			console.log('Connected to the Room ' + roomCreated.name);
			room = roomCreated;
			setupRoom();

			if (options.onConnected) {
				options.onConnected();
			}
		}, function onErrorCreateRoom(error) {
			console.log('Failed to connect to the Room : ', error);
		});
	}

	function setupLocalMedia() {
		//Add Camera and microphone
		Video.getUserMedia().then(function addLocalMediaStream(mediaStream) {
			localMedia.addStream(mediaStream);
			if (options.localMediaEl) {
				localMedia.attach(options.localMediaEl);
			}
		},
		function ErrorFindMediaStream(error) {
			console.log('Unable to access local media', error);
			console.log('Unable to access Camera and Microphone');
		});
	}

	function initTwilioConnection() {
		var token = createAccessToTwilio();

		// Create a Conversations Client and connect to Twilio
		client = new Video.Client(token);
		if (options.onErrorCall) {
			client.on('error', options.onErrorCall);
		}
	}

	function init(opt) {
		if (!webRTCIsAvailable()) {
			throw new Error('Web RTC is not available on your navigator....');
		}

		setOptions(opt);

		//init account twilio
		initTwilioConnection();

		//init média
		localMedia = new Video.LocalMedia();
		setupLocalMedia();
	}

	function removeOptions() {
		options = {};
	}

	function getParticipants() {
		if (!room) {
			return null;
		}

		return room.participants;
	}


	function participantsHaveCamera() {
		console.log(getParticipants());

		var bool =  false;
		getParticipants().forEach(function onGetParticipants(p) {
			console.log('size ', p.media.attachments.size);
			console.log('media ', p.media);
			if (p.media.attachments.size) {
				bool = true;
			}
		});

		return bool;
	}


	return {
		webRTCIsAvailable: webRTCIsAvailable,
		setOptions: setOptions,
		isInRoom: isInRoom,
		createRoom: createRoom,
		removeOptions: removeOptions,
		close: close,
		init: init,
		getParticipants: getParticipants,
		participantsHaveCamera: participantsHaveCamera
	};
}());
