import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChatThread, Notification, ChatMessage } from '../types';
import { useAuth } from './AuthContext';

interface CommunicationContextType {
  threads: ChatThread[];
  notifications: Notification[];
  unreadThreadsCount: number;
  unreadNotificationsCount: number;
  createThread: (builderId: string, builderName: string, builderAvatar: string, subject: string, initialMessage: string, agentId?: string) => void;
  sendMessage: (threadId: string, content: string, attachments?: string[]) => void;
  markThreadRead: (threadId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
}

const CommunicationContext = createContext<CommunicationContextType | undefined>(undefined);

export const CommunicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Simulate polling/loading initial data
  useEffect(() => {
    if (user) {
        // Mock Initial Threads
        const mockThreads: ChatThread[] = [
            {
                id: 'th_1',
                builderId: 'b1',
                builderName: 'Sarah Chen',
                builderAvatar: 'https://picsum.photos/id/64/100/100',
                userId: user.id,
                subject: 'Integration help for Salesforce Agent',
                agentId: 't-1',
                unread: true,
                lastUpdated: Date.now() - 10000000,
                messages: [
                    { id: 'm1', role: 'user', content: 'Hi, I need help setting up the API key.', senderId: user.id, timestamp: Date.now() - 10000000 },
                    { id: 'm2', role: 'user', content: 'Sure, happy to help. Have you checked the docs tab?', senderId: 'b1', timestamp: Date.now() - 9000000 }
                ]
            }
        ];
        setThreads(mockThreads);

        // Mock Initial Notifications
        const mockNotifications: Notification[] = [
            {
                id: 'n_1',
                userId: user.id,
                type: 'chat_reply',
                refId: 'th_1',
                title: 'New message from Sarah Chen',
                message: 'Sure, happy to help. Have you checked...',
                read: false,
                timestamp: Date.now() - 9000000
            },
            {
                id: 'n_2',
                userId: user.id,
                type: 'version_update',
                refId: 't-2',
                title: 'HubSpot Optimizer v1.9 Released',
                message: 'New features: Custom reporting dashboard.',
                read: false,
                timestamp: Date.now() - 86400000
            }
        ];
        setNotifications(mockNotifications);
    } else {
        setThreads([]);
        setNotifications([]);
    }
  }, [user]);

  const createThread = (builderId: string, builderName: string, builderAvatar: string, subject: string, initialMessage: string, agentId?: string) => {
      if (!user) return;
      
      // Check if thread exists for same context
      const existing = threads.find(t => t.builderId === builderId && t.agentId === agentId);
      if (existing) {
          sendMessage(existing.id, initialMessage);
          return;
      }

      const newThread: ChatThread = {
          id: `th_${Date.now()}`,
          builderId,
          builderName,
          builderAvatar,
          userId: user.id,
          agentId,
          subject,
          unread: false,
          lastUpdated: Date.now(),
          messages: [
              { id: `msg_${Date.now()}`, role: 'user', senderId: user.id, content: initialMessage, timestamp: Date.now() }
          ]
      };
      setThreads(prev => [newThread, ...prev]);
  };

  const sendMessage = (threadId: string, content: string, attachments: string[] = []) => {
      if (!user) return;
      setThreads(prev => prev.map(t => {
          if (t.id === threadId) {
              return {
                  ...t,
                  lastUpdated: Date.now(),
                  messages: [...t.messages, { id: `msg_${Date.now()}`, role: 'user', senderId: user.id, content, timestamp: Date.now(), attachments }]
              };
          }
          return t;
      }));
      
      // Simulate reply
      setTimeout(() => {
          setThreads(prev => prev.map(t => {
            if (t.id === threadId) {
                const reply: ChatMessage = {
                    id: `msg_r_${Date.now()}`,
                    role: 'user',
                    senderId: t.builderId,
                    content: "Thanks for your message. I'll get back to you shortly.",
                    timestamp: Date.now()
                };
                return {
                    ...t,
                    unread: true,
                    lastUpdated: Date.now(),
                    messages: [...t.messages, reply]
                };
            }
            return t;
          }));
          
          // Add notification for reply
          const newNotif: Notification = {
              id: `notif_${Date.now()}`,
              userId: user.id,
              type: 'chat_reply',
              refId: threadId,
              title: 'New message received',
              message: "Thanks for your message. I'll get back to you shortly.",
              read: false,
              timestamp: Date.now()
          };
          setNotifications(prev => [newNotif, ...prev]);

      }, 3000);
  };

  const markThreadRead = (threadId: string) => {
      setThreads(prev => prev.map(t => t.id === threadId ? { ...t, unread: false } : t));
  };

  const markNotificationRead = (notificationId: string) => {
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadThreadsCount = threads.filter(t => t.unread).length;
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <CommunicationContext.Provider value={{
      threads,
      notifications,
      unreadThreadsCount,
      unreadNotificationsCount,
      createThread,
      sendMessage,
      markThreadRead,
      markNotificationRead,
      markAllNotificationsRead
    }}>
      {children}
    </CommunicationContext.Provider>
  );
};

export const useCommunication = () => {
  const context = useContext(CommunicationContext);
  if (context === undefined) {
    throw new Error('useCommunication must be used within a CommunicationProvider');
  }
  return context;
};