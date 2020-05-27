import { createMuiTheme } from '@material-ui/core';
import typography from './typography';

const baseConfig = {
  typography,
};

const theme = {
  palette: {
    primary: {
      main: '#95B593',
    },
    secondary: {
      light: '#FFFFFF',
      main: '#F4F5F8',
    },
    background: {
      default: '#f4f5f8',
    },
  },
};

export const createTheme = () => {
  return createMuiTheme({ ...baseConfig, ...theme });
};
