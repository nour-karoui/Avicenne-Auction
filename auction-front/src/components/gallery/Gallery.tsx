import GalleryItemCard from "./GalleryItemCard";
import {Grid} from "@mui/material";

function Gallery() {
    return (
        <Grid container spacing={20} justifyContent="space-evenly">
            {
                [1,2,3,4,5,6,7,8,9,10,100,133,33241].map((i) =>
                    <Grid item key={i}>
                        <GalleryItemCard/>
                    </Grid>
                )
            }
        </Grid>
    )
}

export default Gallery;