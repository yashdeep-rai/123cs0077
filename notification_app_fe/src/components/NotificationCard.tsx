import React from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton, Tooltip } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import WorkIcon from '@mui/icons-material/Work';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export interface NotificationType {
    ID: string;
    Type: "Placement" | "Result" | "Event";
    Message: string;
    Timestamp: string;
}

interface Props {
    notification: NotificationType;
    isViewed: boolean;
    onToggleView: (id: string) => void;
    index: number;
}

export default function NotificationCard({ notification, isViewed, onToggleView, index }: Props) {
    
    const getTypeStyles = (type: string) => {
        switch(type) {
            case "Placement": return { icon: <WorkIcon fontSize="small" />, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' };
            case "Result": return { icon: <AssuredWorkloadIcon fontSize="small" />, color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)' };
            case "Event": return { icon: <EventIcon fontSize="small" />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' };
            default: return { icon: <EventIcon fontSize="small" />, color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)' };
        }
    };

    const style = getTypeStyles(notification.Type);

    const handleCardClick = () => {
        if (!isViewed) {
            onToggleView(notification.ID);
        }
    };

    return (
        <Card 
            className="animated-card"
            onClick={handleCardClick}
            elevation={0}
            style={{ animationDelay: `${index * 0.05}s` }}
            sx={{ 
                mb: 2, 
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                backgroundColor: isViewed ? 'background.paper' : 'rgba(255, 255, 255, 0.02)',
                border: '1px solid',
                borderColor: isViewed ? 'rgba(255,255,255,0.05)' : style.color,
                boxShadow: isViewed ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : `0 0 20px ${style.bg}`,
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '12px',
                cursor: isViewed ? 'default' : 'pointer',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 10px 25px rgba(0,0,0,0.5), 0 0 20px ${style.bg}`,
                    borderColor: style.color
                },
                '&::before': isViewed ? {} : {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    backgroundColor: style.color
                }
            }}
        >
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ 
                            display: 'flex', 
                            p: 0.8, 
                            borderRadius: '8px', 
                            backgroundColor: style.bg,
                            color: style.color
                        }}>
                            {style.icon}
                        </Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: '0.5px', color: style.color }}>
                            {notification.Type.toUpperCase()}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {!isViewed && (
                            <Chip 
                                label="NEW" 
                                size="small" 
                                sx={{ 
                                    height: '22px', 
                                    fontSize: '0.7rem', 
                                    fontWeight: 800, 
                                    backgroundColor: style.color,
                                    color: '#fff',
                                    letterSpacing: '0.5px'
                                }} 
                            />
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTimeIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                {new Date(notification.Timestamp).toLocaleString(undefined, {
                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                            </Typography>
                        </Box>
                        
                        <Tooltip title={isViewed ? "Mark as unread" : "Mark as read"}>
                            <IconButton 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleView(notification.ID);
                                }}
                                size="small"
                                sx={{ 
                                    color: isViewed ? 'text.secondary' : style.color,
                                    ml: 1
                                }}
                            >
                                {isViewed ? <CheckCircleIcon fontSize="small" /> : <RadioButtonUncheckedIcon fontSize="small" />}
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
                <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.6, pl: 0.5, pr: 4 }}>
                    {notification.Message}
                </Typography>
            </CardContent>
        </Card>
    );
}
