import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
import { useToasts } from "react-toast-notifications";
import { useHistory } from 'react-router-dom';
import { motion } from "framer-motion";
import { getUserVipData } from "../../services/api.service";
import ProgressBar from 'react-bootstrap/ProgressBar'
import CountUp from 'react-countup';
import Skeleton from "@material-ui/lab/Skeleton";

// Assets
import coin from "../../assets/icons/coin.png";
import logo from "../../assets/navbar/logo2.png";
import logosmall from "../../assets/navbar/small-logo2.png";

// Modals
import Wallet from "../modals/user/WalletModal";
import Coupon from "../modals/CouponModal";
import Free from "../modals/rewards/FreeModal";
import Race from "../modals/RaceModal";
import Support from "../modals/user/SupportModal";
import Profile from "../modals/user/ProfileModal";
import LoginModal from "../modals/login/LoginModal";
import Rewards from "../modals/rewards/RewardsModal";
import Affiliates from "../modals/affiliates/AffiliatesModal";
import TermsModal from "../modals/TermsModal";
import About from "../modals/AboutModal";
import CashierModal from "../modals/cashier/CashierModal";
import RewardsModal from "../modals/rewards/RewardsModal";
import CouponModal from "../modals/CouponModal";
import FreeModal from "../modals/rewards/FreeModal";
import AffiliatesModal from "../modals/affiliates/AffiliatesModal";
import AdminModal from "../modals/admin/AdminModal";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100px",
    background: "#0A0B1C",
    [theme.breakpoints.down("xs")]: {
      height: "65px",
    },
  },
  desktop: {
    display: "flex",
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },

  brandContainer: {
    height: "100px",
    width: "300px",
    userSelect: "none",
    background: "#0A0B1C",
    position: "relative", 
    background: "radial-gradient(ellipse at center bottom, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  brandLogo: {
    height: "100%",
    width: "100%",
    objectFit: "contain",
    padding: "0 3rem",
    cursor: "pointer"
  },  

  navigation: {
    width: "calc(100% - 300px)",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  top: {
    height: "30px",
    backgroundColor: "#050614",
    position: "relative",
    display: "flex",
    alignItems: "center",
    padding: "0 1rem",
    justifyContent: "space-between"
  },
  bottom: {
    height: "70px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    padding: "0 1rem",
    justifyContent: "space-between"
  },
  text: {
    color: "rgb(104, 101, 132)",
    fontSize: "12px",
    cursor: "pointer",
    fontWeight: 500,
    userSelect: "none",
    display: "flex",
    alignItems: "center",
    gap: "0.3rem",
  },

  navContainer: {
    display: "flex",
    gap: "0.75rem"
  },
  home: {
    backgroundColor: "#1a1b33",
    borderRadius: "0.25rem",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",
    color: "#9E9FBD",
    userSelect: "none",
    fontWeight: 500,
    position: "relative",
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      padding: "10px"
    },
  },
  game: {
    backgroundColor: "#1a1b33",
    borderRadius: "0.25rem",
    padding: "10px 1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",
    color: "#fff",
    userSelect: "none",
    fontWeight: 500,
    position: "relative",
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      padding: "10px"
    },
  },
  signin: {
    backgroundColor: "#1a1b33",
    borderRadius: "0.25rem",
    padding: "10px 1rem",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    color: "#9E9FBD",
    userSelect: "none",
    fontWeight: 500,
    position: "relative",
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      padding: "10px"
    },
  },
  subMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    backgroundColor: "#FFF",
    borderBottomLeftRadius: "0.25rem",
    borderBottomRightRadius: "0.25rem",
    zIndex: 1000,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    overflow: "hidden",
    backgroundColor: "#1a1b33",
  },
  gameButton: {
    cursor: "pointer",
    height: "4rem",
    padding: "0 1rem",
    position: "relative",
    alignItems: "center",
    fontWeight: "bold",
    userSelect: "none",
    whiteSpace: "nowrap",
    willChange: "opacity",
    fontWeight: 500,
    color: "hsl(220, 22%, 70%)",
    display: "flex", 
    justifyContent: "left", 
  },
  buttonIconGame: {
    marginRight: "0.75rem",
    fill: "hsl(215, 75%, 50%)",
    flex: "none",
    height: "1.25rem",
    width: "1.25rem",
    display: "inline-block",
    outline: "none",
  },
  arrowSvg: {
    transitionDuration: "200ms", 
    width: "12.5px",
    height: "12.5px",
    flexShrink: 0,
    fill: "#fff",
    opacity: 0.5,
    marginLeft: "4.5rem"
  },

  balanceContainer: {
    display: "flex",
    color: "#fff"
  },
  balance: {
    borderTopLeftRadius: "0.25rem",
    borderBottomLeftRadius: "0.25rem",
    background: "#050614",
    display: "flex", 
    fontWeight: 500,
    fontSize: "12px",
    alignItems: "center", 
    justifyContent: "center",
    gap: "0.25rem", 
    padding: "0.75rem 1.25rem",
    minWidth: "7.5rem",
    [theme.breakpoints.down("xs")]: {
      padding: "0.65rem 0.5rem"
    },
  },
  cashier: {
    borderTopRightRadius: "0.25rem",
    borderBottomRightRadius: "0.25rem",
    backgroundColor: "hsl(215, 75%, 50%)",
    display: "flex", 
    fontWeight: 500,
    fontSize: "12px",
    alignItems: "center", 
    gap: "0.25rem", 
    padding: "0.75rem 1rem",
    cursor: "pointer", 
    userSelect: "none",
    [theme.breakpoints.down("xs")]: {
      padding: "0.65rem 0.5rem"
    },
  },

  userContainer: {
    display: "flex",
    gap: "0.5rem",
    borderRadius: "0.25rem",
    padding: "0.35rem 0.55rem",
    display: "flex",
    alignItems: "center",
    width: "15rem",
    backgroundColor: "#1a1b33",
    position: "relative",
    cursor: "pointer",
    userSelect: "none",
    [theme.breakpoints.down("xs")]: {
      width: "100%"
    },
  },
  profileMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    backgroundColor: "#1a1b33",
    borderBottomLeftRadius: "0.25rem",
    borderBottomRightRadius: "0.25rem",
    zIndex: 100,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    overflow: "hidden",
  },
  profileButton: {
    cursor: "pointer",
    height: "3rem",
    padding: "0 1rem",
    position: "relative",
    alignItems: "center",
    fontWeight: "bold",
    userSelect: "none",
    whiteSpace: "nowrap",
    willChange: "opacity",
    fontWeight: 500,
    color: "#fff",
    display: "flex", 
    fontSize: "12px",
    justifyContent: "left", 
  },
  buttonIconProfile: {
    marginRight: "0.75rem",
    fill: "hsl(215, 75%, 50%)",
    color: "hsl(215, 75%, 50%)",
    flex: "none",
    height: "1rem",
    width: "1rem",
    display: "inline-block",
    outline: "none",
  },
  avatar: {
    height: 32,
    width: 32,
    borderRadius: "0.25rem"
  },
  username: {
    color: "#fff",
    fontWeight: 500,
    fontSize: "13px"
  },
  progress: {
    marginTop: "0.3rem",
    borderRadius: "4px",
    backgroundColor: "#242645",
    height: "4px",
    "& .progress-bar": {
      backgroundColor: "#2871FF"
    }
  },
  levelBox: {
    backgroundColor: "#0C132E",
    color: "#2871FF",
    fontWeight: 500,
    fontSize: "12px",
    borderRadius: "6px",
    padding: "0.1rem 0.5rem"
  },
  dropDown: {
    background: "#1a1b33",
    padding: "0.5rem",
    borderRadius: "0.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transitionDuration: "300ms",
    "&:hover": {
      filter: "brightness(125%)"
    },
    "& > svg": {
      height: 15, 
      width: 15, 
      fill: "#9E9FBD",
      outline: "none"
    }
  },

  popupButton: {
    cursor: "pointer",
    height: "2.25rem",
    display: "inline-flex",
    outline: "none",
    padding: "0 0.75rem",
    position: "relative",
    alignItems: "center",
    fontWeight: "bold",
    userSelect: "none",
    whiteSpace: "nowrap",
    willChange: "opacity",
    borderRadius: "0.25rem",
    justifyContent: "center",
    transitionDuration: "350ms",
    fontWeight: 500,
    color: "#9E9FBD",
    backgroundColor: "hsla(220, 100%, 82%, 0)",
    "&:hover": {
      backgroundColor: "#313A4D",
      filter: "brightness(130%)"
    }
  },
  buttonIcon: {
    marginRight: ".5em",
    fill: "#9E9FBD",
    flex: "none",
    height: "1em",
    width: "1em",
    display: "inline-block",
    outline: "none",
  },

  mobile: {
    display: "none",
    height: "100%",
    margin: 0,
    position: "relative",
    alignItems: "center",
    padding: "0 0.5rem",
    justifyContent: "space-between",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
    },
  },
}));

