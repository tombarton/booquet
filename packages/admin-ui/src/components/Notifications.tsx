import React, { useRef, useState, useCallback } from 'react';
import {
  Typography,
  Popover,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Tooltip,
  SvgIcon,
  ListItemAvatar,
  Avatar,
  Theme,
} from '@material-ui/core';
import { Bell as BellIcon, Package as PackageIcon } from 'react-feather';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  popover: {
    maxWidth: 350,
  },
  icon: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.main,
  },
}));

const notifications = [
  { id: '1', title: 'Hello-World' },
  { id: '2', title: 'Hello-World' },
  { id: '3', title: 'Hello-World' },
  { id: '4', title: 'Hello-World' },
  { id: '5', title: 'Hello-World' },
];

export const Notifications: React.FC = () => {
  const classes = useStyles();
  const buttonRef = useRef<null | HTMLButtonElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setModalOpen(true);
  }, []);
  const handleClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton onClick={handleOpen} ref={buttonRef}>
          <SvgIcon color="secondary">
            <BellIcon />
          </SvgIcon>
        </IconButton>
      </Tooltip>
      <Popover
        id="alert-popover"
        anchorEl={buttonRef.current}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        classes={{ paper: classes.popover }}
        keepMounted
        open={modalOpen}
        onClose={handleClose}
      >
        <Box p={2}>
          <Typography variant="h6">Alerts</Typography>
        </Box>
        {notifications.length === 0 ? (
          <Box p={2}>
            <Typography variant="h6">There are no alerts.</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {notifications.map(notification => (
              <ListItem key={notification.id} divider>
                <ListItemAvatar>
                  <Avatar className={classes.icon}>
                    <SvgIcon fontSize="small">
                      <PackageIcon />
                    </SvgIcon>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="A new order has been received."
                  secondary="£42.99 - Bright and beautiful bouquet"
                  style={{ marginRight: '16px' }}
                />
              </ListItem>
            ))}
            <Box p={1} display="flex" justifyContent="center">
              <Button size="small">MARK ALL AS READ</Button>
            </Box>
          </List>
        )}
      </Popover>
    </>
  );
};
