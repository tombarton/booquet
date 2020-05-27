import React from 'react';
import {
  Theme,
  makeStyles,
  Grid,
  Breadcrumbs,
  Link,
  Typography,
  Button,
  SvgIcon,
} from '@material-ui/core';
import clsx from 'clsx';
import { Link as RouterLink } from 'react-router-dom';
import { PlusCircle as PlusCircleIcon } from 'react-feather';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';

interface HeaderProps {
  className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  action: {
    marginBottom: theme.spacing(1),
    '& + &': {
      marginLeft: theme.spacing(1),
    },
    color: theme.palette.secondary.main,
  },
  actionIcon: {
    marginRight: theme.spacing(1),
  },
}));

export const Header: React.FC<HeaderProps> = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <Grid
      container
      spacing={3}
      justify="space-between"
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Grid item>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Link variant="body1" color="inherit" to="/" component={RouterLink}>
            Dashboard
          </Link>
          <Typography variant="body1" color="textPrimary">
            Orders
          </Typography>
        </Breadcrumbs>
        <Typography variant="h3" color="textPrimary">
          All Orders
        </Typography>
      </Grid>
      <Grid item>
        <Button color="primary" variant="contained" className={classes.action}>
          <SvgIcon fontSize="small" className={classes.actionIcon}>
            <PlusCircleIcon />
          </SvgIcon>
          New order
        </Button>
      </Grid>
    </Grid>
  );
};
