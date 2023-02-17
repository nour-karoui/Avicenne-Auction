import {Grid, InputAdornment, TextField} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {useState} from "react";
import {auctionsFactory} from "../../services/initWeb3";

function NewAuctionForm() {

    const [addAuctionLoading, setAddAuctionLoading] = useState(false);

    const [tokenAddress, setTokenAddress] = useState(new FormInput((v) => v !== '', ''));
    const [tokenId, setTokenId] = useState(new FormInput((v) => v !== '', ''));
    const [startingPrice, setStartingPrice] = useState(new FormInput((v) => v !== 0, 0));

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
        await auctionsFactory.createNewAuction(tokenAddress.value, tokenId.value);
    }

    return (
        <Grid container spacing={3} paddingBottom="50px">
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
                                   disabled={!(tokenAddress.isValid && tokenId.isValid && startingPrice.isValid)
                                       || tokenAddress.isPristine || tokenId.isPristine || startingPrice.isPristine}
                                   loading={addAuctionLoading}
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