const Navbar = ({ isAuthenticated, isLoading, user, logout }) => {
  // Declare State
  const { addToast } = useToasts();
  const history = useHistory();
  const classes = useStyles();
  
  const [previousTotal, setPreviousTotal] = useState(0);
  const [currentTotal, setCurrentTotal] = useState(0);
  const [affiliateCode, setAffiliateCode] = useState(null);

  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(0);
  const [vipData, setVipData] = useState(null);
  const [currentMajorLevelIndex, setCurrentMajorLevelIndex] = useState(null);

  const [openGames, setOpenGames] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openProfileMobile, setOpenProfileMobile] = useState(false);
  const [openCashier, setOpenCashier] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRewards, setOpenRewards] = useState(false);
  const [openCoupon, setOpenCoupon] = useState(false);
  const [openFree, setOpenFree] = useState(false);
  const [openAffiliates, setOpenAffiliates] = useState(false);
  const [openSupport, setOpenSupport] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(false);

  const gameMenuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const profileMenuRefModile = useRef(null);

  // profile dropdown handler
  useEffect(() => {
    if (openProfile) {
      const handleClickOutside = (event) => {
        if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
          setOpenProfile(false);
        }
      };
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [openProfile]);

  // game dropdown handler
  useEffect(() => {
    if (openGames) {
      const handleClickOutside = (event) => {
        if (gameMenuRef.current && !gameMenuRef.current.contains(event.target)) {
          setOpenGames(false);
        }
      };
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [openGames]);

  // affiliate link handler
  useEffect(() => {
    const storageCode = localStorage.getItem("affiliateCode");
    if (!isLoading && isAuthenticated && storageCode) {
      localStorage.removeItem("affiliateCode");

      setOpenFree(true);
      setAffiliateCode(storageCode);
    }
  }, [isLoading, isAuthenticated]);

  // balance animation handler and experience update with level update
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserVipData();

        setVipData(data);
        setCurrentMajorLevelIndex(data.majorLevelNames.findIndex((levelName) => levelName === data.currentLevel.levelName));
        let lastObject = data.allLevels[data.allLevels.length - 1];
        let wagerNeededLastLevel = lastObject.wagerNeeded;
        if (data.wager >= wagerNeededLastLevel) {
          setCompleted(1);
        }
        else {
          setCompleted(0);
        }
        setLoading(false);
      } catch (error) {
        console.log("There was an error while loading user vip data:", error);
      }
    };

    setPreviousTotal(currentTotal);
    setCurrentTotal(user ? user?.wallet : 0.00); 

    setTimeout(() => {
      fetchData();
    }, 1000)
  }, [user?.wallet]);

  // game menu animation props
  const subMenuAnimate = {
    enter: {
      opacity: 1,
      scale: [0.7, 1],
      transformOrigin: "top center",
      transition: {
        duration: 0.1
      },
      display: "block"
    },
    exit: {
      opacity: 0,
      scale: [1, 0.7],
      transformOrigin: "top center",
      transition: {
        duration: 0.1
      },
      transitionEnd: {
        display: "none"
      }
    }
  };

  // profile menu animation props
  const profileMenuAnimate = {
    enter: {
      opacity: 1,
      scale: [0.7, 1],
      transformOrigin: "top middle",
      transition: {
        duration: 0.07
      },
      display: "block"
    },
    exit: {
      opacity: 0,
      scale: [1, 0.7],
      transformOrigin: "top middle",
      transition: {
        duration: 0.07
      },
      transitionEnd: {
        display: "none"
      }
    }
  };

  return (
    <div className={classes.root}>
      <CashierModal open={openCashier} handleClose={() => setOpenCashier(!openCashier)}/>
      <LoginModal open={openLogin} handleClose={() => setOpenLogin(!openLogin)}/>
      <RewardsModal open={openRewards} handleClose={() => setOpenRewards(!openRewards)}/>
      <CouponModal open={openCoupon} handleClose={() => setOpenCoupon(!openCoupon)}/>
      <FreeModal open={openFree} handleClose={() => setOpenFree(!openFree)} code={affiliateCode}/>
      <AffiliatesModal open={openAffiliates} handleClose={() => setOpenAffiliates(!openAffiliates)}/>
      <Support open={openSupport} handleClose={() => setOpenSupport(!openSupport)}/>
      <TermsModal open={openTerms} handleClose={() => setOpenTerms(!openTerms)}/>
      <AdminModal open={openAdmin} handleClose={() => setOpenAdmin(!openAdmin)}/>

      <div className={classes.desktop}>
        <div className={classes.brandContainer}>
          <motion.img whileTap={{ scale: 0.97 }} className={classes.brandLogo} src={logo} onClick={() => { history.push(`/home`) }}/>
        </div>
        <div className={classes.navigation}>
          <div className={classes.top}>
            <div style={{display: "flex", gap: "1rem"}}>
              <motion.div whileTap={{ scale: 0.97 }} className={classes.text} onClick={() => { history.push(`/leaderboard`) }} style={{color: "#E3C85E"}}><svg style={{height: 12, width: 12}} xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none"><g clipPath="url(#clip0_44_2)"><path d="M29.0625 1.9375H23.25C23.25 0.864609 22.3835 0 21.3125 0H9.6875C8.61655 0 7.75 0.864609 7.75 1.9375H1.9375C0.866547 1.9375 0 2.80211 0 3.875V7.75C0 12.0299 3.47006 15.5 7.75 15.5C7.84106 15.5 7.92583 15.4753 8.01495 15.4714C8.711 18.198 10.8398 20.3307 13.5625 21.0364V27.125H9.6875C8.61655 27.125 7.75 27.9896 7.75 29.0625V31H23.25V29.0625C23.25 27.9896 22.3835 27.125 21.3125 27.125H17.4375V21.0364C20.1602 20.3307 22.289 18.1985 22.985 15.4719C23.0742 15.4753 23.1589 15.5 23.25 15.5C27.5299 15.5 31 12.0299 31 7.75V3.875C31 2.80211 30.1335 1.9375 29.0625 1.9375ZM3.875 7.75V5.8125H7.75V11.625C5.61003 11.625 3.875 9.88803 3.875 7.75ZM27.125 7.75C27.125 9.88803 25.39 11.625 23.25 11.625V5.8125H27.125V7.75Z" fill="#231F20"/><path d="M29.0625 1.9375H23.25C23.25 0.864609 22.3835 0 21.3125 0H9.6875C8.61655 0 7.75 0.864609 7.75 1.9375H1.9375C0.866547 1.9375 0 2.80211 0 3.875V7.75C0 12.0299 3.47006 15.5 7.75 15.5C7.84106 15.5 7.92583 15.4753 8.01495 15.4714C8.711 18.198 10.8398 20.3307 13.5625 21.0364V27.125H9.6875C8.61655 27.125 7.75 27.9896 7.75 29.0625V31H23.25V29.0625C23.25 27.9896 22.3835 27.125 21.3125 27.125H17.4375V21.0364C20.1602 20.3307 22.289 18.1985 22.985 15.4719C23.0742 15.4753 23.1589 15.5 23.25 15.5C27.5299 15.5 31 12.0299 31 7.75V3.875C31 2.80211 30.1335 1.9375 29.0625 1.9375ZM3.875 7.75V5.8125H7.75V11.625C5.61003 11.625 3.875 9.88803 3.875 7.75ZM27.125 7.75C27.125 9.88803 25.39 11.625 23.25 11.625V5.8125H27.125V7.75Z" fill="url(#paint0_linear_44_2)"/></g><defs><linearGradient id="paint0_linear_44_2" x1="15.5" y1="0" x2="15.5" y2="31" gradientUnits="userSpaceOnUse"><stop stopColor="#F8E081"/><stop offset="1" stopColor="#CBAC36"/></linearGradient><clipPath id="clip0_44_2"><rect width="31" height="31" fill="white"/></clipPath></defs></svg>$1,000 Leaderboard</motion.div>
              <motion.div whileTap={{ scale: 0.97 }} className={classes.text} onClick={() => setOpenAffiliates(!openAffiliates)}>Affiliates</motion.div>
              <motion.div whileTap={{ scale: 0.97 }} className={classes.text} onClick={() => { history.push(`/provably-fair`) }}>Fairness</motion.div>
              <motion.div whileTap={{ scale: 0.97 }} className={classes.text} onClick={() => setOpenSupport(!openSupport)}>Support</motion.div>
              <motion.div whileTap={{ scale: 0.97 }} className={classes.text} onClick={() => setOpenTerms(!openTerms)}>TOS</motion.div>
              {isAuthenticated && user && user.rank == 5 ? <motion.div whileTap={{ scale: 0.97 }} className={classes.text} onClick={() => setOpenAdmin(!openAdmin)}>Admin</motion.div> : ""}
            </div>
            <div style={{display: "flex", gap: "1rem"}}>
            <a href="https://twitter.com/FullsenddotGG" target="_blank" rel="noreferrer"><motion.div whileTap={{ scale: 0.97 }} className={classes.text}><svg style={{height: 14, width: 14}} xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none"><path d="M20 0.00896646C19.1294 0.611275 18.1656 1.07195 17.1455 1.37324C16.5979 0.755757 15.8703 0.318104 15.0609 0.119469C14.2516 -0.0791667 13.3995 -0.0292013 12.6201 0.262607C11.8406 0.554416 11.1713 1.07399 10.7027 1.75105C10.2341 2.42812 9.98882 3.23001 10 4.04827V4.93995C8.40239 4.98058 6.81934 4.63305 5.39183 3.92829C3.96431 3.22354 2.73665 2.18345 1.81818 0.900645C1.81818 0.900645 -1.81818 8.92575 6.36364 12.4925C4.49139 13.739 2.26105 14.364 0 14.2758C8.18182 18.7342 18.1818 14.2758 18.1818 4.02152C18.181 3.77315 18.1566 3.52539 18.1091 3.28143C19.0369 2.38395 19.6917 1.25082 20 0.00896646Z" fill="currentColor"/></svg></motion.div></a>
              <a href="https://discord.gg/j82fApKDRb" target="_blank" rel="noreferrer"><motion.div whileTap={{ scale: 0.97 }} className={classes.text}><svg style={{height: 14, width: 14}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20.317 4.37579C18.7873 3.67391 17.147 3.15679 15.4319 2.86062C15.4007 2.8549 15.3695 2.86919 15.3534 2.89776C15.1424 3.27297 14.9087 3.76247 14.7451 4.14721C12.9004 3.87104 11.0652 3.87104 9.25832 4.14721C9.09465 3.75392 8.85248 3.27297 8.64057 2.89776C8.62449 2.87014 8.59328 2.85585 8.56205 2.86062C6.84791 3.15584 5.20756 3.67296 3.67693 4.37579C3.66368 4.3815 3.65233 4.39103 3.64479 4.40341C0.533392 9.05177 -0.31895 13.5859 0.0991801 18.0638C0.101072 18.0857 0.11337 18.1066 0.130398 18.1199C2.18321 19.6275 4.17171 20.5427 6.12328 21.1493C6.15451 21.1589 6.18761 21.1474 6.20748 21.1217C6.66913 20.4913 7.08064 19.8265 7.43348 19.1275C7.4543 19.0866 7.43442 19.038 7.39186 19.0218C6.73913 18.7742 6.1176 18.4723 5.51973 18.1295C5.47244 18.1019 5.46865 18.0342 5.51216 18.0018C5.63797 17.9076 5.76382 17.8095 5.88396 17.7104C5.90569 17.6923 5.93598 17.6885 5.96153 17.6999C9.88928 19.4932 14.1415 19.4932 18.023 17.6999C18.0485 17.6876 18.0788 17.6914 18.1015 17.7095C18.2216 17.8085 18.3475 17.9076 18.4742 18.0018C18.5177 18.0342 18.5149 18.1019 18.4676 18.1295C17.8697 18.479 17.2482 18.7742 16.5945 19.0209C16.552 19.0371 16.533 19.0866 16.5538 19.1275C16.9143 19.8256 17.3258 20.4903 17.7789 21.1208C17.7978 21.1474 17.8319 21.1589 17.8631 21.1493C19.8241 20.5427 21.8126 19.6275 23.8654 18.1199C23.8834 18.1066 23.8948 18.0866 23.8967 18.0647C24.3971 12.8878 23.0585 8.39085 20.3482 4.40435C20.3416 4.39103 20.3303 4.3815 20.317 4.37579ZM8.02002 15.3372C6.8375 15.3372 5.86313 14.2516 5.86313 12.9183C5.86313 11.585 6.8186 10.4993 8.02002 10.4993C9.23087 10.4993 10.1958 11.5945 10.1769 12.9183C10.1769 14.2516 9.22141 15.3372 8.02002 15.3372ZM15.9947 15.3372C14.8123 15.3372 13.8379 14.2516 13.8379 12.9183C13.8379 11.585 14.7933 10.4993 15.9947 10.4993C17.2056 10.4993 18.1705 11.5945 18.1516 12.9183C18.1516 14.2516 17.2056 15.3372 15.9947 15.3372Z" fill="currentColor"/></svg></motion.div></a>
              <motion.div whileTap={{ scale: 0.97 }} className={classes.text} style={{color: "rgb(58, 137, 235)"}} onClick={() => setOpenFree(!openFree)}><svg style={{height: 12, width: 12}} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 512 512" ><g ><path fill="currentColor" d="M416 311.4c57.3-11.1 96-31.7 96-55.4v-42.7c-23.2 16.4-57.3 27.6-96 34.5zm-4.7-95.1c60-10.8 100.7-32 100.7-56.3v-42.7c-35.5 25.1-96.5 38.6-160.7 41.8 29.5 14.3 51.2 33.5 60 57.2zM512 64c0-35.3-86-64-192-64S128 28.7 128 64s86 64 192 64 192-28.7 192-64z" ></path><path data-v-efc4949e="" fill="currentColor" d="M192 320c106 0 192-35.8 192-80s-86-80-192-80S0 195.8 0 240s86 80 192 80zM0 405.3V448c0 35.3 86 64 192 64s192-28.7 192-64v-42.7C342.7 434.4 267.2 448 192 448S41.3 434.4 0 405.3zm0-104.9V352c0 35.3 86 64 192 64s192-28.7 192-64v-51.6c-41.3 34-116.9 51.6-192 51.6S41.3 334.4 0 300.4z"></path></g></svg>Free Coins</motion.div>
              {isAuthenticated && user ? <motion.div whileTap={{ scale: 0.97 }} className={classes.text} style={{color: "#FF4040"}} /* rgb(255, 64, 64) */ onClick={() => logout()}><svg style={{height: 12, width: 12}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" ><path fill="currentColor" d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z"></path></svg>Log Out</motion.div> : ""}
            </div>
          </div>

          <div className={classes.bottom}>
            <div className={classes.navContainer}>
              
              <motion.div style={{borderBottomLeftRadius: openGames ? 0 : "0.25rem", borderBottomRightRadius: openGames ? 0 : "0.25rem"}} className={classes.game} onClick={() => setOpenGames(!openGames)} >
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none"><g clipPath="url(#clip0_329_3739)"><path d="M16.695 5.77495C16.065 4.72495 14.91 4.19995 13.65 4.19995H7.35C6.09 4.19995 4.935 4.72495 4.305 5.77495C1.89 9.44995 1.365 15.0149 3.045 16.1699C4.725 17.3249 8.505 12.2849 10.5 12.2849C12.495 12.2849 16.17 17.3249 17.955 16.1699C19.635 15.0149 19.11 9.44995 16.695 5.77495ZM8.4 9.44995H7.35V10.5H6.3V9.44995H5.25V8.39995H6.3V7.34995H7.35V8.39995H8.4V9.44995ZM14.07 9.97495C14.07 10.5 13.65 10.9199 13.125 10.9199C12.6 10.9199 12.18 10.5 12.18 9.97495C12.18 9.44995 12.6 9.02995 13.125 9.02995C13.65 9.02995 14.07 9.44995 14.07 9.97495ZM16.065 7.87495C16.065 8.39995 15.645 8.81995 15.12 8.81995C14.595 8.81995 14.175 8.39995 14.175 7.87495C14.175 7.34995 14.595 6.92995 15.12 6.92995C15.645 6.92995 16.065 7.34995 16.065 7.87495Z" fill="hsl(215, 75%, 50%)"/></g><defs><clipPath id="clip0_329_3739"><rect width="21" height="21" fill="white"/></clipPath></defs></svg>
                Games
                <motion.svg style={{ rotate: openGames ? 180 : 0 }} className={classes.arrowSvg} xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="#fff"><path fillRule="evenodd" clipRule="evenodd" d="M0.190004 3.16291C-0.0633291 3.42609 -0.0633292 3.85222 0.190004 4.11474L5.56132 9.68068C6.06864 10.2064 6.89164 10.2064 7.39896 9.68068L12.8099 4.07443C13.0606 3.81394 13.0639 3.39312 12.8164 3.12927C12.5637 2.85935 12.1473 2.85677 11.8908 3.12197L6.93972 8.25309C6.68573 8.51628 6.27455 8.51628 6.02057 8.25309L1.1085 3.16291C0.855167 2.89972 0.443337 2.89972 0.190004 3.16291Z" fill="currentColor"/></motion.svg>
                <motion.div
                  className={classes.subMenu}
                  initial="exit"
                  animate={openGames ? "enter" : "exit"}
                  variants={subMenuAnimate}
                  ref={gameMenuRef}
                >
                  <div style={{border: "1px solid rgb(31, 29, 60)"}} />
                  <motion.div whileHover={{x: 10}} className={classes.gameButton} onClick={() => { history.push(`/battles`) }}>
                    <svg className={classes.buttonIconGame} fill="currentColor" viewBox="0 0 512.001 512.001" xmlns="http://www.w3.org/2000/svg" width="24" height="24" ><g><path d="m59.603 384.898h45v90h-45z" transform="matrix(.707 -.707 .707 .707 -279.94 183.975)"></path><path  d="m13.16 498.841c17.547 17.545 46.093 17.545 63.64 0l-63.64-63.64c-17.547 17.547-17.547 46.093 0 63.64z"></path><path  d="m384.898 407.398h90v45h-90z" transform="matrix(.707 -.707 .707 .707 -178.07 429.898)"></path><path d="m435.201 498.841c17.547 17.545 46.093 17.545 63.64 0 17.547-17.547 17.547-46.093 0-63.64z"></path><path d="m424.595 360.955-21.213-21.215 31.818-31.818c5.863-5.863 5.863-15.352 0-21.215-5.863-5.861-15.35-5.861-21.213 0l-127.278 127.28c-5.863 5.863-5.863 15.35 0 21.213 5.861 5.863 15.35 5.863 21.213 0l31.82-31.82 21.213 21.213z"></path><path d="m128.722 277.214-19.102 19.102-10.607-10.607c-5.863-5.861-15.35-5.861-21.213 0-5.863 5.863-5.863 15.352 0 21.215l31.82 31.818-22.215 22.215 63.64 63.638 22.213-22.213 31.82 31.82c5.863 5.863 15.352 5.863 21.213 0 5.863-5.863 5.863-15.35 0-21.213l-10.605-10.607 19.102-19.102z"></path><path  d="m497.002.001h-84.853c-3.977 0-7.789 1.575-10.607 4.391l-124.329 124.33 106.066 106.066 124.329-124.331c2.818-2.816 4.393-6.628 4.393-10.605v-84.853c-.001-8.287-6.713-14.998-14.999-14.998z"></path><path d="m110.459 4.392c-2.818-2.816-6.63-4.391-10.607-4.391h-84.853c-8.286 0-14.999 6.711-14.999 14.998v84.853c0 3.977 1.575 7.789 4.393 10.605l271.711 271.713 106.066-106.066z"></path></g></svg>
                    <div>
                      <div style={{color: "#fff"}}>Case Battles</div>
                      <div style={{fontSize: 10}}>PVP Case Opening</div>
                    </div>
                  </motion.div>
                  <div style={{border: "1px solid rgb(31, 29, 60)"}} />
                  <motion.div whileHover={{x: 10}} className={classes.gameButton} onClick={() => { history.push(`/slots`) }}>
                  <svg className={classes.buttonIconGame} xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 32 32" fill="currentColor"><path d="M29.8,6.2l-3-3.9C26.5,2,26,1.9,25.6,2.1l-1.2,0.6c-2.9,1.4-6.1,1.7-9.2,0.8c-1.3-0.4-2.7-0.5-4-0.5H5C4.4,3,4,3.4,4,4v11.6
	c0,0.6,0.4,1,1,1h4c0.6,0,1-0.4,1-1c0-1.6,1.3-2.9,3-2.9h2.9l-1.5,1.8c-3.5,4.2-6,9-7.4,14.3C7,29,7,29.4,7.2,29.6S7.7,30,8,30h13
	c0.6,0,1-0.4,1-1c0-5.5,1.5-10.9,4.3-15.7l3.5-6C30.1,7,30,6.6,29.8,6.2z"/></svg>
                    <div>
                      <div style={{color: "#fff"}}>Slots</div>
                      <div style={{fontSize: 10}}>Pragmatic Play</div>
                    </div>
                  </motion.div>
                  <div style={{border: "1px solid rgb(31, 29, 60)"}} />
                  <motion.div whileHover={{x: 10}} className={classes.gameButton} onClick={() => { history.push(`/upgrader`) }}>
                    <svg className={classes.buttonIconGame} xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 512 512" fill="currentColor"><path d="M256 29.816l-231 154v106.368l231-154 231 154V183.816zm0 128.043L105 259.783v90.283l151-101.925 151 101.925v-90.283zm0 112l-87 58.725v67.6l87-58 87 58v-67.6zm0 89.957l-87 58v64.368l87-58 87 58v-64.368z"/></svg>
                    <div>
                      <div style={{color: "#fff"}}>Upgrader</div>
                      <div style={{fontSize: 10}}>Upgrade your balance</div>
                    </div>
                  </motion.div>
                  <div style={{border: "1px solid rgb(31, 29, 60)"}} />
                  <motion.div whileHover={{x: 10}} className={classes.gameButton} onClick={() => { history.push(`/limbo`) }}>
                    <svg className={classes.buttonIconGame} xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 512 512" fill="currentColor"><path d="M500.686,11.321c-8.724-8.725-21.08-12.757-33.271-10.858l-78.402,12.234
		c-32.827,5.129-63.164,20.558-86.665,44.042l-67.5,67.483l-24.129,24.137l-28.003,28.012l-13.958-13.967l21.672-21.664
		l-45.14-16.918c-21.376-8.02-45.462-2.804-61.605,13.339L6.571,214.265c-5.564,5.564-7.802,13.61-5.912,21.22
		c1.881,7.601,7.619,13.697,15.125,16.013l81.834,25.33l137.544,137.569l25.338,81.825c2.307,7.515,8.403,13.226,16.022,15.116
		c7.602,1.889,15.656-0.34,21.212-5.904l77.096-77.114c16.144-16.143,21.36-40.22,13.358-61.605l-16.928-45.132l-21.664,21.664
		l-13.967-13.967l28.012-28.021l24.12-24.119l67.5-67.492c23.502-23.501,38.923-53.856,44.034-86.674l12.242-78.394
		C513.442,32.392,509.412,20.037,500.686,11.321z M398.443,194.552c-22.369,22.37-58.636,22.37-80.997,0
		c-22.37-22.361-22.37-58.628-0.009-81.006c22.37-22.379,58.637-22.361,81.006,0.009
		C420.804,135.925,420.812,172.174,398.443,194.552z"/></svg>
                    <div>
                      <div style={{color: "#fff"}}>Limbo</div>
                      <div style={{fontSize: 10}}>Reach to moon</div>
                    </div>
                  </motion.div>
                  <motion.div whileHover={{x: 10}} className={classes.gameButton} onClick={() => { history.push(`/mines`) }}>
                    <svg className={classes.buttonIconGame} xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 128 128" fill="currentColor"><path d="M 60.375 6.53125 C 59.227574 6.53125 58.3125 7.4463238 58.3125 8.59375 L 58.3125 18.8125 C 50.001587 19.848917 42.388944 23.143974 36.09375 28.03125 L 28.84375 20.78125 C 28.032397 19.969897 26.748853 19.969897 25.9375 20.78125 L 20.78125 25.9375 C 19.969897 26.748853 19.969897 28.032397 20.78125 28.84375 L 28.03125 36.09375 C 23.143974 42.388944 19.848917 50.001587 18.8125 58.3125 L 8.59375 58.3125 C 7.4463238 58.3125 6.53125 59.227574 6.53125 60.375 L 6.53125 67.625 C 6.53125 68.772426 7.4463238 69.6875 8.59375 69.6875 L 18.8125 69.6875 C 19.849759 78.005162 23.134066 85.604772 28.03125 91.90625 L 20.78125 99.15625 C 19.969897 99.967603 19.969897 101.25115 20.78125 102.0625 L 25.9375 107.21875 C 26.748853 108.0301 28.032397 108.0301 28.84375 107.21875 L 36.09375 99.96875 C 42.395228 104.86593 49.994838 108.15024 58.3125 109.1875 L 58.3125 119.40625 C 58.3125 120.55368 59.227574 121.46875 60.375 121.46875 L 67.625 121.46875 C 68.772426 121.46875 69.6875 120.55368 69.6875 119.40625 L 69.6875 109.1875 C 77.998413 108.15108 85.611055 104.85603 91.90625 99.96875 L 99.15625 107.21875 C 99.967603 108.0301 101.25115 108.0301 102.0625 107.21875 L 107.21875 102.0625 C 108.0301 101.25115 108.0301 99.967603 107.21875 99.15625 L 99.96875 91.90625 C 104.85603 85.611055 108.15108 77.998413 109.1875 69.6875 L 119.40625 69.6875 C 120.55368 69.6875 121.46875 68.772426 121.46875 67.625 L 121.46875 60.375 C 121.46875 59.227574 120.55368 58.3125 119.40625 58.3125 L 109.1875 58.3125 C 108.15024 49.994838 104.86593 42.395228 99.96875 36.09375 L 107.21875 28.84375 C 108.0301 28.032397 108.0301 26.748853 107.21875 25.9375 L 102.0625 20.78125 C 101.25115 19.969897 99.967603 19.969897 99.15625 20.78125 L 91.90625 28.03125 C 85.604772 23.134066 78.005162 19.849759 69.6875 18.8125 L 69.6875 8.59375 C 69.6875 7.4463238 68.772426 6.53125 67.625 6.53125 L 60.375 6.53125 z"/></svg>
                    <div>
                      <div style={{color: "#fff"}}>Mines</div>
                      <div style={{fontSize: 10}}>Don't touch the bomb</div>
                    </div>
                  </motion.div>
                  
                  <motion.div whileHover={{x: 10}} className={classes.gameButton} onClick={() => { history.push(`/dice`) }}>
                    <svg className={classes.buttonIconGame} xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 512 512" fill="currentColor"><path d="M454.608,111.204L280.557,6.804C272.992,2.268,264.504,0,256,0c-8.507,0-16.996,2.268-24.557,6.797
		L57.392,111.204c-5.346,3.203-9.916,7.37-13.555,12.192l207.902,124.707c2.622,1.575,5.896,1.575,8.518,0L468.16,123.396
		C464.521,118.574,459.955,114.407,454.608,111.204z M177.16,131.738c-12.056,8.371-31.302,8.16-42.984-0.49
		c-11.684-8.65-11.382-22.463,0.678-30.842c12.056-8.386,31.304-8.16,42.992,0.482C189.525,109.539,189.22,123.344,177.16,131.738z
		 M376.303,134.126c-12.056,8.38-31.306,8.16-42.992-0.49c-11.68-8.65-11.378-22.462,0.685-30.841
		c12.053-8.38,31.302-8.168,42.985,0.482C388.664,111.928,388.359,125.732,376.303,134.126z"/>
	<path class="st0" d="M246.136,258.366L38.004,133.523c-2.457,5.802-3.794,12.116-3.794,18.62v208.084
		c0,16.773,8.801,32.311,23.182,40.946l174.051,104.392c5.828,3.496,12.203,5.629,18.714,6.435V265.464
		C250.156,262.556,248.631,259.858,246.136,258.366z M75.845,369.736c-12.052-6.571-21.829-21.671-21.829-33.728
		c0-12.056,9.777-16.502,21.829-9.931c12.056,6.57,21.826,21.671,21.826,33.728C97.671,371.861,87.902,376.306,75.845,369.736z
		 M75.845,247.869c-12.052-6.578-21.829-21.678-21.829-33.728c0-12.056,9.777-16.501,21.829-9.931
		c12.056,6.571,21.826,21.671,21.826,33.728C97.671,249.986,87.902,254.44,75.845,247.869z M136.779,342.014
		c-12.056-6.571-21.826-21.671-21.826-33.728s9.769-16.502,21.826-9.931c12.056,6.571,21.829,21.671,21.829,33.728
		C158.608,344.131,148.835,348.585,136.779,342.014z M197.716,436.158c-12.056-6.571-21.83-21.671-21.83-33.727
		c0-12.049,9.773-16.495,21.83-9.924c12.056,6.57,21.826,21.67,21.826,33.72C219.541,438.284,209.772,442.729,197.716,436.158z
		 M197.716,314.292c-12.056-6.57-21.83-21.671-21.83-33.727c0-12.056,9.773-16.502,21.83-9.931
		c12.056,6.571,21.826,21.671,21.826,33.727C219.541,316.417,209.772,320.863,197.716,314.292z"/>
	<path class="st0" d="M473.992,133.523L265.864,258.366c-2.494,1.492-4.02,4.19-4.02,7.098V512
		c6.506-0.806,12.889-2.939,18.714-6.435l174.051-104.392c14.381-8.635,23.182-24.172,23.182-40.946V152.143
		C477.79,145.64,476.453,139.326,473.992,133.523z M321.232,262.932c12.053-6.571,21.826-2.125,21.826,9.931
		c0,12.049-9.773,27.149-21.826,33.72c-12.06,6.571-21.83,2.125-21.83-9.924C299.402,284.604,309.172,269.503,321.232,262.932z
		 M321.232,448.735c-12.06,6.57-21.83,2.125-21.83-9.931s9.77-27.15,21.83-33.728c12.053-6.571,21.826-2.118,21.826,9.931
		C343.058,427.064,333.285,442.164,321.232,448.735z M322.536,377.663c-12.056,6.571-21.83,2.117-21.83-9.939
		c0-12.048,9.773-27.149,21.83-33.72c12.056-6.57,21.826-2.125,21.826,9.931S334.592,371.085,322.536,377.663z M427.32,386.403
		c-12.056,6.571-21.826,2.125-21.826-9.931c0-12.056,9.769-27.156,21.826-33.72c12.056-6.578,21.829-2.133,21.829,9.924
		C449.149,364.732,439.376,379.833,427.32,386.403z M427.32,315.332c-12.056,6.563-21.826,2.125-21.826-9.931
		c0-12.056,9.769-27.157,21.826-33.728c12.056-6.571,21.829-2.125,21.829,9.931C449.149,293.653,439.376,308.761,427.32,315.332z
		 M427.32,244.253c-12.056,6.57-21.826,2.125-21.826-9.924c0-12.056,9.769-27.157,21.826-33.728
		c12.056-6.571,21.829-2.125,21.829,9.931C449.149,222.582,439.376,237.682,427.32,244.253z"/></svg>
                    <div>
                      <div style={{color: "#fff"}}>Dice</div>
                      <div style={{fontSize: 10}}>Roll the Dice</div>
                    </div>
                  </motion.div>
                  <div style={{border: "1px solid rgb(31, 29, 60)"}} />
                  <motion.div whileHover={{x: 10}} className={classes.gameButton} onClick={() => { history.push(`/cases`) }}>
                    <svg className={classes.buttonIconGame} xmlns="http://www.w3.org/2000/svg" width="300.000000pt" height="300.000000pt" viewBox="0 0 300.000000 300.000000"><g transform="translate(0.000000,300.000000) scale(0.100000,-0.100000)"><path d="M454 2605 c-169 -37 -304 -159 -354 -322 -18 -60 -20 -93 -20 -419 l0 -354 240 0 240 0 -2 553 c-3 632 9 567 -104 542z"></path><path d="M710 2065 l0 -555 235 0 235 0 0 120 c0 125 11 171 45 184 9 3 133 6 275 6 328 0 304 14 308 -174 l4 -136 234 0 234 0 0 555 0 555 -785 0 -785 0 0 -555z"></path><path d="M2437 2613 c-4 -3 -7 -253 -7 -555 l0 -548 240 0 240 0 0 354 c0 326 -2 359 -20 419 -38 121 -123 223 -235 280 -70 35 -203 66 -218 50z"></path><path d="M1443 1646 l-28 -24 -3 -164 c-2 -101 1 -177 8 -200 19 -66 93 -85 137 -36 16 18 18 40 18 210 l0 190 -28 24 c-36 30 -68 30 -104 0z"></path><path d="M80 937 c0 -423 0 -424 23 -457 49 -73 57 -75 265 -75 l187 0 0 475 0 475 -237 3 -238 2 0 -423z"></path><path d="M710 880 l0 -480 785 0 785 0 0 480 0 480 -235 0 -235 0 0 -119 c0 -123 -8 -165 -38 -187 -23 -18 -509 -20 -546 -3 -36 17 -46 57 -46 190 l0 119 -235 0 -235 0 0 -480z"></path><path d="M2437 1353 c-4 -3 -7 -220 -7 -480 l0 -475 183 4 c203 3 229 11 274 78 23 33 23 34 23 456 l0 424 -233 0 c-129 0 -237 -3 -240 -7z"></path></g></svg>
                    <div>
                      <div style={{color: "#fff"}}>Cases</div>
                      <div style={{fontSize: 10}}>Unbox Items</div>
                    </div>
                  </motion.div>
                  <div style={{border: "1px solid rgb(31, 29, 60)"}} />
                  <motion.div whileHover={{x: 10}} className={classes.gameButton} onClick={() => { history.push(`/roulette`) }}>
                    <svg className={classes.buttonIconGame} xmlns="http://www.w3.org/2000/svg" width="30px" height="24px" viewBox="0 0 24 24" ><g id="surface1"><path d="M 2.613281 22.402344 C 2.847656 23.34375 3.691406 24 4.660156 24 L 19.339844 24 C 20.308594 24 21.152344 23.34375 21.386719 22.402344 L 22.042969 19.78125 L 1.957031 19.78125 Z M 2.613281 22.402344 "></path><path d="M 0 14.15625 L 24 14.15625 L 24 18.375 L 0 18.375 Z M 0 14.15625 "></path><path d="M 6.375 8.4375 C 7.292969 8.4375 8.074219 7.851562 8.363281 7.03125 L 10.75 7.03125 L 10.121094 12.75 L 13.878906 12.75 L 13.25 7.03125 L 15.636719 7.03125 C 15.925781 7.851562 16.707031 8.4375 17.625 8.4375 C 18.785156 8.4375 19.734375 7.488281 19.734375 6.328125 C 19.734375 5.167969 18.785156 4.21875 17.625 4.21875 C 16.707031 4.21875 15.925781 4.804688 15.636719 5.625 L 13.09375 5.625 L 12.917969 4.007812 C 13.625 3.667969 14.109375 2.941406 14.109375 2.109375 C 14.109375 0.949219 13.160156 0 12 0 C 10.839844 0 9.890625 0.949219 9.890625 2.109375 C 9.890625 2.941406 10.375 3.667969 11.082031 4.007812 L 10.90625 5.625 L 8.363281 5.625 C 8.074219 4.804688 7.292969 4.21875 6.375 4.21875 C 5.214844 4.21875 4.265625 5.167969 4.265625 6.328125 C 4.265625 7.488281 5.214844 8.4375 6.375 8.4375 Z M 6.375 8.4375 "></path></g></svg> 
                    <div>
                      <div style={{color: "#fff"}}>Roulette</div>
                      <div style={{fontSize: 10}}>Simple as it gets</div>
                    </div>
                  </motion.div>
                  <div style={{border: "1px solid rgb(31, 29, 60)"}} />
                  <motion.div whileHover={{x: 10}} className={classes.gameButton} onClick={() => { history.push(`/crash`) }}>
                    <svg className={classes.buttonIconGame} xmlns="http://www.w3.org/2000/svg" width="22" viewBox="0 -3 16 16" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M12.5858 2H10C9.4477 2 9 1.55228 9 1C9 0.44772 9.4477 0 10 0H15C15.5523 0 16 0.44772 16 1V6C16 6.5523 15.5523 7 15 7C14.4477 7 14 6.5523 14 6V3.4142L9.7071 7.7071C9.3166 8.0976 8.6834 8.0976 8.2929 7.7071L6 5.4142L1.70711 9.7071C1.31658 10.0976 0.68342 10.0976 0.29289 9.7071C-0.09763 9.3166 -0.09763 8.6834 0.29289 8.2929L5.29289 3.2929C5.68342 2.90237 6.3166 2.90237 6.7071 3.2929L9 5.5858L12.5858 2z" fill="currnetColor"></path></svg>
                    <div>
                      <div style={{color: "#fff"}}>Crash</div>
                      <div style={{fontSize: 10}}>Ride the multiplier</div>
                    </div>
                  </motion.div>
                </motion.div>
                
              </motion.div>      
            </div>

            {isAuthenticated && user ? (
            <div className={classes.balanceContainer}>
              <div className={classes.balance}>
                <img style={{height: 15, width: 15}} src={coin} />
                <CountUp
                  delay={0}
                  duration={1}
                  decimals={2}
                  start={previousTotal}
                  end={currentTotal}
                />
              </div>
              <motion.div whileHover={{ opacity: 0.95 }} whileTap={{ scale: 0.97 }} className={classes.cashier} onClick={() => setOpenCashier(!openCashier)}>
                <svg style={{ height: 20, width: 20 }}  viewBox="0 0 14 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg" ><path d="M13.125 10.5029V11.5967C13.125 12.2 12.6341 12.6904 12.0312 12.6904H2.625C1.65987 12.6904 0.875 11.9056 0.875 10.9404C0.875 10.9404 0.875 3.50949 0.875 3.50293C0.875 2.5378 1.65987 1.75293 2.625 1.75293H10.7188C11.0814 1.75293 11.375 2.04693 11.375 2.40918C11.375 2.77143 11.0814 3.06543 10.7188 3.06543H2.625C2.38394 3.06543 2.1875 3.26143 2.1875 3.50293C2.1875 3.74443 2.38394 3.94043 2.625 3.94043H12.0312C12.6341 3.94043 13.125 4.43087 13.125 5.03418V6.12793H10.9375C9.73131 6.12793 8.75 7.10924 8.75 8.31543C8.75 9.52162 9.73131 10.5029 10.9375 10.5029H13.125Z"></path><path d="M13.125 7.00293V9.62793H10.9375C10.2126 9.62793 9.625 9.04037 9.625 8.31543C9.625 7.59049 10.2126 7.00293 10.9375 7.00293H13.125Z"></path></svg>
                Cashier
              </motion.div>
            </div>
            ) : ""}

            <div style={{ display: "flex", gap: "0.75rem"}}>
              {isAuthenticated && user ? (
                <>
                  {loading ? (
                    <Skeleton height={45} width={240} animation="wave" variant="rect" />
                  ) : (
                    <motion.div style={{borderBottomLeftRadius: openProfile ? 0 : "0.25rem", borderBottomRightRadius: openProfile ? 0 : "0.25rem"}} className={classes.userContainer} onClick={() => setOpenProfile(!openProfile)}>
                      <img className={classes.avatar} src={user.avatar} />
                      <div style={{width: "100%"}}>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                          <div className={classes.username}>{user.username}</div>
                          <div className={classes.levelBox}>{vipData.currentLevel.name}</div>
                        </div>
                        <ProgressBar
                          variant="success"
                          animated
                          className={classes.progress}
                          min={vipData.currentLevel.wagerNeeded}
                          max={vipData.nextLevel.wagerNeeded}
                          now={vipData.wager}
                        />
                      </div>
                      <motion.div
                        className={classes.profileMenu}
                        initial="exit"
                        animate={openProfile ? "enter" : "exit"}
                        variants={profileMenuAnimate}
                        ref={profileMenuRef}
                      >
                        <div style={{border: "1px solid rgb(31, 29, 60)"}} />
                        <motion.div whileHover={{x: 10}} className={classes.profileButton} onClick={() => { history.push(`/profile`) }}>
                          <svg className={classes.buttonIconProfile} xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="6" r="4"/><path d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z"/></svg>                        
                          <div style={{color: "#fff"}}>Profile</div>
                        </motion.div>
                        <div style={{border: "1px solid rgb(31, 29, 60)"}} />
                        <motion.div whileHover={{x: 10}} className={classes.profileButton} onClick={() => setOpenRewards(!openRewards)}>
                          <svg className={classes.buttonIconProfile} fill="currentColor" tabIndex="-1" viewBox="0 0 512 512"><path d="M32 448c0 17.7 14.3 32 32 32h160V320H32v128zm256 32h160c17.7 0 32-14.3 32-32V320H288v160zm192-320h-42.1c6.2-12.1 10.1-25.5 10.1-40 0-48.5-39.5-88-88-88-41.6 0-68.5 21.3-103 68.3-34.5-47-61.4-68.3-103-68.3-48.5 0-88 39.5-88 88 0 14.5 3.8 27.9 10.1 40H32c-17.7 0-32 14.3-32 32v80c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16v-80c0-17.7-14.3-32-32-32zm-326.1 0c-22.1 0-40-17.9-40-40s17.9-40 40-40c19.9 0 34.6 3.3 86.1 80h-86.1zm206.1 0h-86.1c51.4-76.5 65.7-80 86.1-80 22.1 0 40 17.9 40 40s-17.9 40-40 40z"></path></svg>
                          <div style={{color: "#fff"}}>Rewards</div>
                        </motion.div>
                        <div style={{border: "1px solid rgb(31, 29, 60)"}} />
                        <motion.div whileHover={{x: 10}} className={classes.profileButton} onClick={() => setOpenCoupon(!openCoupon)}>
                          <svg className={classes.buttonIconProfile} xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" id="coupon" fill="currentColor" ><path d="M20,4H14V6.5a1,1,0,0,1-2,0V4H4A2,2,0,0,0,2,6V9a1,1,0,0,0,1,1,2,2,0,0,1,0,4,1,1,0,0,0-1,1v3a2,2,0,0,0,2,2h8V17.5a1,1,0,0,1,2,0V20h6a2,2,0,0,0,2-2V6A2,2,0,0,0,20,4Zm-6,9.83a1,1,0,0,1-2,0V10.17a1,1,0,0,1,2,0Z"/></svg>
                          <div style={{color: "#fff"}}>Coupon</div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}     
                </>
              ) : (
                <motion.div whileTap={{ scale: 0.97}} className={classes.signin} onClick={() => setOpenLogin(!openLogin)}>
                  <svg className={classes.buttonIcon} tabIndex="-1" viewBox="0 0 512 512"><path d="M416 448h-84c-6.6 0-12-5.4-12-12v-24c0-6.6 5.4-12 12-12h84c26.5 0 48-21.5 48-48V160c0-26.5-21.5-48-48-48h-84c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h84c53 0 96 43 96 96v192c0 53-43 96-96 96zM167.1 83.5l-19.6 19.6c-4.8 4.8-4.7 12.5.2 17.1L260.8 230H12c-6.6 0-12 5.4-12 12v28c0 6.6 5.4 12 12 12h248.8L147.7 391.7c-4.8 4.7-4.9 12.4-.2 17.1l19.6 19.6c4.7 4.7 12.3 4.7 17 0l164.4-164c4.7-4.7 4.7-12.3 0-17l-164.4-164c-4.7-4.6-12.3-4.6-17 .1z"></path></svg>
                  Sign in   
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={classes.mobile}>
        <motion.div whileTap={{ scale: 0.97 }} className={classes.home} onClick={() => history.push(`/home`)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 17.5V11.3333C7.5 10.8666 7.5 10.6333 7.59083 10.455C7.67072 10.2982 7.79821 10.1707 7.95501 10.0908C8.13327 9.99999 8.36662 9.99999 8.83333 9.99999H11.1667C11.6334 9.99999 11.8667 9.99999 12.045 10.0908C12.2018 10.1707 12.3293 10.2982 12.4092 10.455C12.5 10.6333 12.5 10.8666 12.5 11.3333V17.5M9.18141 2.30333L3.52949 6.69927C3.15168 6.99312 2.96278 7.14005 2.82669 7.32405C2.70614 7.48704 2.61633 7.67065 2.56169 7.86588C2.5 8.08627 2.5 8.32558 2.5 8.80421V14.8333C2.5 15.7667 2.5 16.2335 2.68166 16.59C2.84144 16.9036 3.09641 17.1585 3.41002 17.3183C3.76654 17.5 4.23325 17.5 5.16667 17.5H14.8333C15.7668 17.5 16.2335 17.5 16.59 17.3183C16.9036 17.1585 17.1586 16.9036 17.3183 16.59C17.5 16.2335 17.5 15.7667 17.5 14.8333V8.80421C17.5 8.32558 17.5 8.08627 17.4383 7.86588C17.3837 7.67065 17.2939 7.48704 17.1733 7.32405C17.0372 7.14005 16.8483 6.99312 16.4705 6.69927L10.8186 2.30333C10.5258 2.07562 10.3794 1.96177 10.2178 1.918C10.0752 1.87938 9.92484 1.87938 9.78221 1.918C9.62057 1.96177 9.47418 2.07562 9.18141 2.30333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </motion.div>

        {isAuthenticated && user ? (
          <div className={classes.balanceContainer}>
            <div className={classes.balance}>
              <img style={{height: 15, width: 15}} src={coin} />
              <CountUp
                delay={0}
                duration={1}
                decimals={2}
                start={previousTotal}
                end={currentTotal}
              />
            </div>
            <motion.div whileHover={{ opacity: 0.95 }} whileTap={{ scale: 0.97 }} className={classes.cashier} onClick={() => setOpenCashier(!openCashier)}>
              <svg style={{ height: 20, width: 20 }}  viewBox="0 0 14 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg" ><path d="M13.125 10.5029V11.5967C13.125 12.2 12.6341 12.6904 12.0312 12.6904H2.625C1.65987 12.6904 0.875 11.9056 0.875 10.9404C0.875 10.9404 0.875 3.50949 0.875 3.50293C0.875 2.5378 1.65987 1.75293 2.625 1.75293H10.7188C11.0814 1.75293 11.375 2.04693 11.375 2.40918C11.375 2.77143 11.0814 3.06543 10.7188 3.06543H2.625C2.38394 3.06543 2.1875 3.26143 2.1875 3.50293C2.1875 3.74443 2.38394 3.94043 2.625 3.94043H12.0312C12.6341 3.94043 13.125 4.43087 13.125 5.03418V6.12793H10.9375C9.73131 6.12793 8.75 7.10924 8.75 8.31543C8.75 9.52162 9.73131 10.5029 10.9375 10.5029H13.125Z"></path><path d="M13.125 7.00293V9.62793H10.9375C10.2126 9.62793 9.625 9.04037 9.625 8.31543C9.625 7.59049 10.2126 7.00293 10.9375 7.00293H13.125Z"></path></svg>
            </motion.div>
          </div>
        ) : ""}

        <div style={{ display: "flex", gap: "0.75rem", width: "fit-content", maxWidth: "10rem"}}>
          {isAuthenticated && user ? (
            <>
              {loading ? (
                <Skeleton height={45} width={150  } animation="wave" variant="rect" />
              ) : (
                <motion.div style={{borderBottomLeftRadius: openProfileMobile ? 0 : "0.25rem", borderBottomRightRadius: openProfileMobile ? 0 : "0.25rem"}} className={classes.userContainer} onClick={() => setOpenProfileMobile(!openProfileMobile)}>
                  <img className={classes.avatar} src={user.avatar} />
                  <div style={{width: "100%"}}>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                      <div className={classes.username}>{user.username}</div>
                      <div className={classes.levelBox}>{vipData.currentLevel.name}</div>
                    </div>
                    <ProgressBar
                      variant="success"
                      animated
                      className={classes.progress}
                      min={vipData.currentLevel.wagerNeeded}
                      max={vipData.nextLevel.wagerNeeded}
                      now={vipData.wager}
                    />
                  </div>
                  <motion.div
                    className={classes.profileMenu}
                    initial="exit"
                    animate={openProfileMobile ? "enter" : "exit"}
                    variants={profileMenuAnimate}
                    ref={profileMenuRefModile}
                  >
                    <div style={{border: "1px solid rgb(31, 29, 60)"}} />
                    <motion.div whileHover={{x: 10}} className={classes.profileButton} onClick={() => { history.push(`/profile`) }}>
                      <svg className={classes.buttonIconProfile} xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="6" r="4"/><path d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z"/></svg>                        
                      <div style={{color: "#fff"}}>Profile</div>
                    </motion.div>
                    <div style={{border: "1px solid rgb(31, 29, 60)"}} />
                    <motion.div whileHover={{x: 10}} className={classes.profileButton} onClick={() => setOpenRewards(!openRewards)}>
                      <svg className={classes.buttonIconProfile} fill="currentColor" tabIndex="-1" viewBox="0 0 512 512"><path d="M32 448c0 17.7 14.3 32 32 32h160V320H32v128zm256 32h160c17.7 0 32-14.3 32-32V320H288v160zm192-320h-42.1c6.2-12.1 10.1-25.5 10.1-40 0-48.5-39.5-88-88-88-41.6 0-68.5 21.3-103 68.3-34.5-47-61.4-68.3-103-68.3-48.5 0-88 39.5-88 88 0 14.5 3.8 27.9 10.1 40H32c-17.7 0-32 14.3-32 32v80c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16v-80c0-17.7-14.3-32-32-32zm-326.1 0c-22.1 0-40-17.9-40-40s17.9-40 40-40c19.9 0 34.6 3.3 86.1 80h-86.1zm206.1 0h-86.1c51.4-76.5 65.7-80 86.1-80 22.1 0 40 17.9 40 40s-17.9 40-40 40z"></path></svg>
                      <div style={{color: "#fff"}}>Rewards</div>
                    </motion.div>
                    <div style={{border: "1px solid rgb(31, 29, 60)"}} />
                    <motion.div whileHover={{x: 10}} className={classes.profileButton} onClick={() => setOpenAffiliates(!openAffiliates)}>
                      <svg className={classes.buttonIconProfile} xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" fill="none"/><path fillRule="evenodd" clipRule="evenodd" d="M5 9.5C5 7.01472 7.01472 5 9.5 5C11.9853 5 14 7.01472 14 9.5C14 11.9853 11.9853 14 9.5 14C7.01472 14 5 11.9853 5 9.5Z" fill="currentColor"/><path d="M14.3675 12.0632C14.322 12.1494 14.3413 12.2569 14.4196 12.3149C15.0012 12.7454 15.7209 13 16.5 13C18.433 13 20 11.433 20 9.5C20 7.567 18.433 6 16.5 6C15.7209 6 15.0012 6.2546 14.4196 6.68513C14.3413 6.74313 14.322 6.85058 14.3675 6.93679C14.7714 7.70219 15 8.5744 15 9.5C15 10.4256 14.7714 11.2978 14.3675 12.0632Z" fill="currentColor"/><path fillRule="evenodd" clipRule="evenodd" d="M4.64115 15.6993C5.87351 15.1644 7.49045 15 9.49995 15C11.5112 15 13.1293 15.1647 14.3621 15.7008C15.705 16.2847 16.5212 17.2793 16.949 18.6836C17.1495 19.3418 16.6551 20 15.9738 20H3.02801C2.34589 20 1.85045 19.3408 2.05157 18.6814C2.47994 17.2769 3.29738 16.2826 4.64115 15.6993Z" fill="currentColor"/><path d="M14.8185 14.0364C14.4045 14.0621 14.3802 14.6183 14.7606 14.7837V14.7837C15.803 15.237 16.5879 15.9043 17.1508 16.756C17.6127 17.4549 18.33 18 19.1677 18H20.9483C21.6555 18 22.1715 17.2973 21.9227 16.6108C21.9084 16.5713 21.8935 16.5321 21.8781 16.4932C21.5357 15.6286 20.9488 14.9921 20.0798 14.5864C19.2639 14.2055 18.2425 14.0483 17.0392 14.0008L17.0194 14H16.9997C16.2909 14 15.5506 13.9909 14.8185 14.0364Z" fill="currentColor"/></svg>
                      <div style={{color: "#fff"}}>Affiliates</div>
                    </motion.div>
                    <div style={{border: "1px solid rgb(31, 29, 60)"}} />
                    <motion.div whileHover={{x: 10}} className={classes.profileButton} onClick={() => setOpenFree(!openFree)}>
                      <svg className={classes.buttonIconProfile} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 512 512"><g><path fill="currentColor" d="M416 311.4c57.3-11.1 96-31.7 96-55.4v-42.7c-23.2 16.4-57.3 27.6-96 34.5zm-4.7-95.1c60-10.8 100.7-32 100.7-56.3v-42.7c-35.5 25.1-96.5 38.6-160.7 41.8 29.5 14.3 51.2 33.5 60 57.2zM512 64c0-35.3-86-64-192-64S128 28.7 128 64s86 64 192 64 192-28.7 192-64z"></path><path fill="currentColor" d="M192 320c106 0 192-35.8 192-80s-86-80-192-80S0 195.8 0 240s86 80 192 80zM0 405.3V448c0 35.3 86 64 192 64s192-28.7 192-64v-42.7C342.7 434.4 267.2 448 192 448S41.3 434.4 0 405.3zm0-104.9V352c0 35.3 86 64 192 64s192-28.7 192-64v-51.6c-41.3 34-116.9 51.6-192 51.6S41.3 334.4 0 300.4z"></path></g></svg>
                      <div style={{color: "#fff"}}>Free Coins</div>
                    </motion.div>
                    <div style={{border: "1px solid rgb(31, 29, 60)"}} />
                    <motion.div whileHover={{x: 10}} className={classes.profileButton} onClick={() => setOpenCoupon(!openCoupon)}>
                      <svg className={classes.buttonIconProfile} xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" id="coupon" fill="currentColor" ><path d="M20,4H14V6.5a1,1,0,0,1-2,0V4H4A2,2,0,0,0,2,6V9a1,1,0,0,0,1,1,2,2,0,0,1,0,4,1,1,0,0,0-1,1v3a2,2,0,0,0,2,2h8V17.5a1,1,0,0,1,2,0V20h6a2,2,0,0,0,2-2V6A2,2,0,0,0,20,4Zm-6,9.83a1,1,0,0,1-2,0V10.17a1,1,0,0,1,2,0Z"/></svg>
                      <div style={{color: "#fff"}}>Coupon</div>
                    </motion.div>
                    <div style={{border: "1px solid rgb(31, 29, 60)"}} />
                    <motion.div whileHover={{x: 10}} className={classes.profileButton} onClick={() => { history.push(`/leaderboard`) }}>
                      <svg className={classes.buttonIconProfile} style={{color: "rgb(227, 200, 94)"}} xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="currentColor"><g clipPath="url(#clip0_44_2)"><path d="M29.0625 1.9375H23.25C23.25 0.864609 22.3835 0 21.3125 0H9.6875C8.61655 0 7.75 0.864609 7.75 1.9375H1.9375C0.866547 1.9375 0 2.80211 0 3.875V7.75C0 12.0299 3.47006 15.5 7.75 15.5C7.84106 15.5 7.92583 15.4753 8.01495 15.4714C8.711 18.198 10.8398 20.3307 13.5625 21.0364V27.125H9.6875C8.61655 27.125 7.75 27.9896 7.75 29.0625V31H23.25V29.0625C23.25 27.9896 22.3835 27.125 21.3125 27.125H17.4375V21.0364C20.1602 20.3307 22.289 18.1985 22.985 15.4719C23.0742 15.4753 23.1589 15.5 23.25 15.5C27.5299 15.5 31 12.0299 31 7.75V3.875C31 2.80211 30.1335 1.9375 29.0625 1.9375ZM3.875 7.75V5.8125H7.75V11.625C5.61003 11.625 3.875 9.88803 3.875 7.75ZM27.125 7.75C27.125 9.88803 25.39 11.625 23.25 11.625V5.8125H27.125V7.75Z" fill="currentColor"/><path d="M29.0625 1.9375H23.25C23.25 0.864609 22.3835 0 21.3125 0H9.6875C8.61655 0 7.75 0.864609 7.75 1.9375H1.9375C0.866547 1.9375 0 2.80211 0 3.875V7.75C0 12.0299 3.47006 15.5 7.75 15.5C7.84106 15.5 7.92583 15.4753 8.01495 15.4714C8.711 18.198 10.8398 20.3307 13.5625 21.0364V27.125H9.6875C8.61655 27.125 7.75 27.9896 7.75 29.0625V31H23.25V29.0625C23.25 27.9896 22.3835 27.125 21.3125 27.125H17.4375V21.0364C20.1602 20.3307 22.289 18.1985 22.985 15.4719C23.0742 15.4753 23.1589 15.5 23.25 15.5C27.5299 15.5 31 12.0299 31 7.75V3.875C31 2.80211 30.1335 1.9375 29.0625 1.9375ZM3.875 7.75V5.8125H7.75V11.625C5.61003 11.625 3.875 9.88803 3.875 7.75ZM27.125 7.75C27.125 9.88803 25.39 11.625 23.25 11.625V5.8125H27.125V7.75Z" fill="url(#paint0_linear_44_2)"/></g><defs><linearGradient id="paint0_linear_44_2" x1="15.5" y1="0" x2="15.5" y2="31" gradientUnits="userSpaceOnUse"><stop stopColor="#F8E081"/><stop offset="1" stopColor="#CBAC36"/></linearGradient><clipPath id="clip0_44_2"><rect width="31" height="31" fill="white"/></clipPath></defs></svg>
                      <div style={{color: "rgb(227, 200, 94)"}}>Leaderboard</div>
                    </motion.div>
                    <div style={{border: "1px solid rgb(31, 29, 60)"}} />
                    <motion.div whileHover={{x: 10}} className={classes.profileButton} onClick={() => logout()}>
                      <svg className={classes.buttonIconProfile} style={{color: "#FF4040"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" ><path fill="currentColor" d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z"></path></svg>
                      <div style={{color: "#FF4040"}}>Logout</div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}     
            </>
          ) : (
            <motion.div whileTap={{ scale: 0.97}} className={classes.signin} onClick={() => setOpenLogin(!openLogin)}>
              <svg className={classes.buttonIcon} tabIndex="-1" viewBox="0 0 512 512"><path d="M416 448h-84c-6.6 0-12-5.4-12-12v-24c0-6.6 5.4-12 12-12h84c26.5 0 48-21.5 48-48V160c0-26.5-21.5-48-48-48h-84c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h84c53 0 96 43 96 96v192c0 53-43 96-96 96zM167.1 83.5l-19.6 19.6c-4.8 4.8-4.7 12.5.2 17.1L260.8 230H12c-6.6 0-12 5.4-12 12v28c0 6.6 5.4 12 12 12h248.8L147.7 391.7c-4.8 4.7-4.9 12.4-.2 17.1l19.6 19.6c4.7 4.7 12.3 4.7 17 0l164.4-164c4.7-4.7 4.7-12.3 0-17l-164.4-164c-4.7-4.6-12.3-4.6-17 .1z"></path></svg>
              Sign in   
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

Navbar.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  user: PropTypes.object,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(Navbar);