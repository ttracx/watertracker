// Browser notification utilities

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
}

export function sendNotification(title: string, body: string): void {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }
  
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'water-reminder',
    });
  }
}

export function scheduleReminder(intervalMinutes: number, onRemind: () => void): number | null {
  if (typeof window === 'undefined') return null;
  
  const intervalMs = intervalMinutes * 60 * 1000;
  const intervalId = window.setInterval(onRemind, intervalMs);
  
  return intervalId;
}

export function cancelReminder(intervalId: number | null): void {
  if (intervalId !== null && typeof window !== 'undefined') {
    window.clearInterval(intervalId);
  }
}
