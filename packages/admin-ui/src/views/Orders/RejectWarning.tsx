import React, {
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  PropTypes,
} from '@material-ui/core';

export interface DialogAction {
  id: string;
  color?: PropTypes.Color;
  text: string;
  func: () => void;
}

type Action = 'REJECT' | 'DELETE';

interface WarningDialogProps {
  orderId: string;
  type: Action;
}

export interface RefExports {
  openDialog: () => void;
}

export const RejectWarning = forwardRef<RefExports, WarningDialogProps>(
  ({ type, orderId }, ref) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      openDialog() {
        setDialogOpen(true);
      },
    }));

    const handleNegativeAction = useCallback(() => {
      setDialogOpen(false);
    }, []);

    const handlePositiveAction = useCallback(() => {
      setDialogOpen(false);
      if (type === 'REJECT') {
        console.log('REJECTING');
      }
      if (type === 'DELETE') {
        console.log('DELETING...');
      }
    }, [type]);

    return (
      <Dialog open={dialogOpen}>
        <DialogTitle id="warning-dialog-title">{`Reject order: ${orderId}?`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="warning-dialog-description">
            You are about to reject an order. This will automatically inform the
            customer that we cannot fulfill their order and the hold placed on
            their card will be refunded.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color={'secondary'} onClick={handleNegativeAction}>
            No
          </Button>
          <Button color={'primary'} onClick={handlePositiveAction}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);
