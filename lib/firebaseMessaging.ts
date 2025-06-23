// Only import this in browser components
import { getMessaging, isSupported } from "firebase/messaging";
import { app } from "./firebase";

export async function getMessagingClient() {
  const supported = await isSupported();
  if (!supported) return null;

  return getMessaging(app);
}
