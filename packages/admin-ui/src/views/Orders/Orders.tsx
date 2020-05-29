import React, { useState, useCallback, ChangeEvent } from 'react';
import {
  makeStyles,
  Typography,
  Divider,
  Checkbox,
  TableCell,
  TableHead,
  Table,
  Box,
  TableRow,
  Card,
  CardHeader,
  TableBody,
  CircularProgress,
  TablePagination,
} from '@material-ui/core';
import clsx from 'clsx';
import PerfectScrollBar from 'react-perfect-scrollbar';
import { format, parseISO } from 'date-fns';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import { Label } from '../../components/Label';
import { Actions } from './Actions';
import {
  GetAllOrders,
  GetAllOrdersVariables,
} from './__generated__/GetAllOrders';

interface OrdersProps {
  className?: string;
}

const useStyles = makeStyles(() => ({
  root: {},
}));

const GET_ORDERS = gql`
  query GetAllOrders($limit: Int, $skip: Int, $sortBy: OrderSort) {
    getAllOrders(limit: $limit, skip: $skip, sortBy: $sortBy) {
      pageInfo {
        totalPages
      }
      totalCount
      edges {
        node {
          id
          status
          total
          createdAt
          user {
            firstname
            lastname
          }
        }
      }
    }
  }
`;

export const Orders: React.FC<OrdersProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(25);
  const { data, loading, fetchMore } = useQuery<
    GetAllOrders,
    GetAllOrdersVariables
  >(GET_ORDERS, {
    variables: { limit: limit, skip: page * limit },
  });

  const onPageChange = useCallback(
    (e, newPage) => {
      setPage(newPage);
      fetchMore({
        variables: { limit, skip: newPage * limit },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return fetchMoreResult;
        },
      });
    },
    [setPage, fetchMore, limit]
  );

  const onLimitChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newLimit = Number(e.target.value);
      setLimit(newLimit);
      setPage(0);
      fetchMore({
        variables: { limit: newLimit, skip: 0 },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return fetchMoreResult;
        },
      });
    },
    [setLimit, fetchMore]
  );

  const orders = data?.getAllOrders?.edges || [];
  const totalCount = data?.getAllOrders.totalCount || 0;

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Typography color="textSecondary" gutterBottom variant="body2">
        {`${totalCount} orders found.`}
      </Typography>
      <Card>
        <CardHeader title="Orders" />
        <Divider />
        <PerfectScrollBar>
          <Box minWidth={850}>
            {loading ? (
              <Box
                m={2}
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="250px"
              >
                <CircularProgress />
              </Box>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    <TableCell>Ref</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map(order => {
                    const { user, id, total, status, createdAt } = order.node;
                    const name = user
                      ? `${user.firstname} ${user.lastname}`
                      : '';

                    return (
                      <TableRow key={id}>
                        <TableCell padding="checkbox">
                          <Checkbox />
                        </TableCell>
                        <TableCell>
                          {id}
                          <Typography variant="body2" color="textSecondary">
                            {format(parseISO(createdAt), 'dd MMM yyyy | hh:mm')}
                          </Typography>
                        </TableCell>
                        <TableCell>{name}</TableCell>
                        <TableCell>
                          {'GBP'}
                          {total}
                        </TableCell>
                        <TableCell>
                          <Label color="success">{status}</Label>
                        </TableCell>
                        <TableCell align="right">
                          <Actions orderId={id} status={status} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </Box>
        </PerfectScrollBar>
        <TablePagination
          component="div"
          count={totalCount}
          onChangePage={onPageChange}
          onChangeRowsPerPage={onLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[25, 50, 100]}
        />
      </Card>
    </div>
  );
};
