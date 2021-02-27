/* eslint-disable */
self.addEventListener('push', event => {
	if (!(self.Notification && self.Notification.permission === 'granted')) {
		return;
	}

	const {url, ...data} = event.data.json();

	self.url = (url && url.length) ? url : self.registration.scope;
	console.log(self.url);

	event.waitUntil(
		self.registration.showNotification(data.title, data)
	);
});

self.addEventListener('notificationclick', function(event) {
	event.notification.close();

	event.waitUntil(
		clients.matchAll({ type: 'window'})
			.then(function(clientList) {
				for (var i = 0; i < clientList.length; i++) {
					const client = clientList[i];
					if (client.url == '/' && 'focus' in client)
						return client.focus();
				}
				if (clients.openWindow) {
					return clients.openWindow(self.url);
				}
			})
	);
});
