import GalleryItemCard from "./GalleryItemCard";
import {Grid} from "@mui/material";
import {useEffect, useState} from "react";
import {auctionsFactory, getAuctionAddress} from "../../services/initWeb3";

function Gallery() {
    const [auctionsAddresses, setAuctionsAddresses] = useState<string[]>([]);
    useEffect(() => {
        getAuctions();
    }, [])
    const getAuctions = async () => {
        const addressesList = [];
        const auctionsCount = await auctionsFactory.totalAuctionsCount();
        const totalAuctionsCount = auctionsCount.toNumber();
        for (let i = 0; i < totalAuctionsCount; i++) {
            const address = await getAuctionAddress(i);
            addressesList.push(address);
        }
        setAuctionsAddresses(addressesList);
        console.log(addressesList);
    }
    return (
        <Grid container spacing={20} justifyContent="space-evenly">
            {
                auctionsAddresses.map((address) =>
                    <Grid item key={address}>
                        <GalleryItemCard address={address}/>
                    </Grid>
                )
            }
        </Grid>
    )
}

export default Gallery;