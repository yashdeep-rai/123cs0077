import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert } from '@mui/material';
import NotificationCard from './NotificationCard';
import type { NotificationType } from './NotificationCard';
import { Log } from 'logging_middleware';

interface Props {
    token: string;
}

export default function NotificationsView({ token }: Props) {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterType, setFilterType] = useState<string>('All');
    
    // Read viewed items from local storage
    const [viewedIds, setViewedIds] = useState<Set<string>>(() => {
        const saved = localStorage.getItem('viewedNotifications');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });

    const toggleViewed = (id: string) => {
        setViewedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
                Log("frontend", "debug", "component", `Marked notification ${id} as unread`).catch(console.error);
            } else {
                newSet.add(id);
                Log("frontend", "debug", "component", `Marked notification ${id} as viewed`).catch(console.error);
            }
            localStorage.setItem('viewedNotifications', JSON.stringify(Array.from(newSet)));
            return newSet;
        });
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            setError(null);
            try {
                Log("frontend", "info", "api", `Fetching all notifications with filter: ${filterType}`).catch(console.error);
                
                let url = '/evaluation-service/notifications';
                if (filterType !== 'All') {
                    url += `?notification_type=${filterType}`;
                }

                const response = await fetch(url, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }

                const data = await response.json();
                setNotifications(data.notifications || []);
                Log("frontend", "info", "api", `Successfully fetched ${data.notifications?.length || 0} notifications`).catch(console.error);
            } catch (err: any) {
                setError(err.message);
                Log("frontend", "error", "api", `Failed to fetch notifications: ${err.message}`).catch(console.error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [filterType, token]);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>All Notifications</Typography>
                
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Filter Type</InputLabel>
                    <Select
                        value={filterType}
                        label="Filter Type"
                        onChange={(e) => {
                            setFilterType(e.target.value);
                            Log("frontend", "info", "component", `Filter changed to ${e.target.value}`).catch(console.error);
                        }}
                    >
                        <MenuItem value="All">All Types</MenuItem>
                        <MenuItem value="Event">Event</MenuItem>
                        <MenuItem value="Result">Result</MenuItem>
                        <MenuItem value="Placement">Placement</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {loading && <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>}
            {error && <Alert severity="error">{error}</Alert>}
            
            {!loading && !error && notifications.length === 0 && (
                <Alert severity="info">No notifications found.</Alert>
            )}

            {!loading && !error && notifications.map((notif, index) => (
                <NotificationCard 
                    key={notif.ID} 
                    notification={notif} 
                    isViewed={viewedIds.has(notif.ID)}
                    onToggleView={toggleViewed}
                    index={index}
                />
            ))}
        </Box>
    );
}
