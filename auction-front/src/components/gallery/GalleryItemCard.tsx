import {
    Button,
    Grid,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
    Tooltip,
    Chip,
    TextField, InputAdornment, Box
} from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {Fragment, useEffect, useState} from "react";
import {Alert, LoadingButton} from "@mui/lab";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import {getAuction} from "../../services/initWeb3";
import {ethers} from "ethers";
import CheckIcon from '@mui/icons-material/Check';
import {getWalletAddress} from "../../services/initWeb3";

const isLeadBidder = true;

export enum State {
    OPEN,
    CLAIMED,
}

interface GalleryItemCardProps {
    address: string;
}

function GalleryItemCard({address}: GalleryItemCardProps) {

    const [placeBidLoading, setPlaceBidLoading] = useState(false);
    const [auction, setAuction] = useState<any>(null);
    // a number corresponding to the timestamp of the expiration of the auction
    const [expirationDate, setExpirationDate] = useState<number>(0);
    const [owner, setOwner] = useState('');
    const [currentBidder, setCurrentBidder] = useState<string>('');
    const [currentBidValue, setCurrentBidValue] = useState('0');
    const [tokenUri, setTokenUri] = useState('');
    const [remainingTime, setRemainingTime] = useState<number>();
    const [bidInputOpen, setBidInputOpen] = useState(false);
    const [bidAmount, setBidAmount] = useState(0);

    const [closed, setClosed] = useState(false);
    const [claimed, setClaimed] = useState(false);

    const [walletAddress, setWalletAddress] = useState<string>('0x00');

    useEffect(() => {
        initWalletAddress().then();
    }, []);

    useEffect(() => {
        setBidAmount(parseFloat(currentBidValue) + 0.1);
    }, [currentBidValue]);

    useEffect(() => {
        let intervalRef: NodeJS.Timer;
        if (!closed) {
            intervalRef = setInterval(updateRemainingTime, 1000);
        }
        initAuctionDetails();
        return () => intervalRef && clearInterval(intervalRef);
    }, [address, closed]);

    const initAuctionDetails = async () => {
        const contract = await getAuction(address);
        setAuction(contract);
        await setNftDetails(contract);
    }

    const initWalletAddress = async () => {
        const address = await getWalletAddress();
        if (address) {
            setWalletAddress(address);
        }
    }

    const updateRemainingTime = () => {
        const remainingTimeInMilliseconds = new Date(expirationDate).getTime() - new Date().getTime();
        if (remainingTimeInMilliseconds < 0) {
            setClosed(true);
        } else {
            setRemainingTime(remainingTimeInMilliseconds);
            setClosed(false);
        }
    }

    const setNftDetails = async (contract: any) => {
        const endTime = await contract.getEndTime();
        setExpirationDate(new Date(endTime * 1000).getTime());
        const currentBidder = await contract.getCurrentBidder();
        setCurrentBidder(currentBidder);
        const currentBidValue = await contract.getCurrentBidValue();
        setCurrentBidValue(ethers.utils.formatEther(currentBidValue));
        const nftOwner = await contract.getNFTOwner();
        setOwner(nftOwner);
        // const tokenUri = await contract.getTokenUri();
        // setTokenUri(tokenUri);
        const state: State = await contract.currentState();
        setClaimed(state === State.CLAIMED);
    }

    const placeBid = async () => {
        const bid = await auction.bid({value: ethers.utils.parseEther('0.1')});
    }

    const openOpenSeaLink = () => {
        window.open('https://www.geeksforgeeks.org/how-to-open-url-in-new-tab-using-javascript/', '_blank');
    }

    const claimTransferItem = () => {

    }

    return (
        <Card sx={{maxWidth: 345, boxShadow: "none", backgroundColor: "unset"}}>
            <CardMedia
                sx={{height: 300}}
                image="https://www.vincentvangogh.org/images/self-portrait.jpg"
                title={"name"}
            />
            <CardContent>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Grid container>
                            <Grid item xs>
                                <Typography variant="subtitle2">
                                    Current Bid
                                </Typography>
                                <Typography variant="h6" component="div">
                                    {currentBidValue} ETH
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs>
                                <Typography variant="subtitle2">
                                    Lead Bidder
                                </Typography>
                                {isLeadBidder
                                    ? <Chip label={currentBidder.slice(0, 5) + "..."} variant="outlined"/>
                                    : <Chip label="Me"
                                            icon={<FiberManualRecordIcon style={{transform: 'scale(0.5)'}}/>}
                                            variant="outlined" color="success"/>}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>{
                        (remainingTime && !closed) &&
                        <Fragment>
                            <Typography variant="subtitle2">
                                Remaining Time
                            </Typography>
                            <Typography variant="h6" component="div">
                                {Math.floor(remainingTime / (1000 * 60 * 60))}h
                                :{Math.floor((remainingTime / (1000 * 60)) % 60)}m
                                : {Math.floor((remainingTime / 1000) % 60)}s
                            </Typography>
                        </Fragment>
                    }
                        {
                            closed &&
                            <Box width="100px" justifyContent="center" justifyItems="center">
                                <Alert severity="error" variant="filled" icon={false} sx={{textAlign: "center"}}>
                                    CLOSED
                                </Alert>
                            </Box>
                        }
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <Grid container justifyContent="space-between" spacing={1}>
                    {
                        closed ?
                            <Grid item>
                                {
                                    claimed ?
                                        <Button size="small"
                                                disabled
                                                color="success"
                                                endIcon={<CheckIcon/>}
                                                variant="contained">
                                            Claimed
                                        </Button> :
                                        (
                                            currentBidder === walletAddress ?
                                                <Button size="small"
                                                        color="success"
                                                        onClick={claimTransferItem}
                                                        variant="contained">
                                                    Claim item
                                                </Button>
                                                : (
                                                    owner === walletAddress ?
                                                        <Button size="small"
                                                                color="success"
                                                                onClick={claimTransferItem}
                                                                variant="contained">
                                                            Transfer item
                                                        </Button>
                                                        :
                                                        <Button size="small"
                                                                color="success"
                                                                disabled
                                                                variant="contained">
                                                            Closed
                                                        </Button>
                                                )
                                        )
                                }
                            </Grid> :
                            (
                                bidInputOpen ?
                                    <Grid item xs={12}>
                                        <Grid container justifyContent="space-between" alignItems="center">
                                            <Grid item xs={5}>
                                                <TextField label='Bid To place' variant="standard"
                                                           type='number'
                                                           value={bidAmount}
                                                           onChange={(e) => setBidAmount(parseFloat(e.target.value))}
                                                           InputProps={{
                                                               endAdornment:
                                                                   <InputAdornment position="end">
                                                                       ETH
                                                                   </InputAdornment>
                                                           }}/>
                                            </Grid>
                                            <Grid item>
                                                <LoadingButton size="small"
                                                               loading={placeBidLoading}
                                                               onClick={placeBid}
                                                               variant="contained">
                                                    Confirm Bid
                                                </LoadingButton>
                                            </Grid>
                                        </Grid>
                                    </Grid> :
                                    <Grid item>
                                        <Button size="small"
                                                onClick={() => setBidInputOpen(true)}
                                                variant="contained">
                                            Place a bid
                                        </Button>
                                    </Grid>
                            )
                    }
                    <Grid item>
                        <Tooltip title={"See in Opensea"}>
                            <LoadingButton size="small"
                                           onClick={openOpenSeaLink}
                                           variant="outlined">
                                See more
                                <OpenInNewIcon sx={{marginLeft: "10px"}} fontSize="small"/>
                            </LoadingButton>
                        </Tooltip>

                    </Grid>
                </Grid>

            </CardActions>
        </Card>
    )
}

export default GalleryItemCard;