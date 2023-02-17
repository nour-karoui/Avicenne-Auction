import {Grid, useTheme} from "@mui/material";


function Footer() {
    const theme = useTheme();

    return (
        <Grid container alignItems="center" className="footer-container"
              color="white" paddingX="3rem" paddingBottom="1rem"
              sx={{
                  background: theme.palette.secondary.main,
                  position: "fixed",
                  bottom: 0,
              }}>
        </Grid>
    )
}

export default Footer;