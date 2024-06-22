import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { Grow } from "@material-ui/core";
import { useHistory } from 'react-router-dom';
import { motion } from "framer-motion";
import { chatSocket } from "../services/websocket.service";
import CountUp from 'react-countup';
import TipRainModal from "../components/modals/rain/TipRainModal";

import coin from "../assets/icons/coin.png";
import Image from "../assets/home/image.png";
import Background1 from "../assets/home/Background1.png";
import Background2 from "../assets/home/Background2.png";
import Background3 from "../assets/home/Background3.png";
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
    maxWidth: "1250px",
    color: "#fff",
    overflowY: "scroll",
    overflow: "visible",
    padding: "0 20px",
    scrollbarWidth: "none",
    width: "100%",
    margin: "0 auto"
  },

  topContainer: {

  },
  border: {
    height: "100%",
    width: "100%",
    boxShadow: "inset 0 0 35px rgba(0,0,0,.61)",
    backgroundColor: "#101123",
    backgroundImage: "linear-gradient(90deg, hsl(215, 75%, 50%) 50%, transparent 50%), linear-gradient(90deg, transparent 50%, transparent 50%), linear-gradient(0deg, hsl(215, 75%, 50%) 50%, transparent 50%), linear-gradient(0deg, hsl(215, 75%, 50%) 50%, transparent 50%)",
    backgroundRepeat: "repeat-x, repeat-x, repeat-y, repeat-y",
    backgroundSize: "16px 4px, 16px 4px, 4px 16px, 4px 16px",
    backgroundPosition: "0% 0%, 100% 100%, 0% 100%, 100% 0px",
    borderRadius: "0.25rem",
    borderBottom: "3px solid hsl(215, 75%, 40%)",
    padding: "10px",
    animation: "$dash 20s linear infinite",
  },
  "@keyframes dash": {
    to: {
      backgroundPosition: "100% 0,0 100%,0 -400%,100% 600%",
    },
  },
  mainBox: {
    display: "flex",
    alignItems: "center",
    color: "#000",
    height: "5rem",
    padding: "1rem",
    [theme.breakpoints.down("sm")]: {
    },
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      justifyContent: "center",
      height: "10rem",
    },
  },
  rainText: {
    fontSize: "60px",
    letterSpacing: "0.2rem",
    fontWeight: 600,
    color: "transparent",
    background: "linear-gradient(90deg, #0074D9 0.23%, rgb(119, 192, 255) 113.43%) text",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    [theme.breakpoints.down("sm")]: {
    },
    [theme.breakpoints.down("md")]: {
      fontSize: "30px",
    },
  },
  rainContainer: {
    display: "flex",
    marginLeft: "1rem",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
    },
    [theme.breakpoints.down("md")]: {
      marginLeft: "0",
    },
  },
  playNearn: {
    textShadow: "0 0 8px hsl(215, 75%, 40%)",
    color: "hsl(215, 75%, 50%)",
    fontWeight: 500
  },
  info: {
    color: "#9E9FBD",
    fontSize: "11px", 
    fontWeight: 500
  },
  rainAmount: {
    borderTopLeftRadius: "0.25rem",
    borderBottomLeftRadius: "0.25rem",
    height: "4rem",
    background: "#050614",
    display: "flex", 
    fontWeight: 500,
    fontSize: "1.5rem",
    letterSpacing: "0.5rem",
    alignItems: "center", 
    justifyContent: "center",
    gap: "1rem", 
    padding: "0.75rem 1.25rem",
    minWidth: "12rem",
    color: "#fff",
    [theme.breakpoints.down("sm")]: {

    },
    [theme.breakpoints.down("md")]: {

    },
  },
  tipRainButton: {
    borderTopRightRadius: "0.25rem",
    borderBottomRightRadius: "0.25rem",
    color: "#fff",
    backgroundColor: "hsl(215, 75%, 50%)",
    display: "flex", 
    fontWeight: 500,
    fontSize: "12px",
    alignItems: "center", 
    gap: "0.25rem", 
    padding: "0.75rem 1rem",
    cursor: "pointer", 
    userSelect: "none"
  },

  gamesContainer: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  gameBox: {
    height: "200px",
    flex: "1 1 0%",
    borderRadius: "0.25rem",
    overflow: "hidden",
    cursor: "pointer",
    position: "relative",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '100% center', 
    backgroundSize: 'cover',
  },
  gameTitle: {
    color: "rgb(255, 255, 255)",
    fontSize: "18px",
    fontWeight: 600,
    lineHeight: "30px",
    position: "absolute",
    margin: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  anker: {
    flex: "1 1 0%",
    transitionDuration: "300ms",
    "&:hover": {
      transform: "scale(1.03)"
    }
  },
  video: {
    height: "100%",
    width: "100%",
    objectFit: "cover"
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

  divider: {
    backgroundColor: "#1a1b33",
    height: "1px",
    width: "100%", 
    margin: "2.5rem 0",
    [theme.breakpoints.down("xs")]: {
      backgroundColor: "transparent",
      margin: "1rem"
    },
  }
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
        <div className={classes.topContainer}>
          <div className={classes.border}>
            <div className={classes.mainBox}>
              <div className={classes.rainText}>RAIN</div>
              <div className={classes.rainContainer}>
                <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}> 
                  <div className={classes.playNearn}>Play and earn free money!</div>
                  <div className={classes.info}>Rain pot splits between joined users</div>
                </div>
                <div style={{display: "flex"}}>
                  <motion.div className={classes.rainAmount}>
                    <img style={{height: 25, width: 25}} src={coin}/>
                    <CountUp
                      delay={0}
                      duration={1}
                      decimals={2}
                      start={previousTotal}
                      end={currentTotal}
                    />
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.97 }} className={classes.tipRainButton} onClick={() => setOpenTipRain(state => !state)}>Tip Rain</motion.div>
                </div>          
              </div>
            </div>
          </div>
        </div>

        <div className={classes.divider} />

        <div className={classes.gamesContainer}>
          <a onClick={() => history.push(`/battles`)} className={classes.anker}>
            <div className={classes.gameBox} style={{backgroundImage: `url(${Background2})`}}>
              <div className={classes.gameTitle}>Case Battles</div>
              <video className={classes.video}/>
            </div>  
          </a>
          <a onClick={() => history.push(`/cases`)} className={classes.anker}>
            <div className={classes.gameBox} style={{backgroundImage: `url(${Background1})`}}>
              <div className={classes.gameTitle}>Cases</div>
              <video className={classes.video} />
            </div>  
          </a>
        </div>
        <div className={classes.gamesContainer} style={{marginTop: "1rem"}}>
          <a onClick={() => history.push(`/crash`)} className={classes.anker}>
            <div className={classes.gameBox} style={{backgroundImage: `url(${Background1})`}}>
              <div className={classes.gameTitle}>Crash</div>
              <video className={classes.video}/>
            </div>  
          </a>
          <a onClick={() => history.push(`/roulette`)} className={classes.anker}>
            <div className={classes.gameBox} style={{backgroundImage: `url(${Background3})`}}>
              <div className={classes.gameTitle}>Roulette</div>
              <video className={classes.video} />
            </div>  
          </a>
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
  )

};

export default Home;