import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

interface ActionDialogProps {
    title: string;
    description: string;
    confirmButtonText: string;
    cancelButtonText: string;
    handleClose: any // TODO: this should be mouseEventHandler?;
    isOpen: boolean;
}

export function ActionDialog(props: ActionDialogProps) {
    return (
        <Dialog
            open={props.isOpen}
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
              <DialogTitle id="alert-dialog-title">
                {props.title}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.description}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={props.handleClose}>{props.confirmButtonText}</Button>
                <Button onClick={props.handleClose}>
                  {props.cancelButtonText}
                </Button>
              </DialogActions>
            </Dialog>
    )
}