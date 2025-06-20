import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { enviarNotificacionPush } from './notification';

class NotificationService {
  private static instance: NotificationService;
  private listeners: Function[] = [];
  private notifications: any[] = [];

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize(uid: string) {
    if (!Capacitor.isNativePlatform()) return;

    try {
      const permission = await PushNotifications.requestPermissions();
      if (permission.receive !== 'granted') {
        console.warn('Permiso de notificaciones denegado');
        return;
      }

      await PushNotifications.register();

      PushNotifications.addListener('registration', (token) => {
        console.log('Token de push:', token.value);
        // Aquí pasamos un solo objeto con las propiedades necesarias
        enviarNotificacionPush({
          token: token.value,
          title: 'Notificaciones activadas',
          body: `Usuario ${uid} registrado.`,
          data: { uid }
        });
      });

      PushNotifications.addListener('registrationError', (error) => {
        console.error('Error al registrar push:', error);
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Notificación recibida en primer plano:', notification);
        this.addNotification(notification);
        alert(`${notification.title}\n${notification.body}`); 
        this.notifyListeners();
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Notificación interactuada:', notification);
        this.addNotification(notification.notification);
        this.notifyListeners();
      });

      this.loadSavedNotifications();
    } catch (error) {
      console.error('Error al inicializar notificaciones:', error);
    }
  }

  private addNotification(notification: any) {
    const newNotification = {
      id: Date.now().toString(),
      title: notification.title || 'Sin título',
      body: notification.body || '',
      data: notification.data || {},
      read: false,
      date: new Date().toISOString(),
    };
    this.notifications = [newNotification, ...this.notifications];
    this.saveNotifications();
  }

  private saveNotifications() {
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
  }

  private loadSavedNotifications() {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      try {
        this.notifications = JSON.parse(saved);
      } catch {
        this.notifications = [];
      }
    }
  }

  getNotifications() {
    return [...this.notifications];
  }

  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  markAsRead(id: string) {
    this.notifications = this.notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    this.saveNotifications();
    this.notifyListeners();
  }

  markAllAsRead() {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    this.saveNotifications();
    this.notifyListeners();
  }

  deleteNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveNotifications();
    this.notifyListeners();
  }

  addListener(listener: Function) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }
}

export default NotificationService;
