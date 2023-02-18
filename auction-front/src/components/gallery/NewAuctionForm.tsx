import {Grid, InputAdornment, TextField} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {SyntheticEvent, useState} from "react";
import {auctionsFactory, getERC721Contract} from "../../services/initWeb3";
import {Success, Error} from "../../services/responses";
import {ethers} from "ethers";

const ADD_AUCTION = "Add Auction";

interface NewAuctionFormProps {
    addAuctionCallback: () => void;
}

function NewAuctionForm({addAuctionCallback}: NewAuctionFormProps) {

    const [tokenAddress, setTokenAddress] = useState(new FormInput((v) => v !== '', ''));
    const [tokenId, setTokenId] = useState(new FormInput((v) => v !== '', ''));
    const [startingPrice, setStartingPrice] = useState(new FormInput((v) => v !== 0, 0));

    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState<string | undefined>(undefined);

    const onTokenAddressChange = (value: string) => {
        setTokenAddress(tokenAddress.onChange(value));
    }

    const onTokenIdChange = (value: string) => {
        setTokenId(tokenId.onChange(value));
    }

    const onStartingPriceChange = (value: string) => {
        const floatValue = parseFloat(value);
        setStartingPrice(startingPrice.onChange(floatValue));
    }

    const onSubmit = async () => {
        setLoading(ADD_AUCTION);
        try {
            const tx = await auctionsFactory.createNewAuction(tokenAddress.value, tokenId.value, ethers.utils.parseEther(startingPrice.value.toString()), {gasLimit: 5000000});
            const result = await tx.wait();
            const auctionAddress = result.events[0].address;
            const tokenContract = await getERC721Contract(tokenAddress.value.toString());
            console.log('here is auction address: ' + auctionAddress);
            const nftTx = await tokenContract.setApprovalForAll(auctionAddress, true, {gasLimit: 5000000});
            await nftTx.wait();
            addAuctionCallback();
        }catch (e: any) {
            console.log(e);
            setErrorMessage(e.reason);
            setErrorOpen(true);
        }
        finally {
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


    // @ts-ignore
    return (
        <Grid container spacing={3} paddingBottom="50px">
            <Success open={successOpen} handleClose={handleSuccessClose} message={successMessage}></Success>
            <Error open={errorOpen} handleClose={handleErrorClose} message={errorMessage}></Error>
            <Grid item container>
                <TextField label='Token Address' variant="standard"
                           value={tokenAddress.value}
                           onChange={(e) => onTokenAddressChange(e.target.value)}
                           fullWidth/>
            </Grid>

            <Grid item container spacing={6} justifyContent='space-between'>
                <Grid item xs={5}>
                    <TextField label='Token Id' variant="standard"
                               value={tokenId.value}
                               onChange={(e) => onTokenIdChange(e.target.value)}
                               fullWidth/>
                </Grid>
                <Grid item xs={5}>
                    <TextField label='Starting Price' variant="standard"
                               type='number'
                               value={startingPrice.value}
                               onChange={(e) => onStartingPriceChange(e.target.value)}
                               fullWidth
                               InputProps={{
                                   endAdornment:
                                       <InputAdornment position="end">
                                           ETH
                                       </InputAdornment>
                               }}/>
                </Grid>
                <Grid item>
                    <LoadingButton variant='contained'
                                   loading={loading === ADD_AUCTION}
                                   disabled={!(tokenAddress.isValid && tokenId.isValid && startingPrice.isValid)
                                       || tokenAddress.isPristine || tokenId.isPristine || startingPrice.isPristine}
                                   onClick={onSubmit}
                    >
                        Add Auction
                    </LoadingButton>
                </Grid>
            </Grid>
        </Grid>
    )
}

class FormInput {
    constructor(
        private validate: (v: string | number) => boolean,
        public value: string | number,
        public isValid: boolean = true,
        public isPristine: boolean = true) {
    }

    public onChange = (value: string | number) => {
        if (typeof value === "number")
            return new FormInput(this.validate, value || 0, this.validate(value), false)
        else
            return new FormInput(this.validate, value || '', this.validate(value), false)
    };
}

export default NewAuctionForm;