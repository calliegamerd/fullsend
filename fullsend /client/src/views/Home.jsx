import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { Grow } from "@material-ui/core";
import { useHistory } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { chatSocket } from "../services/websocket.service";
import CountUp from 'react-countup';
import TipRainModal from "../components/modals/rain/TipRainModal";


// Slideshow PNG's
import ArrowLeft from "../assets/home/arrow-left.svg";
import ArrowRight from "../assets/home/arrow-right.svg";
import Slide1 from "../assets/home/slideshow1.png";

// Other PNG's
import Coin from "../assets/icons/coin.png";
import Leaderboard from "../assets/home/leaderboard.png";
import Rain from "../assets/home/rain.png";
import RainCloud from "../assets/home/rain-cloud.svg";
import Droplet from "../assets/home/droplet.svg";

// Game PNG's
import Battles from "../assets/home/battles.png";
import Cases from "../assets/home/cases.png";
import Crash from "../assets/home/crash.png";
import Roulette from "../assets/home/roulette.png";
import Upgrader from "../assets/home/upgrader.png";
import Dice from "../assets/home/dice.png";
import Limbo from "../assets/home/limbo.png";
import Mines from "../assets/home/mines.png";
import Slots from "../assets/home/slots.png";

// Payment PNG's
import btc from "../assets/icons/btc.png";
import eth from "../assets/icons/eth.png";
import ltc from "../assets/icons/ltc.png";
import visa from "../assets/icons/visa.png";
import mastercard from "../assets/icons/mastercard.png";
import rust from "../assets/icons/rust.png";
import cashapp from "../assets/icons/cashapp.png";


const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "1400px",
    color: "#fff",
    overflowY: "scroll",
    overflow: "visible",
    scrollbarWidth: "none",
    margin: "0 auto",
    padding: "0 2rem",
    [theme.breakpoints.down("sm")]: {
      padding: "0",
    },
    [theme.breakpoints.down("md")]: {
      padding: "0",
    },
  },

  slideshowBox: {
    width: "100%",
    minHeight: "175px",
    maxHeight: "175px",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      display: "none"
    },
    [theme.breakpoints.down("md")]: {
      display: "none"
    },
  },
  slideshowSlide: {
    width: "100%",
    height: "100%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "0.25rem",
  },
  arrowLeft: {
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translate(-50%, -50%)",
    cursor: "pointer",
  },
  arrowRight: {
    position: "absolute",
    right: 0,
    top: "50%",
    transform: "translate(50%, -50%)",
    cursor: "pointer",
  },

  rewardsContainer: {
    display: "flex",
    gap: "1.5rem",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column"
    },
    [theme.breakpoints.down("md")]: {
      flexDirection: "column"
    },
  },
  leaderboard: {
    cursor: "pointer",
    borderRadius: "0.5rem",
    overflow: "hidden",
    height: "113px",
    width: "506px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "left",
    backgroundImage: `url(${Leaderboard})`,
    objectFit: "contain",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  leaderboardText: {
    fontWeight: 600,
    color: "transparent",
    background: "linear-gradient(90deg, #E1B56F 0.23%, #E2C390 113.43%) text",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    [theme.breakpoints.down("sm")]: {
    },
    [theme.breakpoints.down("md")]: {
    },
  },
  rain: {
    borderRadius: "0.5rem",
    overflow: "hidden",
    height: "113px",
    width: "853px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "left",
    backgroundImage: `url(${Rain})`,
    objectFit: "contain",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  rainText: {
    fontSize: "45px",
    letterSpacing: "0.2rem",
    fontWeight: 600,
    color: "transparent",
    background: "linear-gradient(90deg, #0074D9 0.23%, rgb(119, 192, 255) 113.43%) text",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    [theme.breakpoints.down("sm")]: {
      fontSize: "30px",
    },
    [theme.breakpoints.down("md")]: {
      fontSize: "15px",
    },
  },
  rainAmount: {
    borderRadius: "0.25rem",
    height: "4rem",
    background: "#050614",
    display: "flex", 
    fontWeight: 500,
    fontSize: "1.5rem",
    letterSpacing: "0.5rem",
    alignItems: "center", 
    justifyContent: "space-around",
    gap: "1rem", 
    padding: "0.75rem 1.25rem",
    color: "#fff",
    [theme.breakpoints.down("sm")]: {
      height: "2rem",
      fontSize: "0.5rem",
    },
    [theme.breakpoints.down("md")]: {
      height: "3rem",
      fontSize: "1rem",
    },
  },

  gamesContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)", 
    gap: "1rem",
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "repeat(2, 1fr)", 
    },
    [theme.breakpoints.down("md")]: {
      gridTemplateColumns: "repeat(2, 1fr)", 
    },
  },
  gameImage: {
    cursor: "pointer",
    height: "auto", 
    maxWidth: "100%",
    position: "relative"
  },
  newText: {
    position: "absolute"
  },
  divider: {
    backgroundColor: "#1a1b33",
    height: "1px",
    width: "100%", 
    margin: "2.5rem 0",
    [theme.breakpoints.down("xs")]: {
      backgroundColor: "transparent",
      margin: "1rem"
    },
  },

  bottomContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
    fontWeight: 500
  },
  paymentContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "16px",
    gap: "16px"
  },
  paymentImage: {
    height: 30
  },
}));

