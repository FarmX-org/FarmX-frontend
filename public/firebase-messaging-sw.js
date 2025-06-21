// ✅ DON'T use import in service workers
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// ✅ Use your own config
firebase.initializeApp({
  apiKey: "AIzaSyCJin09XkeKkgNeWwi9WcwS5nLCgkSWTlc",
  authDomain: "farmx-org.firebaseapp.com",
  projectId: "farmx-org",
  storageBucket: "farmx-org.firebasestorage.app",
  messagingSenderId: "560112655531",
  appId: "1:560112655531:web:31316c4289249679922bee",
});

// ✅ Handle background notifications
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[🔥 firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'New message!';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/firebase-logo.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
