import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Chip,
    Grid,
    InputAdornment,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {Fragment, SyntheticEvent, useEffect, useState} from "react";
import {Error, Success} from "../../services/responses";
import {Alert, LoadingButton} from "@mui/lab";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CheckIcon from '@mui/icons-material/Check';
import {getAuction, getWalletAddress} from "../../services/initWeb3";
import {ethers} from "ethers";
import axios, {AxiosResponse} from "axios";

export enum State {
    OPEN,
    CLAIMED,
}

const defaultImageURL = 'https://www.vincentvangogh.org/images/self-portrait.jpg';

interface GalleryItemCardProps {
    address: string;
}

const BID_AUCTION = "Bid Auction";
const END_AUCTION = "End Auction";

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
    const [nftAddress, setNftAddress] = useState('');
    const [tokenId, setTokenId] = useState('');
    const [imageUrl, setImageUrl] = useState(defaultImageURL);

    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState<string | undefined>(undefined)


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
    }, [address, closed, expirationDate]);

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
        setExpirationDate(endTime.toNumber() * 1000);
        const currentBidder = await contract.getCurrentBidder();
        setCurrentBidder(currentBidder);
        const currentBidValue = await contract.getCurrentBidValue();
        setCurrentBidValue(ethers.utils.formatEther(currentBidValue));
        const nftOwner = await contract.getNFTOwner();
        setOwner(nftOwner);
        const nftAddress = await contract.getNFTAddress();
        setNftAddress(nftAddress);
        const tokenId = await contract.getTokenId();
        setTokenId(tokenId);
        const state: State = await contract.currentState();
        setClaimed(state === State.CLAIMED);
        const nftTokenUri = await contract.getTokenUri();
        setTokenUri(nftTokenUri.replace('0x{id}', tokenId));
        if (imageUrl === defaultImageURL) {
            const res: AxiosResponse = await axios.get(nftTokenUri.replace('0x{id}', tokenId));
            setImageUrl(res.data.image);
        }
    }

    const placeBid = async () => {
        setLoading(BID_AUCTION);
        try {
            const tx = await auction.bid({value: ethers.utils.parseEther(bidAmount.toString())});
            await tx.wait();
        } catch (e: any) {
            setErrorMessage(e.reason);
            setErrorOpen(true);
        } finally {
            setLoading(undefined);
        }
    }

    const handleSuccessClose = (event?: SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSuccessOpen(false);
    };

    const handleErrorClose = (event?: SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorOpen(false);
    };

    const openOpenSeaLink = () => {
        window.open(`https://testnets.opensea.io/assets/goerli/${nftAddress}/${tokenId}`, '_blank');
    }

    const claimTransferItem = async () => {
        setLoading(END_AUCTION);
        try {
            const tx = await auction.endAuction({gasLimit: 5000000});
            await tx.wait();
        } catch (e: any) {
            console.log(e);
            setErrorMessage(e.reason);
            setErrorOpen(true);
        } finally {
            setLoading(undefined);
        }
    }

    return (
        <Card sx={{maxWidth: 345, boxShadow: "none", backgroundColor: "unset"}}>
            <Success open={successOpen} handleClose={handleSuccessClose} message={successMessage}></Success>
            <Error open={errorOpen} handleClose={handleErrorClose} message={errorMessage}></Error>
            <CardMedia
                sx={{height: 300}}
                image={imageUrl}
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
                                {currentBidder == walletAddress
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
                                <Alert severity="error" variant="filled" icon={false} sx={{justifyContent: 'center'}}>
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
                                                <LoadingButton size="small"
                                                               loading={loading == END_AUCTION}
                                                               color="success"
                                                               onClick={claimTransferItem}
                                                               variant="contained">
                                                    Claim item
                                                </LoadingButton>
                                                : (
                                                    owner === walletAddress ?
                                                        <LoadingButton size="small"
                                                                       loading={loading == END_AUCTION}
                                                                       color="success"
                                                                       onClick={claimTransferItem}
                                                                       variant="contained">
                                                            Transfer item
                                                        </LoadingButton>
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
                                                               loading={loading === BID_AUCTION}
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