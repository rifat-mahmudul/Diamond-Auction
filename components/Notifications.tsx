"use client"
import { useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { useSocketContext } from '@/Provider/SocketProvider';
import { useSession } from 'next-auth/react';

const Notifications = () => {
  const { notifications, setNotifications } = useSocketContext();
  const session = useSession();
  const token = session?.data?.user?.accessToken;

  useEffect(() => {
    const fetchInitialNotifications = async () => {
      if (token) {
        try {
          const response = await fetch('http://localhost:5100/api/v1/bids/notifications', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (data.status && data.data) {
            setNotifications(data.data);
          } else {
            console.error('Failed to fetch initial notifications:', data.message);
          }
        } catch (error) {
          console.error('Error fetching initial notifications:', error);
        }
      }
    };

    fetchInitialNotifications();
  }, [token, setNotifications]);

//   console.log('Current notifications:', notifications);

  return (
    <div className="bg-neutral-100 p-6 rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      <ul className="space-y-4">
        {notifications.map((notification) => (
          <li
            key={notification._id}
            className="bg-white rounded-md p-4 flex items-center space-x-4"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                src="/default-profile.png"
                alt="Profile"
                className="w-full h-full object-cover"
                width={24}
                height={24}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">
                {notification.message}
                {notification.auction && (
                  <span className="font-semibold"> ({notification.auction.title})</span>
                )}
              </p>
              <p className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <div className="text-gray-500 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                />
              </svg>
            </div>
          </li>
        ))}
        {notifications.length === 0 && (
          <li className="text-gray-500">No new notifications</li>
        )}
      </ul>
    </div>
  );
};

export default Notifications;