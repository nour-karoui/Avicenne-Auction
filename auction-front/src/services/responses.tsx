import {Alert, Snackbar} from "@mui/material";

interface ResponseProps {
    open: boolean;
    handleClose: () => void;
    message: string;
}

export const Success = ({open, handleClose, message}: ResponseProps) => {
    const vertical = 'top';
    const horizontal = 'center';
    return <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical, horizontal }} key={vertical + horizontal}>
                <Alert onClose={handleClose} severity="success" sx={{width: '100%'}}>
                    {message}
                </Alert>
           </Snackbar>
}

export const Error = ({open, handleClose, message}: ResponseProps) => {
    const vertical = 'top';
    const horizontal = 'center';
    return <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical, horizontal }} key={vertical + horizontal}>
                <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
                    {message}
                </Alert>
            </Snackbar>
}