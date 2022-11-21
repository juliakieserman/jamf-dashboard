import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Link from 'next/link';
import { useState } from 'react';
import AppContext from '../components/AppContext';

const drawerWidth = 240;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            JAMF Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar />
      <Divider />
      <List>
        <ListItem>
          <ListItemButton>
            <Link href="/policies"> Policies </Link>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton>
            <Link href="/devices"> Devices </Link>
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        <Component {...pageProps} />
      </Box>
    </Box>
  )
}
