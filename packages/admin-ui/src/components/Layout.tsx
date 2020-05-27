import React, { useState, useCallback } from 'react';
import { Toolbar, IconButton, Box, AppBar } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { Logo } from './Logo';
import { SideDrawer } from './Drawer';
import { Notifications } from './Notifications';
import { Logout } from './Logout';

interface Props {
  children: React.ReactNode;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%',
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto',
  },
}));

export const Layout: React.FC<Props> = ({ children }) => {
  const classes = useStyles();
  const [drawerOpen, setDrawerStatus] = useState(false);
  const toggleDraw = useCallback(() => setDrawerStatus(state => !state), []);

  return (
    <div className={classes.root}>
      <AppBar color="primary">
        <Toolbar>
          <IconButton
            edge="start"
            aria-label="menu"
            onClick={toggleDraw}
            color="secondary"
          >
            <Logo />
          </IconButton>
          <Box flexGrow={1} />
          <Notifications />
          <Logout />
        </Toolbar>
      </AppBar>
      <SideDrawer drawerOpen={drawerOpen} toggleDraw={toggleDraw} />
      <main className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>{children}</div>
        </div>
      </main>
    </div>
  );
};
