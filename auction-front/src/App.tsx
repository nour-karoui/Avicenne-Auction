import React from 'react';
import './App.css';
import Header from "./components/header/Header";
import {createTheme, ThemeProvider} from '@mui/material/styles'
import GalleryItemCard from "./components/gallery/GalleryItemCard";
import Gallery from "./components/gallery/Gallery";
import NewAuctionForm from "./components/gallery/NewAuctionForm";
import {Box} from "@mui/material";
import Footer from "./components/footer/Footer";


const theme = createTheme({
    palette: {
        primary: {
            main: '#000000',
        },
        secondary: {
            main: '#098292'
        },
        info: {
            main: '#f0e6d5'
        },
        success: {
            main: '#4c9537',
        },
        error: {
            main: '#EE3B2B'
        }
    },
    components: {
        MuiButton: {
            defaultProps: {
                sx: {
                    borderRadius: "40px",
                    paddingX: "30px",
                    paddingY: "10px"
                }
            }
        }
    },
    typography: {
        subtitle2: {
            color: '#5b5b5b'
        }
    }
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Header/>
            <Box paddingX="200px" paddingBottom="200px">
                <NewAuctionForm/>
                <Gallery/>
            </Box>
            <Footer/>
        </ThemeProvider>
    );
}

export default App;
