import * as fs from 'fs';
import * as path from 'path';
import { Log, setLogAuthToken } from 'logging_middleware';
import * as dotenv from 'dotenv';

dotenv.config();

interface Notification {
    ID: string;
    Type: "Placement" | "Result" | "Event";
    Message: string;
    Timestamp: string;
}

const getAuthToken = (): string => {
    return process.env.AUTH_TOKEN || "";
};

const WEIGHTS: Record<string, number> = {
    "Placement": 3,
    "Result": 2,
    "Event": 1
};

const fetchNotifications = async (token: string): Promise<Notification[]> => {
    try {
        await Log("backend", "info", "service", "Fetching notifications from API");
        
        const response = await fetch("http://4.224.186.213/evaluation-service/notifications", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            await Log("backend", "error", "service", `Failed to fetch: ${response.status}`);
            throw new Error(`API Error: ${response.status}`);
        }

        const data: any = await response.json();
        await Log("backend", "info", "service", `Fetched ${data.notifications.length} items`);
        return data.notifications as Notification[];
    } catch (error: any) {
        await Log("backend", "fatal", "service", `Fetch error: ${error.message}`.substring(0, 48));
        throw error;
    }
};

const getPriorityNotifications = (notifications: Notification[], limit: number = 10): Notification[] => {
    const sorted = [...notifications].sort((a, b) => {
        const weightA = WEIGHTS[a.Type] || 0;
        const weightB = WEIGHTS[b.Type] || 0;

        if (weightA !== weightB) {
            return weightB - weightA;
        }

        return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
    });

    return sorted.slice(0, limit);
};

const main = async () => {
    const token = getAuthToken();
    setLogAuthToken(token);

    try {
        await Log("backend", "info", "handler", "Starting backend processor");
        
        const notifications = await fetchNotifications(token);
        
        const TOP_N = 10;
        const topNotifications = getPriorityNotifications(notifications, TOP_N);

        console.log(`\n--- Top ${TOP_N} Priority Notifications ---\n`);
        topNotifications.forEach((n, index) => {
            console.log(`${index + 1}. [${n.Type}] ${n.Message} (Time: ${n.Timestamp})`);
        });

        await Log("backend", "info", "handler", "Processed priority items successfully");
    } catch (error) {
        console.error("An error occurred:", error);
    }
};

main();
