import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {Button, Grid, IconButton, Typography} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import {useEffect, useState} from "react";
import {getWalletAddress, getWalletBalance} from "../../services/initWeb3";
import {ethers} from "ethers";

function Header() {

    const [walletAddress, setWalletAddress] = useState<string>('0x00');
    const [walletBalance, setWalletBalance] = useState<number>(0);
    const [walletConnected, setWalletConnected] = useState(false);

    useEffect(() => {
        initWalletAddress();
        initWalletBalance();
    });

    const initWalletAddress = async () => {
        const address = await getWalletAddress();
        if (address) {
            setWalletAddress(address);
            setWalletConnected(true);
        } else {
            // setOpen(true);
        }
    };

    const initWalletBalance = async () => {
        const balance = await getWalletBalance();
        if (balance) {
            setWalletBalance(Math.round(parseFloat(balance) * 10000) / 10000);
        }
    };

    const connectWallet = async () => {
        console.log('connectWithMetamask');
        await initWalletAddress();
        await initWalletBalance();
    }

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
                        <Button variant="outlined" onClick={connectWallet}>
                            Connect to wallet
                        </Button>
                }
            </Grid>
        </Grid>
    )
}

export default Header;