import React from 'react';
import {
  makeStyles,
  Theme,
  Container,
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  CardMedia,
} from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import Page from '../../components/Page';
import { LoginForm } from './LoginForm';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    height: '100%',
    minHeight: '100%',
    flexDirection: 'column',
    paddingBottom: 80,
    paddingTop: 80,
  },
  card: {
    overflow: 'visible',
    display: 'flex',
    position: 'relative',
    '& > *': {
      flexGrow: 1,
      flexBasis: '50%',
      width: '50%',
    },
  },
  content: {
    padding: theme.spacing(8, 4, 3, 4),
  },
  icon: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
    position: 'absolute',
    top: -32,
    left: theme.spacing(3),
    height: 64,
    width: 64,
  },
  media: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    padding: theme.spacing(3),
    color: theme.palette.common.white,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
}));

export const Login: React.FC = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Login">
      <Container maxWidth="md">
        <Card className={classes.card}>
          <CardContent className={classes.content}>
            <Avatar className={classes.icon}>
              <LockIcon fontSize="large" />
            </Avatar>
            <Typography variant="h2" color="textPrimary">
              Beauty in Blooms
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Sign in to the Admin UI.
            </Typography>
            <Box mt={3}>
              <LoginForm />
            </Box>
          </CardContent>
          <CardMedia
            className={classes.media}
            image="/static/images/auth.png"
            title="Cover"
          >
            <Typography color="inherit" variant="subtitle1">
              Hella narvwhal Cosby sweater McSweeney&apos;s, salvia kitsch
              before they sold out High Life.
            </Typography>
            <Box alignItems="center" display="flex" mt={3}>
              <Avatar alt="Person" src="/static/images/avatars/avatar_2.png" />
              <Box ml={3}>
                <Typography color="inherit" variant="body1">
                  Ekaterina Tankova
                </Typography>
                <Typography color="inherit" variant="body2">
                  Manager at inVision
                </Typography>
              </Box>
            </Box>
          </CardMedia>
        </Card>
      </Container>
    </Page>
  );
};

export default Login;
