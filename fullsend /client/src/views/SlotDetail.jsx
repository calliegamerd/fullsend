import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Preloader from "../Preloader"; // Import the Preloader component
import logos from "../assets/growcsn.png";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";

const ColorCircularProgress = withStyles({
  root: {
    color: "#fff !important",
  },
})(CircularProgress);


const useStyles = makeStyles(theme => ({
  container: {
    width: 1150,
    height: 650,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative', // Position relative for absolute positioning of Preloader
    [theme.breakpoints.down("sm")]: {
      width: 370,
      height: 620,
   },

  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  root: {
    padding: "30px",
    width: "calc(100%)",
    padding: "1rem 2rem",
    paddingBottom: "2rem",
    margin: "0 auto",
    marginTop: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      width: "calc(100%)",
      minHeight: "100vh",
      marginTop: "20px",
    },
  },
  footer: {
    borderRadius: '0 0 0.5rem 0.5rem',
    backgroundColor: '#0a0b1c',
    borderTop: '1px solid #0a0b1c',
    width: 1150,
    borderRadius: 6,

    [theme.breakpoints.down("sm")]: {
      width: 370,
        },
  },
  footerContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%',
    marginLeft: '450px',
    padding: '1rem 2rem',
    backgroundColor: '#0a0b1c',
    borderBottomLeftRadius: '0.5rem',
    borderBottomRightRadius: '0.5rem',
    [theme.breakpoints.down("sm")]: {
      marginLeft: '150px',
        },
  },
  logo: {
    height: '1.5rem',
  },
  preloader: {
    position: 'absolute',
    top: 0,
    left: 0,
    
    width: '100%',
    height: '100%',
    backgroundColor: '#0a0b1c', // Changed preloader background color
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, // Ensure the Preloader is above the iframe
  },
}));

const SlotDetail = ({ user }) => {
  const { identifier2 } = useParams();
  const [launchUrl, setLaunchUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    const fetchLaunchUrl = async () => {
      try {
        const requestBody = {
          provider_code: 'PRAGMATIC',
          game_type: 'slot',
          game_code: identifier2,
          user_code: user._id,
          user_balance: parseFloat(user.wallet.toFixed(7))
        };

        const response = await axios.post('http://localhost:5000/api/mm2/launch-game', requestBody);
        console.log('Game launch response:', response.data);
        setLaunchUrl(response.data.launch_url);
      } catch (error) {
        console.error('Error launching game:', error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
  
      } 
    };

    fetchLaunchUrl();
    
  }, [identifier2, user]);

  return (
    <div className={classes.root}>
      <div className={classes.container}>
      {loading && <div className={classes.preloader}><Preloader /></div>}
        {launchUrl ? (
          <iframe
            src={launchUrl}
            className={classes.iframe}
            title="Game iframe"
            allowFullScreen
          ></iframe>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className={classes.footer}>
        <div className={classes.footerContent}>
          <img
            src={"http://localhost:3000/static/media/logo2.bd0234cd.png"}
            alt="Logo"
            className={classes.logo} 
          />
        </div>
      </div>
    </div>
  );
};

SlotDetail.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(SlotDetail);
