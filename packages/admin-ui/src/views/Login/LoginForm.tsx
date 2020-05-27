import React, { useCallback } from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import gql from 'graphql-tag';
import { Box, Button, TextField, makeStyles, Theme } from '@material-ui/core';
import { useMutation } from '@apollo/react-hooks';
import Alert from '@material-ui/lab/Alert';
import { useHistory } from 'react-router';
import { Role } from '../../__generated__/globalTypes';
import { Login } from './__generated__/Login';

const LOGIN = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      id
      role
    }
  }
`;

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  button: {
    color: theme.palette.secondary.main,
  },
}));

interface LoginFormProps {
  className?: string;
  onSubmitSuccess?: () => void;
}

const validation = Yup.object().shape({
  email: Yup.string()
    .email('Must be a valid email')
    .max(255)
    .required('Email is required'),
  password: Yup.string().max(255).required('Password is required'),
});

export const LoginForm: React.FC<LoginFormProps> = ({ className, ...rest }) => {
  const [login] = useMutation<Login>(LOGIN);
  const classes = useStyles();
  const history = useHistory();

  const onSuccess = useCallback(() => {
    history.push('/');
  }, [history]);

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        onsubmit: '',
      }}
      validationSchema={validation}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          const loginData = await login({
            variables: {
              data: {
                email: values.email,
                password: values.password,
              },
            },
          });

          if (loginData.data?.login.role !== Role.ADMIN) {
            throw new Error(
              'You do not have the permission to access the Admin area.'
            );
          }
          onSuccess();
        } catch (error) {
          console.log(JSON.stringify(error));
          setErrors({
            onsubmit: error.message.replace(/(GraphQL error: )/g, ''),
          });
          setStatus({ success: false });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <form
          noValidate
          className={clsx(classes.root, className)}
          onSubmit={handleSubmit}
          {...rest}
        >
          {errors.onsubmit && (
            <Box mt={3}>
              <Alert severity="warning">{errors.onsubmit}</Alert>
            </Box>
          )}
          <TextField
            error={Boolean(touched.email && errors.email)}
            fullWidth
            autoFocus
            helperText={touched.email && errors.email}
            label="Email Address"
            margin="normal"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            value={values.email}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            label="Password"
            margin="normal"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />
          <Box mt={2}>
            <Button
              className={classes.button}
              color="primary"
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Log In
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};
