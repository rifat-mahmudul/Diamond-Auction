"use client";

import { useSession } from 'next-auth/react';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { io, Socket } from 'socket.io-client';

interface NotificationData {
  _id: string;
  message: string;
  type: string;
  auction?: {
    _id: string;
    title: string;
    sku: string;
  };
  read: boolean;
  createdAt: string;
}

interface SocketContextType {
  socket: Socket | null;
  notifications: NotificationData[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationData[]>>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const session = useSession();
  const token = session?.data?.user?.accessToken;
  const [listenerSet, setListenerSet] = useState(false);

  useEffect(() => {
    if (token && !socket) {
      const socket = io('http://localhost:5100', {
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSocket(socket);
    }

    if (socket && !listenerSet) {
        socket.on('notification', (data: NotificationData) => {
          setNotifications((prevNotifications) => [data, ...prevNotifications]);
          console.log("notification:", data);
        });
        setListenerSet(true);
      }
  }, [token, socket, listenerSet]);

  console.log(socket)
  console.log('all notifications : ', notifications)

  return (
    <SocketContext.Provider value={{ socket, notifications, setNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};