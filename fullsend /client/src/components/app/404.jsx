import React from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles({
    root: {
        display: 'flex',
        width: "100%",
        flexDirection: 'column',
        height: '40rem',
        alignItems: 'center',
        justifyContent: 'center',
        color: "#9d9d9d",
        fontFamily: "Poppins",
        fontSize: "14px",
        fontWeight: 400,
        letterSpacing: ".005em",
    },
    container: {
        display: 'flex',
        width: "100%",
        flexDirection: 'column',
        justifyContent: 'center',
        margin: "0 auto",
        alignItems: 'center',
        color: "#9d9d9d",
        fontFamily: "Poppins",
        fontSize: "15px",
        fontWeight: 400,
        letterSpacing: ".005em",
        '& img': {
            width: '10rem',
            marginBottom: '1rem',
        },
        '& h1': {
            color: "#b9b9b9",
            fontFamily: "Poppins",
            fontSize: "50px",
            fontWeight: 500,
            letterSpacing: ".1em",
            margin: 0,
        }
    }
});

const Err = () => {

    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <Container className={classes.container}>
                <span><b>404 error</b>. Page not found :(</span>
            </Container>
        </Box>
    );
};

export default Err;