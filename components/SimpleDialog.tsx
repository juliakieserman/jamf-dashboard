import { Dialog, DialogTitle, DialogContent, DialogContentText, Button, DialogActions } from '@mui/material';

interface SimpleDialogProps {
    open: boolean;
    onClose: (value: string) => void;
}
  
export function SimpleDialog(props: SimpleDialogProps) {
    const { onClose, open } = props;


    return (
        <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Notify Account Admins"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            On clicking send, an email notification will be generated for all selected devices notifying them of required corrective action
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained">Send</Button>
        </DialogActions>
      </Dialog>
    );
}