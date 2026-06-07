// Hello Gorgeous App — Service Worker
// Handles push notifications and offline caching.

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data?.json() ?? {};
  } catch {
    data = { title: "Hello Gorgeous", body: event.data?.text() ?? "" };
  }

  const title = data.title ?? "Hello Gorgeous Med Spa";
  const options = {
    body: data.body ?? "",
    icon: "/icons/vitamin-bar-icon-192.png",
    badge: "/icons/vitamin-bar-icon-192.png",
    data: { url: data.url ?? "/app" },
    vibrate: [100, 50, 100],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/app";
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        return clients.openWindow(url);
      })
  );
});
