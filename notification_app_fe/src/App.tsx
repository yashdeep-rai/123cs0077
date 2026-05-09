import React, { useState, useEffect } from 'react';
import { Container, Typography, AppBar, Toolbar, Button, ThemeProvider, createTheme, CssBaseline, Box, GlobalStyles } from '@mui/material';
import NotificationsView from './components/NotificationsView';
import PriorityView from './components/PriorityView';
import { Log, setLogAuthToken } from 'logging_middleware';

const TOKEN = import.meta.env.VITE_AUTH_TOKEN || "";

setLogAuthToken(TOKEN);

const theme = createTheme({
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    palette: {
        mode: 'dark',
        primary: { main: '#3b82f6' }, // Neon blue
        secondary: { main: '#ec4899' }, // Neon pink
        background: { 
            default: '#0b0f19', // Deep dark background
            paper: '#131b2f' // Slightly lighter card background
        },
        text: {
            primary: '#f8fafc',
            secondary: '#94a3b8'
        }
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(11, 15, 25, 0.8)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: 'none',
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                }
            }
        }
    }
});

export default function App() {
    const [view, setView] = useState<'all' | 'priority'>('all');

    useEffect(() => {
        Log("frontend", "info", "page", "Application mounted successfully").catch(console.error);
    }, []);

    const handleNav = (newView: 'all' | 'priority') => {
        Log("frontend", "info", "page", `Navigating to ${newView} view`).catch(console.error);
        setView(newView);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyles styles={{
                '@keyframes slideUp': {
                    '0%': { opacity: 0, transform: 'translateY(20px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' }
                },
                '.animated-card': {
                    animation: 'slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards'
                }
            }} />
            <AppBar position="static" elevation={1}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: '-0.5px' }}>
                        Campus Notifications
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                            color={view === 'all' ? 'primary' : 'inherit'} 
                            onClick={() => handleNav('all')} 
                            sx={{ opacity: view === 'all' ? 1 : 0.7 }}
                        >
                            All Notifications
                        </Button>
                        <Button 
                            color={view === 'priority' ? 'primary' : 'inherit'} 
                            onClick={() => handleNav('priority')} 
                            sx={{ opacity: view === 'priority' ? 1 : 0.7 }}
                        >
                            Priority Inbox
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                {view === 'all' ? <NotificationsView token={TOKEN} /> : <PriorityView token={TOKEN} />}
            </Container>
        </ThemeProvider>
    );
}
