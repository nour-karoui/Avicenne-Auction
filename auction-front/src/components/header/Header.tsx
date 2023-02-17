import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {Button, Grid, IconButton, Typography} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import {useState} from "react";

function Header() {

    const [walletAddress, setWalletAddress] = useState<string>('0x56789854567898765678909876');
    const [walletBalance, setWalletBalance] = useState<string>('0.123444');
    const [walletConnected, setWalletConnected] = useState(false);

    const copyAddress = async () => {
        await navigator.clipboard.writeText(walletAddress);
    }

    return (
        <Grid container padding="20px" paddingX="70px" marginBottom="20px" alignItems="center">
            <Grid item xs>
                <Typography variant="h5" component="div">
                    Auction-cienne
                </Typography>
            </Grid>
            <Grid item xs="auto">
                {
                    walletConnected ?
                        <Grid container spacing={3} alignItems="center">
                            <Grid item container xs="auto">
                                <Grid item container direction="row-reverse" alignItems="center">
                                    <Grid item>
                                        {walletAddress.slice(0, 5) + "..." + walletAddress.slice(-5)}
                                    </Grid>
                                    <Grid item>
                                        <IconButton onClick={copyAddress}>
                                            <ContentCopyIcon fontSize="small"/>
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Grid item container direction="row-reverse">
                                    {walletBalance} ETH
                                </Grid>
                            </Grid>
                            <Grid item xs="auto">
                                <PersonIcon fontSize="large"/>
                            </Grid>
                        </Grid>
                        :
                        <Button variant="outlined">
                            Connect to wallet
                        </Button>
                }
            </Grid>
        </Grid>
    )
}

export default Header;