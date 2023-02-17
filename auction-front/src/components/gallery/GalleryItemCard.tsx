import {Button, Grid, Card, CardActions, CardContent, CardMedia, Typography, Tooltip, Chip} from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {Fragment, useEffect, useState} from "react";
import {LoadingButton} from "@mui/lab";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import {getAuction} from "../../services/initWeb3";
import {ethers} from "ethers";


const isLeadBidder = true;

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

    useEffect(() => {
        const intervalRef = setInterval(updateRemainingTime, 1000);
        initAuctionDetails();
        return () => clearInterval(intervalRef);
    }, [address]);

    const initAuctionDetails = async () => {
        const contract = await getAuction(address);
        setAuction(contract);
        await setNftDetails(contract);
    }
    const updateRemainingTime = () => {
        const d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        d.setUTCSeconds(expirationDate);
        const remainingTimeInMilliseconds =  d.getMilliseconds() - new Date().getTime();
        setRemainingTime(remainingTimeInMilliseconds);
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
        const tokenUri = await contract.getTokenUri();
        setTokenUri(tokenUri);
    }

    const placeBid = async () => {
        const bid = await auction.bid({value: ethers.utils.parseEther('0.1')});
    }

    const openOpenSeaLink = () => {
        window.open('https://www.geeksforgeeks.org/how-to-open-url-in-new-tab-using-javascript/', '_blank');
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
                                { isLeadBidder
                                    ? <Chip label={currentBidder.slice(0,5) + "..."} variant="outlined"/>
                                    : <Chip label="Me"
                                            icon={<FiberManualRecordIcon style={{transform: 'scale(0.5)'}} />}
                                            variant="outlined" color="success"/>}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>{
                        remainingTime &&
                        <Fragment>
                            <Typography variant="subtitle2">
                                Remaining Time
                            </Typography>
                            <Typography variant="h6" component="div">
                                {Math.floor(remainingTime / (1000 * 60 * 60)) }h :{Math.floor((remainingTime / (1000 * 60)) % 60)}m
                                : {Math.floor((remainingTime / 1000) % 60)}s
                            </Typography>
                        </Fragment>
                    }
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <Grid container justifyContent="space-between" spacing={1}>
                    <Grid item>
                        <LoadingButton size="small"
                                       loading={placeBidLoading}
                                       onClick={placeBid}
                                       variant="contained">
                            Place a bid
                        </LoadingButton>
                    </Grid>
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