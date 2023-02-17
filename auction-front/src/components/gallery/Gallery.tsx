import GalleryItemCard from "./GalleryItemCard";
import {Grid} from "@mui/material";
import {useEffect, useState} from "react";
import {auctionsFactory, getAuctionAddress} from "../../services/initWeb3";

interface GalleryProps {
    updateAuctions: Boolean;
}

function Gallery({updateAuctions}: GalleryProps) {
    const [auctionsAddresses, setAuctionsAddresses] = useState<string[]>([]);

    useEffect(() => {
        getAuctions();
    }, [updateAuctions]);

    const getAuctions = async () => {
        const addressesList = [];
        const auctionsCount = await auctionsFactory.totalAuctionsCount();
        const totalAuctionsCount = auctionsCount.toNumber();
        for (let i = 0; i < totalAuctionsCount; i++) {
            const address = await getAuctionAddress(i);
            addressesList.push(address);
        }
        setAuctionsAddresses(addressesList);
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