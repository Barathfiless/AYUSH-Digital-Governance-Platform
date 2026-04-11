/**
 * notificationService.ts
 * Central service for creating, fetching, and managing notifications.
 * Used by all portals: Startup, Officer, Admin, Customer.
 */

const BASE = '/api/notifications';

export interface Notification {
    _id: string;
    userId: string;
    title: string;
    message: string;
    type: 'StatusUpdate' | 'Message' | 'Alert';
    read: boolean;
    createdAt: string;
}

/** Fetch all notifications for a user */
export async function fetchNotifications(userId: string): Promise<Notification[]> {
    if (!userId) return [];
    const res = await fetch(`${BASE}/user/${userId}`);
    if (!res.ok) return [];
    return res.json();
}

/** Get just the unread count — lightweight for badge polling */
export async function fetchUnreadCount(userId: string): Promise<number> {
    if (!userId) return 0;
    try {
        const res = await fetch(`${BASE}/unread-count/${userId}`);
        if (!res.ok) return 0;
        const data = await res.json();
        return data.count ?? 0;
    } catch {
        return 0;
    }
}

/** Create a notification for any userId */
export async function createNotification(payload: {
    userId: string;
    title: string;
    message: string;
    type?: 'StatusUpdate' | 'Message' | 'Alert';
}): Promise<Notification | null> {
    try {
        const res = await fetch(`${BASE}/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

/** Mark a single notification as read */
export async function markAsRead(notificationId: string): Promise<void> {
    await fetch(`${BASE}/${notificationId}/read`, { method: 'PATCH' });
}

/** Mark all notifications for a user as read */
export async function markAllAsRead(userId: string): Promise<void> {
    await fetch(`${BASE}/user/${userId}/read-all`, { method: 'PATCH' });
}

/** Delete (dismiss) a notification */
export async function dismissNotification(notificationId: string): Promise<void> {
    await fetch(`${BASE}/${notificationId}`, { method: 'DELETE' });
}
