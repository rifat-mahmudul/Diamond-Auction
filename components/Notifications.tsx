"use client"

import { useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "next-auth/react"

// Define the notification interface to match server response
interface Notification {
    id: string
    message: string
    createdAt: string
    read: boolean
    type: string
    auction: {
        _id: string
        title: string
        sku: string
    }
}

export default function NotificationsComponent() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [socket, setSocket] = useState<Socket | null>(null)
    const [error, setError] = useState<string | null>(null)
    console.log(socket);
    
    const SERVER_URL = "http://localhost:5100"
    const API_ENDPOINT = `${SERVER_URL}/api/v1/bids/notifications`
   
    // const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2ZlMTE3N2Q2MzhlNjZjZDc1MWExMWQiLCJpYXQiOjE3NDUyMjI4MTYsImV4cCI6MTc0NTgyNzYxNn0.ZLziWZQsxyJmM17TJ01eZPzlcCRxLpGQWnup9Hlrvro"

   const session = useSession()
   console.log(session);

   const token = session?.data?.user


    // Use static token
    // const getToken = () => {
    //     return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2ZlMTE3N2Q2MzhlNjZjZDc1MWExMWQiLCJpYXQiOjE3NDUyMjI4MTYsImV4cCI6MTc0NTgyNzYxNn0.ZLziWZQsxyJmM17TJ01eZPzlcCRxLpGQWnup9Hlrvro"
    // }

    // Format time difference
    const formatTimeAgo = (dateString: string) => {
        const now = new Date()
        const date = new Date(dateString)
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

        if (diffInHours < 1) {
            const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
            return `${diffInMinutes}min ago`
        } else if (diffInHours < 24) {
            return `${diffInHours}hr ago`
        } else {
            const diffInDays = Math.floor(diffInHours / 24)
            return `${diffInDays}d ago`
        }
    }



    // Fetch notifications from API
    const fetchNotifications = async () => {
        try {
            setLoading(true)
            // const token = getToken()

            const response = await fetch(API_ENDPOINT, {
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2ZlMTE3N2Q2MzhlNjZjZDc1MWExMWQiLCJpYXQiOjE3NDUyMjI4MTYsImV4cCI6MTc0NTgyNzYxNn0.ZLziWZQsxyJmM17TJ01eZPzlcCRxLpGQWnup9Hlrvro`,
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                throw new Error(`Error fetching notifications: ${response.status}`)
            }

            const data = await response.json()
            // console.log(data);
            
            // Map server response to match Notification interface

            // const formattedNotifications = (data.data || []).map((item: any) => ({
            //     id: item._id,
            //     message: item.message,
            //     createdAt: item.createdAt,
            //     read: item.read,
            //     type: item.type,
            //     auction: {
            //         _id: item.auction._id,
            //         title: item.auction.title,
            //         sku: item.auction.sku,
            //     },
            // }))

            // setNotifications(formattedNotifications)
            // setLoading(false)
        } catch (err) {
            console.error("Failed to fetch notifications:", err)
            setError("Failed to load notifications. Please try again later.")
            setLoading(false)
        }
    }

    // Mark notification as read
    const markAsRead = async (id: string) => {
        try {
            // const token = getToken()

            const response = await fetch(`${SERVER_URL}/api/v1/bids/notifications`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2ZlMTE3N2Q2MzhlNjZjZDc1MWExMWQiLCJpYXQiOjE3NDUyMjI4MTYsImV4cCI6MTc0NTgyNzYxNn0.ZLziWZQsxyJmM17TJ01eZPzlcCRxLpGQWnup9Hlrvro`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ notificationIds: [id] }),
            })

            if (!response.ok) {
                throw new Error("Failed to mark notification as read")
            }

            // Update local state
            setNotifications((prev) =>
                prev.map((notification) =>
                    notification.id === id ? { ...notification, read: true } : notification
                )
            )
        } catch (err) {
            console.error("Failed to mark notification as read:", err)
        }
    }

    // Delete notification
    const deleteNotification = async (id: string) => {
        try {

            await fetch(`${SERVER_URL}/api/v1/bids/notifications/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })

            // Update local state
            setNotifications((prev) => prev.filter((notification) => notification.id !== id))
        } catch (err) {
            console.error("Failed to delete notification:", err)
        }
    }

    // Initialize Socket.io connection and fetch initial notifications
    useEffect(() => {
        fetchNotifications()

        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2ZlMTE3N2Q2MzhlNjZjZDc1MWExMWQiLCJpYXQiOjE3NDUyMjI4MTYsImV4cCI6MTc0NTgyNzYxNn0.ZLziWZQsxyJmM17TJ01eZPzlcCRxLpGQWnup9Hlrvro"
        const newSocket = io(SERVER_URL, {
            auth: {
                Bearer: token,
            },
        })

        setSocket(newSocket)

        // Log connection status

        newSocket.on("connect", () => {
            console.log("Connected to Socket.IO server")
        })

        newSocket.on("connect_error", (err: Error) => {
            console.error("Socket.IO connection error:", err.message)
            setError("Failed to connect to notification server.")
        })

        // Listen for new notifications
        // newSocket.on("notification", (notification: any) => {
        //     console.log("Received notification:", notification)
        //     const formattedNotification: Notification = {
        //         id: notification._id,
        //         message: notification.message,
        //         createdAt: notification.createdAt,
        //         read: false,
        //         type: notification.type,
        //         auction: {
        //             _id: notification.auctionId,
        //             title: notification.auction?.title || "Unknown",
        //             sku: notification.auction?.sku || "N/A",
        //         },
        //     }
        //     // Play notification sound
        //     // const audio = new Audio("/notification-sound.mp3")
        //     // audio.play().catch((err) => console.error("Could not play notification sound:", err))

        //     setNotifications((prev) => [formattedNotification, ...prev])
        // })

        // Listen for notification updates

        // newSocket.on("notification_update", (updatedNotification: any) => {
        //     const formattedNotification: Notification = {
        //         id: updatedNotification._id,
        //         message: updatedNotification.message,
        //         createdAt: updatedNotification.createdAt,
        //         read: updatedNotification.read,
        //         type: updatedNotification.type,
        //         auction: {
        //             _id: updatedNotification.auctionId,
        //             title: updatedNotification.auction?.title || "Unknown",
        //             sku: updatedNotification.auction?.sku || "N/A",
        //         },
        //     }
        //     setNotifications((prev) =>
        //         prev.map((notification) =>
        //             notification.id === formattedNotification.id ? formattedNotification : notification
        //         )
        //     )
        // })

        // Listen for notification deletions
        newSocket.on("notification_delete", (id: string) => {
            setNotifications((prev) => prev.filter((notification) => notification.id !== id))
        })

        // Clean up on unmount
        return () => {
            newSocket.disconnect()
        }
    }, [])

    // Loading skeleton
    if (loading) {
        return (
            <div className="w-full  mx-auto bg-white rounded-lg shadow">
                <h1 className="text-2xl font-bold text-center py-4 border-b">Notifications</h1>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 border-b">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1">
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-5/6 mt-1" />
                        </div>
                        <Skeleton className="h-4 w-16" />
                    </div>
                ))}
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="w-full  mx-auto bg-white rounded-lg shadow p-6 text-center">
                <h1 className="text-2xl font-bold mb-4">Notifications</h1>
                <p className="text-red-500">{error}</p>
                <button
                    onClick={fetchNotifications}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        )
    }

    return (
        <div className="w-full  mx-auto bg-white rounded-lg shadow">
            <h1 className="text-2xl font-bold text-center py-4 border-b">Notifications</h1>

            {!Array.isArray(notifications) || notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No notifications yet</div>
            ) : (
                <div>
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`flex items-start p-4 border-b hover:bg-gray-50 transition-colors ${!notification.read ? "bg-red-50" : ""
                                }`}
                        >
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-800 break-words">{notification.message}</p>
                                <p className="text-xs text-gray-500">
                                    Auction: {notification.auction.title} (SKU: {notification.auction.sku})
                                </p>
                            </div>

                            {/* Time and Actions */}
                            <div className="flex flex-col items-end ml-4 min-w-[80px]">
                                <span className="text-xs text-gray-500 mb-2">{formatTimeAgo(notification.createdAt)}</span>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="p-1 rounded-full hover:bg-gray-200">
                                            <MoreHorizontal className="h-5 w-5 text-gray-500" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {!notification.read && (
                                            <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                                Mark as gastronomics
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem onClick={() => deleteNotification(notification.id)}>
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
