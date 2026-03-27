import { useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface SSEEvent {
  type: string;
  title?: string;
  message?: string;
  status?: string;
  applicationId?: string;
  companyName?: string;
  notificationId?: string;
}

/**
 * useRealtimeNotifications
 * Connects to the SSE stream and shows toast notifications automatically.
 * Cleans up the EventSource on unmount or userId change.
 */
export function useRealtimeNotifications(
  userId: string | undefined,
  onNotification?: (event: SSEEvent) => void
) {
  const esRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    if (!userId) return;

    // Close any existing connection
    esRef.current?.close();

    const es = new EventSource(`/api/events/stream?userId=${userId}`);
    esRef.current = es;

    es.onmessage = (event) => {
      try {
        const data: SSEEvent = JSON.parse(event.data);

        if (data.type === 'connected') return; // skip handshake

        if (data.type === 'StatusUpdate') {
          const statusColors: Record<string, () => void> = {
            Approved: () => toast.success(`🎉 ${data.title}`, { description: data.message, duration: 6000 }),
            Rejected: () => toast.error(`❌ ${data.title}`, { description: data.message, duration: 6000 }),
            SiteInspection: () => toast.info(`🔍 ${data.title}`, { description: data.message, duration: 6000 }),
          };
          const toastFn = data.status ? statusColors[data.status] : undefined;
          if (toastFn) toastFn();
          else toast.info(data.title || 'Notification', { description: data.message });
        }

        onNotification?.(data);
      } catch (_) {
        // ignore parse errors
      }
    };

    es.onerror = () => {
      // Auto-reconnect after 5s on error
      es.close();
      setTimeout(() => connect(), 5000);
    };
  }, [userId, onNotification]);

  useEffect(() => {
    connect();
    return () => {
      esRef.current?.close();
    };
  }, [connect]);
}
