# Push Notifications Server
This server will create mock services that will allow you to test Push Notifications API in your local machine.

## Server setup

  1. `npm run install`: Setup project dependencies
  2. `npm run init`: Create VAPID keys and base `.env` file.
  3. Copy the private and public keys into the generated `.env` file. (Do not hardcode or share these credentials).
  4. Start the server with `npm run start`
  5. Open local server with `npm run open-client:[your os]` available options are (macos, linux, windows. You can also open the following url `http://127.0.0.1:3000`.

## API Endpoints

### /subscribe
- Type: POST
- Endpoint: `http://127.0.0.1:3000/subscribe`
This is the endpoint used by clients to subscribe. Users will be prompted to authorize notifications from their site.

Payload object is built by the browser upon user consent: 
```json
{
  "endpoint": "https://random-push-service.com/some-kind-of-unique-id-1234/v2/",
  "keys": {
    "p256dh" :
"BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtUbVlUls0VJXg7A8u-Ts1XbjhazAkj7I99e8QcYP7DkM=",
    "auth"   : "tBHItJI5svbpez7KI4CCXg=="
  }
}
```

### /notify
- Type: POST
- Endpoint: `http://127.0.0.1:3000/notify`
- Notification body:
```json
{
  "title":"Lorem in irure officia veniam laborum",
  "body":"Qui proident labore pariatur do incididunt ex fugiat ipsum. Exercitation tempor dolor adipisicing enim qui voluptate dolore magna",
  "icon":"https://www.gstatic.com/images/icons/material/product/2x/chrome_chromium_64dp.png",
  "tag": "officia-ea-nulla-esse"
}
```
Push custom notification to all registered clients.

## Client setup

[Client server](https://github.com)

![Notifications consent flow](https://developers.google.com/web/fundamentals/push-notifications/images/svgs/browser-to-server.svg)

A service worker needs to be setup on the client to listen for notification badge push / click / dismiss events. 

![Handling pushed notifications](https://developers.google.com/web/fundamentals/push-notifications/images/svgs/push-service-to-sw-event.svg)


## Reference
Google Developers: Web Fundamentals - [Web Push Notifications: Timely, Relevant, and Precise](https://developers.google.com/web/fundamentals/push-notifications)

--

Jose Tovar - [http://tovar.co](http://tovar.co)