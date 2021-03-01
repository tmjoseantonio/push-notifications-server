/* eslint-disable no-useless-escape */
'use strict';
const SERVICE_WORKER_URI = '/notifications-sw.js';
const SERVICE_WORKER_SCOPE = '/';
const SUBSCRIPTION_ENDPOINT = 'http://127.0.0.1:3000/subscribe';
const PUSH_NOTIFICATION_ENDPOINT = 'http://127.0.0.1:3000/notify';

// Set VAPID_KEY value from server's public vapid key (.env)
const VAPID_KEY = '<public vapid key>';

const selectors = {
	subscribeBtn: '.trigger-subscription',
	notifyBtn: '.trigger-notification',
	form: '.notification-form',
	notSupportedBanner: '.not-supported',
	main: '.main'
};

(() => {
	const subscribeBtn = document.querySelector(selectors.subscribeBtn);
	const nofifyForm = document.querySelector(selectors.form);

	if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
		document.querySelector(selectors.notSupportedBanner).classList.add('visible');
		document.querySelector(selectors.main).classList.add('hidden');
	}

	const urlB64ToUint8Array = (base64String) => {
		const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
		const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
		const rawData = atob(base64);
		const outputArray = new Uint8Array(rawData.length);

		for (let i = 0; i < rawData.length; ++i) {
			outputArray[i] = rawData.charCodeAt(i);
		}
		return outputArray;
	};

	const subscribeClient = async () => {	
		const serviceWorkerRegistration = await navigator.serviceWorker
			.register(SERVICE_WORKER_URI, { scope: SERVICE_WORKER_SCOPE });
	
		const subscription = await serviceWorkerRegistration.pushManager.subscribe({
			userVisibleOnly: true,			
			applicationServerKey: urlB64ToUint8Array(VAPID_KEY)
		});
	
		await fetch(SUBSCRIPTION_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(subscription)
		});
	};

	const notifyClient = async (formData) => {
		await fetch(PUSH_NOTIFICATION_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				title: formData.get('title'),
				body: formData.get('body'),
				icon: formData.get('icon'),
				url: formData.get('url'),
				tag: formData.get('tag')
			})
		});
	};

	subscribeBtn.addEventListener('click', (event) => {
		subscribeClient().catch(error => console.error(error));
	});

	nofifyForm.addEventListener('submit', (event) => {
		event.preventDefault();

		const data = new FormData(event.target);
		notifyClient(data).catch(console.error);
	});
})();
