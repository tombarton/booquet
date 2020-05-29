import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  IconButton,
  SvgIcon,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  makeStyles,
} from '@material-ui/core';
import { CheckCircle, Cancel, Visibility } from '@material-ui/icons';
import { MoreVertical as MoreVerticalIcon } from 'react-feather';
import { useHistory } from 'react-router';
import { OrderStatus } from '../../__generated__/globalTypes';

const useStyles = makeStyles(() => ({
  icon: {
    minWidth: '40px',
  },
}));

interface MenuOption {
  id: string;
  text: string;
  icon: React.ReactNode;
  action: (...args: any) => void;
}

type MenuGroups = {
  [key in keyof typeof OrderStatus | 'DEFAULT']: MenuOption[];
};

type MenuOptionKeys = 'VIEW' | 'ACCEPT' | 'REJECT';

type MenuIndividualOptions = {
  [key in MenuOptionKeys]: MenuOption;
};

interface ActionsProps {
  orderId: string;
  status: OrderStatus;
}

export const Actions: React.FC<ActionsProps> = ({ orderId, status }) => {
  const classes = useStyles();
  const history = useHistory();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<
    keyof typeof OrderStatus | 'DEFAULT'
  >('DEFAULT');
  const buttonRef = useRef<null | HTMLButtonElement>(null);

  const toggleMenu = useCallback(() => {
    setMenuOpen(state => !state);
  }, [setMenuOpen]);

  useEffect(() => {
    setActiveMenu(status);
  }, [status, setActiveMenu]);

  const MENU_OPTIONS: MenuIndividualOptions = {
    VIEW: {
      id: 'view',
      text: 'View',
      icon: <Visibility fontSize="small" />,
      action: () => history.push(`/orders/${orderId}`),
    },
    ACCEPT: {
      id: 'accept',
      text: 'Accept order',
      icon: <CheckCircle fontSize="small" />,
      action: () => {
        toggleMenu();
        console.log('Accepted order');
      },
    },
    REJECT: {
      id: 'reject',
      text: 'Reject order',
      icon: <Cancel fontSize="small" />,
      action: () => {
        toggleMenu();
        console.log('Rejected order');
      },
    },
  };

  const MENU_GROUPS: MenuGroups = {
    DEFAULT: [MENU_OPTIONS.VIEW],
    [OrderStatus.PENDING]: [MENU_OPTIONS.VIEW],
    [OrderStatus.AWAITING_CONFIRMATION]: [
      MENU_OPTIONS.VIEW,
      MENU_OPTIONS.ACCEPT,
      MENU_OPTIONS.REJECT,
    ],
    [OrderStatus.AWAITING_FULFILLMENT]: [MENU_OPTIONS.VIEW],
    [OrderStatus.FULFILLED]: [MENU_OPTIONS.VIEW],
  };

  return (
    <>
      <IconButton onClick={toggleMenu} ref={buttonRef}>
        <SvgIcon fontSize="small">
          <MoreVerticalIcon />
        </SvgIcon>
      </IconButton>
      <Popover
        open={menuOpen}
        anchorEl={buttonRef.current}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        onClose={toggleMenu}
      >
        <List disablePadding>
          {MENU_GROUPS[activeMenu].map(option => (
            <ListItem
              key={option.id}
              button
              divider
              onClick={() => option.action(option.id)}
            >
              <ListItemIcon className={classes.icon}>
                {option.icon}
              </ListItemIcon>
              <ListItemText primary={option.text} />
            </ListItem>
          ))}
        </List>
      </Popover>
    </>
  );
};