const Home = ({ }) => {
  const classes = useStyles();
  const history = useHistory();

  const [previousTotal, setPreviousTotal] = useState(0);
  const [currentTotal, setCurrentTotal] = useState(0);
  const [openTipRain, setOpenTipRain] = useState(false);

  const updateRainAmount = (newAmount) => {
    setPreviousTotal(currentTotal);
    setCurrentTotal(newAmount); 
  };

  useEffect(() => {   
    chatSocket.on("rain-update-amount", updateRainAmount);
    return () => {
      chatSocket.off("rain-update-amount", updateRainAmount);
    };
  }, []);

  return (
    <Grow in timeout={620}>
      <div className={classes.root}>
        <TipRainModal
          open={openTipRain}
          handleClose={() => setOpenTipRain(state => !state)}
        />

        {/*<div className={classes.slideshowBox}>
          <motion.img src={ArrowLeft} className={classes.arrowLeft} animate={{ filter: "brightness(100%)" }} whileHover={{ filter: "brightness(85%)" }}/>
          <motion.img src={ArrowRight} className={classes.arrowRight} animate={{ filter: "brightness(100%)" }} whileHover={{ filter: "brightness(85%)" }}/>
          <div className={classes.slideshowSlide} style={{ backgroundImage: `url(${Slide1})` }} />
        </div>*/}

        {/*<div style={{fontSize: 12, fontWeight: 500, marginBottom: "-1rem"}}>Events</div>*/}
        <div className={classes.rewardsContainer}>
          <div className={classes.rain}>
            <img src={RainCloud} />
            <div className={classes.rainText}>ACTIVE RAIN</div>
            <motion.div className={classes.rainAmount}>
              <img style={{height: 35, width: 35}} src={Droplet}/>
              <CountUp
                delay={0}
                duration={1}
                decimals={2}
                start={previousTotal}
                end={currentTotal}
              />
            </motion.div>
          </div>

          <motion.div whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }} className={classes.leaderboard} onClick={() => history.push(`/leaderboard`)}>
            <div style={{display: "flex", flexDirection: "column", marginLeft: "2rem", userSelect: "none"}}>
              <div className={classes.leaderboardText} style={{fontSize: "16px"}}>FULLSEND</div>
              <div className={classes.leaderboardText} style={{fontSize: "31px"}}>$1000.00 RACE</div>
            </div>
          </motion.div>
        </div>

        <div className={classes.divider} />

        {/*<div style={{fontSize: 12, fontWeight: 500, marginBottom: "-1rem"}}>Game Modes</div>*/}
        <div className={classes.gamesContainer}>
          <motion.img whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }} src={Battles} className={classes.gameImage} onClick={() => history.push(`/battles`)}/>
          <motion.img whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }} src={Upgrader} className={classes.gameImage} onClick={() => history.push(`/upgrader`)}/>
          <motion.img whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }} src={Cases} className={classes.gameImage} onClick={() => history.push(`/cases`)}/>
          <motion.img whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }} src={Roulette} className={classes.gameImage} onClick={() => history.push(`/roulette`)}/>
          <motion.img whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }} src={Crash} className={classes.gameImage} onClick={() => history.push(`/crash`)}/>
          <motion.img whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }} src={Dice} className={classes.gameImage} onClick={() => history.push(`/dice`)}/>

          <motion.img whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }} src={Limbo} className={classes.gameImage} onClick={() => history.push(`/limbo`)}/>
          <motion.img whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }} src={Slots} className={classes.gameImage} onClick={() => history.push(`/slots`)}/>
          <motion.img whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }} src={Mines} className={classes.gameImage} onClick={() => history.push(`/mines`)}/>

        </div>

        <div className={classes.divider} />

        <div className={classes.bottomContainer}>
          <div style={{alignText: "center"}}>Deposit with your preferred payment method</div>
          <div className={classes.paymentContainer}>
            <img src={btc} className={classes.paymentImage} />
            <img src={eth} className={classes.paymentImage} />
            <img src={ltc} className={classes.paymentImage} />
            <img src={cashapp} className={classes.paymentImage} />
            <img style={{height: 20}} src={visa} className={classes.paymentImage} />
            <img src={mastercard} className={classes.paymentImage} />
            <img src={rust} className={classes.paymentImage} />
          </div>
        </div>
      </div>
    </Grow>
  );
};

export default Home;