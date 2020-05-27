import React from 'react';
import clsx from 'clsx';
import { fade, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles<Theme, { [key: string]: string }>(theme => ({
  root: {
    fontFamily: theme.typography.fontFamily,
    alignItems: 'center',
    borderRadius: 2,
    display: 'inline-flex',
    flexGrow: 0,
    whiteSpace: 'nowrap',
    cursor: 'default',
    flexShrink: 0,
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightMedium,
    height: 20,
    justifyContent: 'center',
    letterSpacing: 0.5,
    minWidth: 20,
    padding: theme.spacing(0.5, 1),
    textTransform: 'uppercase',
  },
  primary: {
    color: theme.palette.primary.main,
    backgroundColor: fade(theme.palette.primary.main, 0.08),
  },
  secondary: {
    color: theme.palette.secondary.main,
    backgroundColor: fade(theme.palette.secondary.main, 0.08),
  },
  error: {
    color: theme.palette.error.main,
    backgroundColor: fade(theme.palette.error.main, 0.08),
  },
  success: {
    color: theme.palette.success.main,
    backgroundColor: fade(theme.palette.success.main, 0.08),
  },
  warning: {
    color: theme.palette.warning.main,
    backgroundColor: fade(theme.palette.warning.main, 0.08),
  },
}));

interface LabelProps {
  className?: string;
  color?: string;
  children: React.ReactNode;
}

export const Label: React.FC<LabelProps> = ({
  className,
  color = 'secondary',
  children,
  ...rest
}) => {
  const classes = useStyles({});

  return (
    <span
      className={clsx(
        classes.root,
        {
          [classes[`${color}`]]: color,
        },
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
};

export default Label;
