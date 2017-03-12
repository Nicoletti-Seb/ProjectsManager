var $ = require('jquery');
var Backbone = require('backbone');

module.exports = Backbone.View.extend({

	template: require('../templates/chat.html'),

	events: {
		'click #datasend': 'onClickDataSend',
		'keypress #data': 'onKeyPress',
		'click .rooms .switchRoom': 'onSwitchRoom'
	},

	render: function render() {
		var html = this.template.render();
		this.$el.html(html);
		return this;
	},


	onClickDataSend: function onClickDataSend() {
		var $data = this.$el.find('#data');
		var message = $data.val();
		$data.val('');

		this.model.sendMessage(message);
	},

	onKeyPress: function onKeyPress(e) {
		if (e.which === 13) {
			$(this).blur();
			if (this.$el.find('#data').val() !== '') {
				this.$el.find('#datasend').focus().click();
				this.$el.find('#data').focus();
			}
		}
	},

	onSwitchRoom: function onSwitchRoom(e) {
		this.model.switchRoom($(e.currentTarget).data('name'));
	},

	getOptions: function getOptions() {
		return {
			onError: this.onError.bind(this),
			onConnect: this.onConnect.bind(this),
			onUpdateChat: this.onUpdateChat.bind(this),
			onUpdateRooms: this.onUpdateRooms.bind(this)
		};
	},

	onError: function onError(err) {
		console.log('room-view onError ', err);
	},

	onConnect: function onConnect() {
		this.model.addUser(prompt('Quel est ton nom ?'));
	},

	onUpdateChat: function onUpdateChat(username, data) {
		this.$el.find('.conversation').append('<b>' + username + ':</b> ' + data + '<br>');
	},

	onUpdateRooms: function onUpdateRooms(rooms, currentRoom) {
		var $rooms = this.$el.find('.rooms');
		$rooms.empty();

		$.each(rooms, function onLoopRooms(key, value) {
			if (value === currentRoom) {
				return;
			}

			$rooms.append('<div><a class="switchRoom" data-name="'
					+ value + '"  >' + value + '</a></div>');
		});
	}
});
