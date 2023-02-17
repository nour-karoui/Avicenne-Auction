import {Button, Grid, Card, CardActions, CardContent, CardMedia, Typography, Tooltip, Chip} from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {Fragment, useEffect, useState} from "react";
import {LoadingButton} from "@mui/lab";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';


const isLeadBidder = true;

function GalleryItemCard() {

    const [placeBidLoading, setPlaceBidLoading] = useState(false);

    // a number corresponding to the timestamp of the expiration of the auction
    const [expirationDate, setExpirationDate] = useState<number>((new Date()).getTime() + 7200000 * 30);

    const [remainingTime, setRemainingTime] = useState<Date | undefined>(new Date());

    useEffect(() => {
        const intervalRef = setInterval(updateRemainingTime, 1000);
        return () => clearInterval(intervalRef);
    }, [])

    const updateRemainingTime = () => {
        const remainingTimeInMilliseconds = expirationDate - new Date().getTime();
        setRemainingTime(new Date(remainingTimeInMilliseconds));
    }

    const placeBid = () => {

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
                                    0.123 ETH
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs>
                                <Typography variant="subtitle2">
                                    Lead Bidder
                                </Typography>
                                { isLeadBidder
                                    ? <Chip label="Mister bidder" variant="outlined"/>
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
                                {remainingTime.getHours()}h :{remainingTime.getMinutes()}m
                                : {remainingTime.getSeconds()}s
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