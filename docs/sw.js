self.addEventListener('push', (event) => {
  console.log("Push signal caught.");

  let notificationTitle = 'Quantum Gong';
  let notificationBody = '⚛️ The bell is ringing...';

  if (event.data) {
    try {
      const payloadData = event.data.json();
      if (payloadData.title) notificationTitle = payloadData.title;
      if (payloadData.body) notificationBody = payloadData.body;
    } catch (e) {}
  }

  // Define highest-priority notification options for Android / supported browsers
  const notificationOptions = {
    body: notificationBody,
    tag: 'gong-alert',
    renotify: true,
    silent: false,
    sound: 'gong.mp3',
    requireInteraction: true,       // Keeps notification on screen until user interacts (High Priority)
    vibrate: [300, 100, 300, 100, 500], // Aggressive vibration pattern
    priority: 'high'                // High priority hint for supported browsers
  };

  const notificationPromise = self.registration.showNotification(notificationTitle, notificationOptions);

  // Keep this active so that if the app IS open on screen, 
  // it triggers your custom Web Audio API cyberpunk gong audio smoothly.
  const clientMessagePromise = self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    .then((clientList) => {
      for (const client of clientList) {
        client.postMessage({ command: "play__gong" });
      }
    });

  event.waitUntil(Promise.all([notificationPromise, clientMessagePromise]));
});
