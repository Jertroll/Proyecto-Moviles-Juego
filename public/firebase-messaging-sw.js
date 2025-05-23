importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js");

firebase.initializeApp({
 apiKey: "AIzaSyBj66IMbXJIxJDuPR06rlhmI7aPL_otHEE",
  authDomain: "proyecto-9ba2e.firebaseapp.com",
  projectId: "proyecto-9ba2e",
  storageBucket: "proyecto-9ba2e.firebasestorage.app",
  messagingSenderId: "1085181239831",
  appId: "1:1085181239831:web:211dc7a4fa085d96e27252",
  measurementId: "G-Z1M6FWW3RG"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log("[firebase-messaging-sw.js] Mensaje recibido en segundo plano:", payload);

  const notificationTitle = payload.notification?.title || "Notificación";
  const notificationOptions = {
    body: payload.notification?.body,
    icon: "/logo192.png" // Cambia esto si tienes un ícono personalizado
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
