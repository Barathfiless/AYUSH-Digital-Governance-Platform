import { useState, useEffect, useCallback } from 'react';
import {
    type Notification,
    fetchNotifications,
    markAsRead,
    markAllAsRead as markAllAsReadService,
    dismissNotification,
} from '@/services/notificationService';

/**
 * useNotifications – shared hook for all portals.
 * Auto-polls every 30s. Works for startup, officer, admin, and customer roles.
 */
export function useNotifications(userId: string) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const load = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const data = await fetchNotifications(userId);
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        load();
        const interval = setInterval(load, 30_000); // poll every 30s
        return () => clearInterval(interval);
    }, [load]);

    const handleMarkAsRead = async (id: string) => {
        await markAsRead(id);
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const handleMarkAllAsRead = async () => {
        await markAllAsReadService(userId);
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    const handleDismiss = async (id: string) => {
        const wasUnread = notifications.find(n => n._id === id && !n.read);
        await dismissNotification(id);
        setNotifications(prev => prev.filter(n => n._id !== id));
        if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
    };

    return {
        notifications,
        unreadCount,
        loading,
        refresh: load,
        markAsRead: handleMarkAsRead,
        markAllAsRead: handleMarkAllAsRead,
        dismiss: handleDismiss,
    };
}
