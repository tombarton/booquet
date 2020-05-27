import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  IconButton,
  SvgIcon,
} from '@material-ui/core';
import clsx from 'clsx';
import PerfectScrollBar from 'react-perfect-scrollbar';
import { format } from 'date-fns';
import { ArrowRight as ArrowRightIcon } from 'react-feather';
import { Label } from '../../components/Label';

interface OrdersProps {
  className?: string;
}

interface Order {
  id: string;
  ref: string;
  createdAt: Date;
  name: string;
  method: string;
  currency: string;
  total: string;
  status: string;
}

const orders: Order[] = [
  {
    id: '1',
    ref: 'abcdefg',
    createdAt: new Date(),
    name: 'Tom Barton',
    method: 'card',
    currency: 'GBP',
    total: '20.99',
    status: 'PENDING',
  },
];

const useStyles = makeStyles(() => ({
  root: {},
}));

export const Orders: React.FC<OrdersProps> = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Typography color="textSecondary" gutterBottom variant="body2">
        {`${orders.length} orders found.`}
      </Typography>
      <Card>
        <CardHeader title="Orders" />
        <Divider />
        <PerfectScrollBar>
          <Box minWidth={1150}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                  <TableCell>Ref</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      {order.ref}
                      <Typography variant="body2" color="textSecondary">
                        {format(order.createdAt, 'dd MMM yyyy | hh:mm')}
                      </Typography>
                    </TableCell>
                    <TableCell>{order.name}</TableCell>
                    <TableCell>{order.method}</TableCell>
                    <TableCell>
                      {order.currency}
                      {order.total}
                    </TableCell>
                    <TableCell>
                      <Label color="success">{order.status}</Label>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={RouterLink}
                        to="/app/management/orders/1"
                      >
                        <SvgIcon fontSize="small">
                          <ArrowRightIcon />
                        </SvgIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollBar>
      </Card>
    </div>
  );
};
