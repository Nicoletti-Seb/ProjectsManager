var $ = require('jquery');
var Backbone = require('backbone');

module.exports = Backbone.View.extend({

	template: require('../templates/project.html'),

	render: function render() {
		var html = this.template.render();
		this.$el.html(html);
		return this;
	},

	onError: function onError(err) {
		console.log(err);
	},

	onConnect: function onConnect() {
		console.log('connected');
		socket.emit('adduser', /*prompt("What's your name?")*/ 'toto');
	},

	onUpdateChat: function onUpdateChat(username, data) {
		$('#conversation').append('<b>' + username + ':</b> ' + data + '<br>');
	},

	onUpdateRooms: function onUpdateRooms(rooms, currentRoom) {
		$('#rooms').empty();
		$.each(rooms, function onLoopRooms(key, value) {
			if (value === currentRoom) {
				return;
			}

			$('#rooms')
				.append('<div><a class="switchRoom" data-name="'
					+ value + '"  href="#" >' + value + '</a></div>');
		});
	}
});
