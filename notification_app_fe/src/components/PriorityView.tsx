import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert } from '@mui/material';
import NotificationCard from './NotificationCard';
import type { NotificationType } from './NotificationCard';
import { Log } from 'logging_middleware';

interface Props {
    token: string;
}

const WEIGHTS: Record<string, number> = {
    "Placement": 3,
    "Result": 2,
    "Event": 1
};

export default function PriorityView({ token }: Props) {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [limit, setLimit] = useState<number>(10);
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
                Log("frontend", "debug", "component", `Marked priority notification ${id} as unread`).catch(console.error);
            } else {
                newSet.add(id);
                Log("frontend", "debug", "component", `Marked priority notification ${id} as viewed`).catch(console.error);
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
                Log("frontend", "info", "api", "Fetching notifications for priority inbox").catch(console.error);
                
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
                Log("frontend", "info", "api", `Successfully fetched items for priority view`).catch(console.error);
            } catch (err: any) {
                setError(err.message);
                Log("frontend", "error", "api", `Failed to fetch: ${err.message}`.substring(0, 48)).catch(console.error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [filterType, token]);

    // Apply Priority Sorting logic (Same as Stage 1)
    const priorityNotifications = useMemo(() => {
        const sorted = [...notifications].sort((a, b) => {
            const weightA = WEIGHTS[a.Type] || 0;
            const weightB = WEIGHTS[b.Type] || 0;
            if (weightA !== weightB) {
                return weightB - weightA;
            }
            return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
        });
        return sorted.slice(0, limit);
    }, [notifications, limit]);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Priority Inbox</Typography>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Show Top N</InputLabel>
                        <Select
                            value={limit}
                            label="Show Top N"
                            onChange={(e) => {
                                setLimit(Number(e.target.value));
                                Log("frontend", "info", "component", `Priority limit changed to ${e.target.value}`).catch(console.error);
                            }}
                        >
                            <MenuItem value={5}>Top 5</MenuItem>
                            <MenuItem value={10}>Top 10</MenuItem>
                            <MenuItem value={15}>Top 15</MenuItem>
                            <MenuItem value={20}>Top 20</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Filter Type</InputLabel>
                        <Select
                            value={filterType}
                            label="Filter Type"
                            onChange={(e) => {
                                setFilterType(e.target.value);
                                Log("frontend", "info", "component", `Priority filter changed to ${e.target.value}`).catch(console.error);
                            }}
                        >
                            <MenuItem value="All">All Types</MenuItem>
                            <MenuItem value="Event">Event</MenuItem>
                            <MenuItem value="Result">Result</MenuItem>
                            <MenuItem value="Placement">Placement</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {loading && <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>}
            {error && <Alert severity="error">{error}</Alert>}
            
            {!loading && !error && priorityNotifications.length === 0 && (
                <Alert severity="info">No priority notifications found.</Alert>
            )}

            {!loading && !error && priorityNotifications.map((notif, index) => (
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
