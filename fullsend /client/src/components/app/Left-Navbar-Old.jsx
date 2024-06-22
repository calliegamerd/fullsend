import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { NavLink as Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
import parseCommasToThousands from "../../utils/parseCommasToThousands";
import cutDecimalPoints from "../../utils/cutDecimalPoints";
import { useToasts } from "react-toast-notifications";
import { useHistory } from 'react-router-dom';

// MUI Components
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Avatar from "@material-ui/core/Avatar";
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
import Admin from "../modals/admin/AdminModal";
import LoginModal from "../modals/login/LoginModal";
import Rewards from "../modals/rewards/RewardsModal";
import Affiliates from "../modals/affiliates/AffiliatesModal";
import TermsModal from "../modals/TermsModal";
import About from "../modals/AboutModal";

// Number Components
import { PlayAmount as RoulettePlayAmount } from "../roulette/PlayAmount";
import { PlayAmount as BattlesPlayAmount } from "../battles/PlayAmount";
import { PlayAmount as CrashPlayAmount } from "../crash/PlayAmount";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: "transparent",
    display: "flex",
    width: "220px",
    marginLeft: "20px",
    height: "100%",
    overflowY: "scroll",
    scrollbarWidth: "none",
    boxShadow: "none",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  desktop: {
    margin: 0,
    padding: "0.75em",
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  mobile: {
    display: "none",
    margin: 0,
    padding: "0.5em",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
    },
  },
  brand: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: "50px",
  },
  raceButton: {
    width: "100%",
    background: "repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(0,0,0,.08) 0,rgba(0,0,0,.08) 20px)",
    backgroundColor: "#2871FF",
    color: "#fff",
    fontWeight: 500,
    borderRadius: "0.5rem",
    padding: "0.75rem 0",
    marginBottom: 4,
    display: "flex",
    justifyContent: "left",
    textDecoration: "none",
    cursor: "pointer",
    transitionDuration: "300ms",
    "& > svg": {
      margin: "0 0.75rem 0 1rem",
      color: "#fff",
      height: 20,
      width: 20
    },
    "&:hover": {
      filter: "brightness(110%)"
    }
  },
  notActive: {
    width: "100%",
    backgroundColor: "#0A0B1C",
    color: "#9E9FBD",
    fontWeight: 500,
    borderRadius: "0.5rem",
    padding: "0.75rem 0",
    marginBottom: 4,
    display: "flex",
    justifyContent: "left",
    textDecoration: "none",
    cursor: "pointer",
    transitionDuration: "300ms",
    "& > svg": {
      margin: "0 0.75rem 0 1rem",
      color: "#4D527C",
      height: 20,
      width: 20
    },
    "&:hover": {
      filter: "brightness(125%)"
    }
  },
  active: {
    width: "100%",
    backgroundColor: "#080F27",
    color: "#fff",
    fontWeight: 500,
    borderRadius: "0.5rem",
    padding: "0.75rem 0",
    marginBottom: 4,
    display: "flex",
    justifyContent: "left",
    textDecoration: "none",
    cursor: "pointer",
    transitionDuration: "300ms",
    "& > svg": {
      margin: "0 0.75rem 0 1rem",
      color: "#2871FF",
      height: 20,
      width: 20
    },
    "&:hover": {
      filter: "brightness(125%)"
    }
  },
  border: {
    width: "60%", 
    borderBottom: "1px solid #4D527C",
    margin: "2rem 0",
    marginLeft: "20%"
  },
  text: {
    color: "#4D527C",
    fontWeight: 500,
    justifyContent: "left",
    alignItems: "left",
    display: "flex",
    margin: "1.5rem 0 0.35rem 1rem",
    letterSpacing: "0.2rem",
  },
  other: {
    width: "100%",
    padding: "0.5rem 0.5rem",
    display: "flex",
    justifyContent: "left",
    color: "#9E9FBD",
    fontWeight: 500,
    cursor: "pointer",
    transitionDuration: "300ms",
    "&:hover": {
      filter: "brightness(125%)"
    }
  },
  socialMediaContainer: {
    display: "flex",
    gap: "0.5rem",
    marginTop: "1rem"
  },
  socialMedia: {
    backgroundColor: "#0A0B1C",
    borderRadius: "12px",
    padding: "0.5rem",
    color: "#4D527C",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    width: "50px",
    height: "50px",
    transitionDuration: "300ms",
    "&:hover": {
      filter: "brightness(125%)"
    }
  },
  switchContainer: {
    position: "fixed",
    bottom: "2rem",
    transition: 'left 0.2s'
  },
  switch: {
    postition: "relative",
    backgroundColor: "#131426",
    borderRadius: "12px",
    padding: "0.5rem",
    color: "#4D527C",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    width: "40px",
    height: "40px",
    transitionDuration: "300ms",
    "&:hover": {
      filter: "brightness(125%)"
    }
  }
}));

const Navbar = ({ isAuthenticated, isLoading, user, logout }) => {
  // Declare State
  const { addToast } = useToasts();
  const history = useHistory();
  const classes = useStyles();
  const [openProfile, setOpenProfile] = useState(false);
  const [openWallet, setOpenWallet] = useState(false);
  const [openCoupon, setOpenCoupon] = useState(false);
  const [openFree, setOpenFree] = useState(false);
  const [openRace, setOpenRace] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mbAnchorEl, setMbAnchorEl] = useState(null);
  const [affiliateCode, setAffiliateCode] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showGames, setShowGames] = useState(false);
  const [openRewards, setOpenRewards] = useState(false);
  const [openAffiliates, setOpenAffiliates] = useState(false);
  const [openSupport, setOpenSupport] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);
  const [openAbout, setOpenAbout] = useState(false);
  const [hidden, setHidden] = useState(false);
  const open = Boolean(anchorEl);
  const openMobile = Boolean(mbAnchorEl);

  // If user has clicked affiliate link
  useEffect(() => {
    // Get affiliate code from localStorage
    const storageCode = localStorage.getItem("affiliateCode");

    // If user is logged in
    if (!isLoading && isAuthenticated && storageCode) {
      // Remove item from localStorage
      localStorage.removeItem("affiliateCode");

      setOpenFree(true);
      setAffiliateCode(storageCode);
    }
  }, [isLoading, isAuthenticated]);

  return (
    <AppBar 
      position="static" 
      className={classes.root}
      style={{
        width: hidden ? "75px" : "220px",
        transition: 'width 0.2s',
      }}
    >
      <Toolbar variant="dense" className={classes.desktop} >
        <div>
          <Admin 
            handleClose={() => setOpenAdmin(!openAdmin)}
            open={openAdmin}
          />
          <Race 
            handleClose={() => setOpenRace(!openRace)}
            open={openRace}
          />
          <Rewards 
            handleClose={() => setOpenRewards(!openRewards)}
            open={openRewards}
          />
          <Affiliates 
            handleClose={() => setOpenAffiliates(!openAffiliates)}
            open={openAffiliates}
          />
          <Support 
            handleClose={() => setOpenSupport(!openSupport)}
            open={openSupport}
          />
          <Coupon
            handleClose={() => setOpenCoupon(!openCoupon)}
            open={openCoupon}
          />
          <Free
            handleClose={() => setOpenFree(!openFree)}
            open={openFree}
            code={affiliateCode}
          />
          <LoginModal
            handleClose={() => setOpenLogin(!openLogin)}
            open={openLogin}
          />
          <About
            handleClose={() => setOpenAbout(!openAbout)}
            open={openAbout}
          />
          {user ? <Profile 
            handleClose={() => setOpenProfile(!openProfile)}
            open={openProfile}
            userid={user._id}
          /> : ""}
          {user ? <Wallet
            handleClose={() => setOpenWallet(!openWallet)}
            open={openWallet}
            user={user}
          /> : ""}
          <TermsModal
            handleClose={() => setOpenTerms(!openTerms)}
            open={openTerms}
          />
        </div>

        <div className={classes.brand}>
          {hidden ? <img style={{width: "50px", marginBottom: "25px"}} src={logosmall}/> : <img style={{width: "200px", marginBottom: "50px"}} src={logo}/>}
        </div>

        <Link
          exact
          activeClassName={classes.active}
          className={classes.notActive}
          to="/home"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 17.5V11.3333C7.5 10.8666 7.5 10.6333 7.59083 10.455C7.67072 10.2982 7.79821 10.1707 7.95501 10.0908C8.13327 9.99999 8.36662 9.99999 8.83333 9.99999H11.1667C11.6334 9.99999 11.8667 9.99999 12.045 10.0908C12.2018 10.1707 12.3293 10.2982 12.4092 10.455C12.5 10.6333 12.5 10.8666 12.5 11.3333V17.5M9.18141 2.30333L3.52949 6.69927C3.15168 6.99312 2.96278 7.14005 2.82669 7.32405C2.70614 7.48704 2.61633 7.67065 2.56169 7.86588C2.5 8.08627 2.5 8.32558 2.5 8.80421V14.8333C2.5 15.7667 2.5 16.2335 2.68166 16.59C2.84144 16.9036 3.09641 17.1585 3.41002 17.3183C3.76654 17.5 4.23325 17.5 5.16667 17.5H14.8333C15.7668 17.5 16.2335 17.5 16.59 17.3183C16.9036 17.1585 17.1586 16.9036 17.3183 16.59C17.5 16.2335 17.5 15.7667 17.5 14.8333V8.80421C17.5 8.32558 17.5 8.08627 17.4383 7.86588C17.3837 7.67065 17.2939 7.48704 17.1733 7.32405C17.0372 7.14005 16.8483 6.99312 16.4705 6.69927L10.8186 2.30333C10.5258 2.07562 10.3794 1.96177 10.2178 1.918C10.0752 1.87938 9.92484 1.87938 9.78221 1.918C9.62057 1.96177 9.47418 2.07562 9.18141 2.30333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {hidden ? "" : "Dashboard"}
        </Link>
        <Link
          exact
          activeClassName={classes.active}
          className={classes.notActive}
          to="/profile"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16.6666 17.5C16.6666 16.337 16.6666 15.7555 16.5231 15.2824C16.1999 14.217 15.3662 13.3834 14.3009 13.0602C13.8277 12.9167 13.2462 12.9167 12.0832 12.9167H7.91659C6.75362 12.9167 6.17213 12.9167 5.69897 13.0602C4.63363 13.3834 3.79995 14.217 3.47678 15.2824C3.33325 15.7555 3.33325 16.337 3.33325 17.5M13.7499 6.25C13.7499 8.32107 12.071 10 9.99992 10C7.92885 10 6.24992 8.32107 6.24992 6.25C6.24992 4.17893 7.92885 2.5 9.99992 2.5C12.071 2.5 13.7499 4.17893 13.7499 6.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {hidden ? "" : "Profile Page"}
        </Link>

        {hidden ? <div className={classes.border} /> : <span className={classes.text}>GAMES</span>}
        <Link
          exact
          activeClassName={classes.active}
          className={classes.notActive}
          to="/battles"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7.99186 13.5825C7.82009 13.5806 7.65572 13.5123 7.53302 13.392L2.59829 8.44578C2.49 8.32756 2.42993 8.17302 2.42993 8.01266C2.42993 7.8523 2.49 7.69776 2.59829 7.57955L9.86187 0.190571C9.98352 0.0686989 10.1486 0.000151636 10.3207 0H15.2987C15.4686 0 15.6316 0.0675352 15.7517 0.187748C15.8719 0.307962 15.9394 0.471006 15.9394 0.641013L16 5.56122C16.0002 5.7361 15.9318 5.90408 15.8095 6.02899L8.44205 13.4006C8.31927 13.5143 8.15911 13.579 7.99186 13.5825ZM3.96617 7.98668L7.99186 12.006L14.7014 5.29269L14.6581 1.29069H10.5977L3.96617 7.98668Z" fill="currentColor"/><path d="M10.416 15.9993C10.3305 16.0013 10.2455 15.9853 10.1665 15.9525C10.0875 15.9197 10.0162 15.8707 9.95715 15.8088L0.174267 6.02898C0.0595732 5.90582 -0.00286679 5.74293 0.000101159 5.57462C0.00306911 5.40631 0.0712134 5.24572 0.190178 5.12669C0.309142 5.00766 0.469637 4.93947 0.637852 4.9365C0.806066 4.93353 0.968866 4.99601 1.09195 5.11077L10.8748 14.9165C10.9964 15.0383 11.0647 15.2035 11.0647 15.3756C11.0647 15.5478 10.9964 15.7129 10.8748 15.8347C10.7495 15.948 10.5846 16.0071 10.416 15.9993Z" fill="currentColor"/><path d="M3.61998 15.9473C3.46095 15.9445 3.30788 15.8863 3.18711 15.7828L0.200297 12.7943C0.138686 12.7314 0.0901349 12.6569 0.0574447 12.5751C0.0247546 12.4933 0.00857299 12.4059 0.00983405 12.3178C0.00983405 11.9627 0.00983415 11.954 3.57669 8.48907C3.69843 8.36741 3.86347 8.29907 4.03553 8.29907C4.2076 8.29907 4.37263 8.36741 4.49438 8.48907C4.61597 8.61089 4.68427 8.77601 4.68427 8.94818C4.68427 9.12034 4.61597 9.28547 4.49438 9.40728C3.37757 10.5074 2.16553 11.7028 1.55951 12.3178L3.61998 14.3795L6.52887 11.4516C6.58856 11.3903 6.65991 11.3416 6.73871 11.3083C6.81752 11.2751 6.90218 11.2579 6.98771 11.2579C7.07324 11.2579 7.1579 11.2751 7.23671 11.3083C7.31551 11.3416 7.38687 11.3903 7.44655 11.4516C7.56815 11.5734 7.63645 11.7385 7.63645 11.9107C7.63645 12.0829 7.56815 12.248 7.44655 12.3698L4.05285 15.7828C3.93285 15.8876 3.77929 15.946 3.61998 15.9473Z" fill="currentColor"/></svg>         
          {hidden ? "" : "Case Battles"}
        </Link>
        {/*<Link
          exact
          activeClassName={classes.active}
          className={classes.notActive}
          to="/blackjack"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none"><script xmlns=""/><path d="M4.82402 12.3325C4.61438 12.2078 4.4609 12.0016 4.39751 11.7596C4.33412 11.5176 4.36581 11.2595 4.48592 11.0418L9.48779 1.97016L9.14136 1.00225C9.05739 0.7672 8.88668 0.576043 8.66703 0.471513C8.44738 0.366982 8.19659 0.357165 7.97027 0.444947L0.593972 3.28863C0.367651 3.37584 0.183591 3.55313 0.0829416 3.78068C-0.0177075 4.00822 -0.0271607 4.26868 0.0568062 4.50372L3.92763 15.3339C4.01159 15.5689 4.18231 15.7601 4.4014 15.8646C4.62049 15.9691 4.87128 15.979 5.0976 15.8917L8.56193 14.556L4.82235 12.3319L4.82402 12.3325Z" fill="currentColor"/><path d="M19.5559 4.327L12.8024 0.134239C12.595 0.00545302 12.347 -0.032663 12.1129 0.0285536C11.8788 0.0897702 11.6775 0.245122 11.5535 0.460535L5.84654 10.3759C5.72254 10.5913 5.68583 10.8489 5.74478 11.092C5.80372 11.3351 5.95331 11.5442 6.16072 11.673L12.9142 15.8658C13.1216 15.9945 13.3696 16.0327 13.6037 15.9714C13.8379 15.9102 14.0392 15.7549 14.1632 15.5395L19.8707 5.6241C19.9947 5.40869 20.0314 5.15111 19.9724 4.90798C19.9135 4.66485 19.7639 4.45579 19.5565 4.327H19.5559ZM14.6497 10.1732C13.79 10.8691 12.6634 10.2009 12.5216 9.23703C12.5216 9.23703 11.6364 10.9292 12.4054 11.6926L10.0188 10.179C11.0236 10.5405 12.0695 8.95059 12.0695 8.95059C11.1798 9.25956 10.0944 8.5238 10.2968 7.41151C10.4964 6.31943 11.2026 6.16292 12.2075 6.11037C12.8842 6.07514 14.4629 5.41042 14.4629 5.41042C14.4629 5.41042 14.6147 7.17242 14.8927 7.81404C15.3064 8.76636 15.4944 9.49114 14.6497 10.1738V10.1732Z" fill="currentColor"/></svg>
          {hidden ? "" : "Blackjack"}
        </Link>*/}
        <Link
          exact
          activeClassName={classes.active}
          className={classes.notActive}
          to="/cases"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="300.000000pt" height="300.000000pt" viewBox="0 0 300.000000 300.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,300.000000) scale(0.100000,-0.100000)" fill="currentColor"><path d="M454 2605 c-169 -37 -304 -159 -354 -322 -18 -60 -20 -93 -20 -419 l0 -354 240 0 240 0 -2 553 c-3 632 9 567 -104 542z"></path><path d="M710 2065 l0 -555 235 0 235 0 0 120 c0 125 11 171 45 184 9 3 133 6 275 6 328 0 304 14 308 -174 l4 -136 234 0 234 0 0 555 0 555 -785 0 -785 0 0 -555z"></path><path d="M2437 2613 c-4 -3 -7 -253 -7 -555 l0 -548 240 0 240 0 0 354 c0 326 -2 359 -20 419 -38 121 -123 223 -235 280 -70 35 -203 66 -218 50z"></path><path d="M1443 1646 l-28 -24 -3 -164 c-2 -101 1 -177 8 -200 19 -66 93 -85 137 -36 16 18 18 40 18 210 l0 190 -28 24 c-36 30 -68 30 -104 0z"></path><path d="M80 937 c0 -423 0 -424 23 -457 49 -73 57 -75 265 -75 l187 0 0 475 0 475 -237 3 -238 2 0 -423z"></path><path d="M710 880 l0 -480 785 0 785 0 0 480 0 480 -235 0 -235 0 0 -119 c0 -123 -8 -165 -38 -187 -23 -18 -509 -20 -546 -3 -36 17 -46 57 -46 190 l0 119 -235 0 -235 0 0 -480z"></path><path d="M2437 1353 c-4 -3 -7 -220 -7 -480 l0 -475 183 4 c203 3 229 11 274 78 23 33 23 34 23 456 l0 424 -233 0 c-129 0 -237 -3 -240 -7z"></path></g></svg>
          {hidden ? "" : "Cases"}
        </Link>
        <Link
          exact
          activeClassName={classes.active}
          className={classes.notActive}
          to="/crash"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12.7568 16H3.24324C2.38308 16 1.55815 15.6583 0.949924 15.0501C0.341698 14.4419 0 13.6169 0 12.7568V3.24324C0 2.38308 0.341698 1.55815 0.949924 0.949924C1.55815 0.341698 2.38308 0 3.24324 0H12.7568C13.6169 0 14.4419 0.341698 15.0501 0.949924C15.6583 1.55815 16 2.38308 16 3.24324V12.7568C16 13.6169 15.6583 14.4419 15.0501 15.0501C14.4419 15.6583 13.6169 16 12.7568 16ZM3.24324 1.2973C2.72715 1.2973 2.23219 1.50232 1.86725 1.86725C1.50232 2.23219 1.2973 2.72715 1.2973 3.24324V12.7568C1.2973 13.2729 1.50232 13.7678 1.86725 14.1327C2.23219 14.4977 2.72715 14.7027 3.24324 14.7027H12.7568C13.2729 14.7027 13.7678 14.4977 14.1327 14.1327C14.4977 13.7678 14.7027 13.2729 14.7027 12.7568V3.24324C14.7027 2.72715 14.4977 2.23219 14.1327 1.86725C13.7678 1.50232 13.2729 1.2973 12.7568 1.2973H3.24324Z" fill="currentColor"/><path d="M0.628546 11.9993C0.532884 11.9992 0.438399 11.9791 0.351674 11.9405C0.264949 11.9019 0.18807 11.8457 0.126394 11.7758C0.0311178 11.652 -0.0127685 11.4988 0.00322397 11.3458C0.0192164 11.1929 0.0939511 11.051 0.212972 10.9477L4.28213 7.71843C4.60892 7.45781 4.98621 7.26134 5.39243 7.14026C5.79866 7.01918 6.22585 6.97585 6.64959 7.01277C7.07333 7.04968 7.48531 7.1661 7.86198 7.35538C8.23865 7.54466 8.57262 7.80309 8.84479 8.11588L9.81446 9.22544C9.98094 9.4161 10.1856 9.57301 10.4164 9.68692C10.6472 9.80083 10.8995 9.86945 11.1585 9.88873C11.4174 9.90802 11.6778 9.87759 11.9242 9.79923C12.1707 9.72087 12.3983 9.59616 12.5936 9.43244L14.9139 7.44518C14.9781 7.39082 15.0529 7.34908 15.1341 7.32236C15.2152 7.29564 15.301 7.28446 15.3866 7.28946C15.4722 7.29446 15.556 7.31553 15.6331 7.35149C15.7102 7.38744 15.7791 7.43757 15.836 7.49901C15.8928 7.56044 15.9364 7.63199 15.9644 7.70955C15.9923 7.78712 16.004 7.86919 15.9988 7.95108C15.9936 8.03296 15.9715 8.11306 15.9339 8.1868C15.8963 8.26055 15.8439 8.32648 15.7797 8.38085L13.4507 10.2936C13.1285 10.5641 12.7533 10.7708 12.3469 10.9015C11.9405 11.0323 11.511 11.0846 11.0833 11.0553C10.6556 11.026 10.2383 10.9158 9.8555 10.731C9.47271 10.5463 9.13211 10.2906 8.85345 9.97894L7.88378 8.86939C7.71846 8.6779 7.51495 8.51979 7.2851 8.40428C7.05525 8.28877 6.80366 8.21817 6.54499 8.1966C6.28632 8.17502 6.02575 8.20289 5.77846 8.27859C5.53117 8.3543 5.30211 8.47632 5.10463 8.63754L1.06144 11.8586C0.94099 11.9562 0.786276 12.0065 0.628546 11.9993Z" fill="currentColor"/></svg>          
          {hidden ? "" : "Crash"}
        </Link>
        <Link
          exact
          activeClassName={classes.active}
          className={classes.notActive}
          to="/roulette"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="24px" viewBox="0 0 24 24" ><g id="surface1"><path fill="currentColor" d="M 2.613281 22.402344 C 2.847656 23.34375 3.691406 24 4.660156 24 L 19.339844 24 C 20.308594 24 21.152344 23.34375 21.386719 22.402344 L 22.042969 19.78125 L 1.957031 19.78125 Z M 2.613281 22.402344 "></path><path fill="currentColor" d="M 0 14.15625 L 24 14.15625 L 24 18.375 L 0 18.375 Z M 0 14.15625 "></path><path d="M 6.375 8.4375 C 7.292969 8.4375 8.074219 7.851562 8.363281 7.03125 L 10.75 7.03125 L 10.121094 12.75 L 13.878906 12.75 L 13.25 7.03125 L 15.636719 7.03125 C 15.925781 7.851562 16.707031 8.4375 17.625 8.4375 C 18.785156 8.4375 19.734375 7.488281 19.734375 6.328125 C 19.734375 5.167969 18.785156 4.21875 17.625 4.21875 C 16.707031 4.21875 15.925781 4.804688 15.636719 5.625 L 13.09375 5.625 L 12.917969 4.007812 C 13.625 3.667969 14.109375 2.941406 14.109375 2.109375 C 14.109375 0.949219 13.160156 0 12 0 C 10.839844 0 9.890625 0.949219 9.890625 2.109375 C 9.890625 2.941406 10.375 3.667969 11.082031 4.007812 L 10.90625 5.625 L 8.363281 5.625 C 8.074219 4.804688 7.292969 4.21875 6.375 4.21875 C 5.214844 4.21875 4.265625 5.167969 4.265625 6.328125 C 4.265625 7.488281 5.214844 8.4375 6.375 8.4375 Z M 6.375 8.4375 " fill="currentColor"></path></g></svg> 
          {hidden ? "" : "Roulette"}
        </Link>

        {hidden ? <div className={classes.border} /> : <span className={classes.text}>REWARDS</span>}
        <Link
          // onClick={() => setOpenRace(!openRace)}
          // className={classes.raceButton}
          exact
          activeClassName={classes.active}
          className={classes.notActive}
          to="/leaderboard"
        >
          <svg tabIndex="-1" viewBox="0 0 512 512"><path fill="currentColor" d="M210.4 173.6c-50.8 0-86.1 10-114.4 22.1V102a56 56 0 1 0-64 0v388a22 22 0 0 0 22 22h20a22 22 0 0 0 22-22V298.7c28.3-12.1 63.6-22.1 114.4-22.1a144.77 144.77 0 0 1 29.6 3.26v-103a144.77 144.77 0 0 0-29.6-3.26zM240 374.82c39.58 8.25 77.24 29.4 128 31.38v-95c-50.76-2-88.42-23.13-128-31.38zM368 97.76a169.27 169.27 0 0 1-18.5 1c-37.32 0-70.17-16.92-109.5-27.17v105.23c39.58 8.25 77.24 29.4 128 31.38zm143.9 146.3v-84c-35.79 24.58-88.14 48.3-136.3 48.3-2.57 0-5.09-.07-7.6-.16v103c2.51.09 5 .16 7.6.16 48.2 0 100.6-23.76 136.4-48.36v-17.16c-.06-.57-.09-1.16-.1-1.78z"></path></svg>
          {hidden ? "" : "Leaderboard"}
        </Link>
        <div
          onClick={() => setOpenRewards(!openRewards)}
          className={classes.notActive}
        >
          <svg tabIndex="-1" viewBox="-45 0 90 76"><path d="M-40,23 L-14,35 L0,5 L14,35 L40,23 L30,55 L-30,55 Z M-30,71 L30,71" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="10"></path></svg>            
          {hidden ? "" : "Rewards"}
        </div>

        {hidden ? <div className={classes.border} /> : <span className={classes.text}>OTHER</span>}
        <div className={classes.other} onClick={() => setOpenTerms(!openTerms)}>{hidden ? "TOS" : "Terms of Service"}</div>
        <div className={classes.other} onClick={() => setOpenFree(!openFree)}>{hidden ? "Free" : "Free Coins"}</div>
        <div className={classes.other} onClick={() => setOpenAffiliates(!openAffiliates)}>{hidden ? <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 512 512" ><g ><path fill="currentColor" d="M416 311.4c57.3-11.1 96-31.7 96-55.4v-42.7c-23.2 16.4-57.3 27.6-96 34.5zm-4.7-95.1c60-10.8 100.7-32 100.7-56.3v-42.7c-35.5 25.1-96.5 38.6-160.7 41.8 29.5 14.3 51.2 33.5 60 57.2zM512 64c0-35.3-86-64-192-64S128 28.7 128 64s86 64 192 64 192-28.7 192-64z" ></path><path data-v-efc4949e="" fill="currentColor" d="M192 320c106 0 192-35.8 192-80s-86-80-192-80S0 195.8 0 240s86 80 192 80zM0 405.3V448c0 35.3 86 64 192 64s192-28.7 192-64v-42.7C342.7 434.4 267.2 448 192 448S41.3 434.4 0 405.3zm0-104.9V352c0 35.3 86 64 192 64s192-28.7 192-64v-51.6c-41.3 34-116.9 51.6-192 51.6S41.3 334.4 0 300.4z"></path></g></svg> : "Affiliates"}</div>
        <div className={classes.other} onClick={() => setOpenSupport(!openSupport)}>{hidden ? <svg fill="currentColor" width="18" height="18" viewBox="0 0 24 24"><path d="M12,1C7,1 3,5 3,10V17A3,3 0 0,0 6,20H9V12H5V10A7,7 0 0,1 12,3A7,7 0 0,1 19,10V12H15V20H19V21H12V23H18A3,3 0 0,0 21,20V10C21,5 16.97,1 12,1Z"></path></svg> : "Support"}</div>
        {user?.rank >= 5 ? <div className={classes.other} onClick={() => setOpenAdmin(!openAdmin)}>{ hidden ? <svg width="18" height="18" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M768 548.571429V182.857143H512v649.714286q68-36 121.714286-78.285715 134.285714-105.142857 134.285714-205.714285z m109.714286-438.857143v438.857143q0 49.142857-19.142857 97.428571t-47.428572 85.714286-67.428571 72.857143T671.428571 863.428571t-69.142857 44.285715-51.142857 28.285714-24.285714 11.428571q-6.857143 3.428571-14.857143 3.428572t-14.857143-3.428572q-9.142857-4-24.285714-11.428571t-51.142857-28.285714-69.142857-44.285715-72.285715-58.857142-67.428571-72.857143-47.428572-85.714286T146.285714 548.571429V109.714286q0-14.857143 10.857143-25.714286t25.714286-10.857143h658.285714q14.857143 0 25.714286 10.857143t10.857143 25.714286z" fill="currentColor" /></svg> : "Admin"}</div> : ""}

        {hidden ? "" : <div className={classes.socialMediaContainer}>
          <a href="https://discord.gg/j82fApKDRb" target="_blank" rel="noreferrer"><div className={classes.socialMedia}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20.317 4.37579C18.7873 3.67391 17.147 3.15679 15.4319 2.86062C15.4007 2.8549 15.3695 2.86919 15.3534 2.89776C15.1424 3.27297 14.9087 3.76247 14.7451 4.14721C12.9004 3.87104 11.0652 3.87104 9.25832 4.14721C9.09465 3.75392 8.85248 3.27297 8.64057 2.89776C8.62449 2.87014 8.59328 2.85585 8.56205 2.86062C6.84791 3.15584 5.20756 3.67296 3.67693 4.37579C3.66368 4.3815 3.65233 4.39103 3.64479 4.40341C0.533392 9.05177 -0.31895 13.5859 0.0991801 18.0638C0.101072 18.0857 0.11337 18.1066 0.130398 18.1199C2.18321 19.6275 4.17171 20.5427 6.12328 21.1493C6.15451 21.1589 6.18761 21.1474 6.20748 21.1217C6.66913 20.4913 7.08064 19.8265 7.43348 19.1275C7.4543 19.0866 7.43442 19.038 7.39186 19.0218C6.73913 18.7742 6.1176 18.4723 5.51973 18.1295C5.47244 18.1019 5.46865 18.0342 5.51216 18.0018C5.63797 17.9076 5.76382 17.8095 5.88396 17.7104C5.90569 17.6923 5.93598 17.6885 5.96153 17.6999C9.88928 19.4932 14.1415 19.4932 18.023 17.6999C18.0485 17.6876 18.0788 17.6914 18.1015 17.7095C18.2216 17.8085 18.3475 17.9076 18.4742 18.0018C18.5177 18.0342 18.5149 18.1019 18.4676 18.1295C17.8697 18.479 17.2482 18.7742 16.5945 19.0209C16.552 19.0371 16.533 19.0866 16.5538 19.1275C16.9143 19.8256 17.3258 20.4903 17.7789 21.1208C17.7978 21.1474 17.8319 21.1589 17.8631 21.1493C19.8241 20.5427 21.8126 19.6275 23.8654 18.1199C23.8834 18.1066 23.8948 18.0866 23.8967 18.0647C24.3971 12.8878 23.0585 8.39085 20.3482 4.40435C20.3416 4.39103 20.3303 4.3815 20.317 4.37579ZM8.02002 15.3372C6.8375 15.3372 5.86313 14.2516 5.86313 12.9183C5.86313 11.585 6.8186 10.4993 8.02002 10.4993C9.23087 10.4993 10.1958 11.5945 10.1769 12.9183C10.1769 14.2516 9.22141 15.3372 8.02002 15.3372ZM15.9947 15.3372C14.8123 15.3372 13.8379 14.2516 13.8379 12.9183C13.8379 11.585 14.7933 10.4993 15.9947 10.4993C17.2056 10.4993 18.1705 11.5945 18.1516 12.9183C18.1516 14.2516 17.2056 15.3372 15.9947 15.3372Z" fill="#4D527C"/></svg>
          </div></a>
          <a href="https://twitter.com/FullsenddotGG" target="_blank" rel="noreferrer"><div className={classes.socialMedia}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none"><path d="M20 0.00896646C19.1294 0.611275 18.1656 1.07195 17.1455 1.37324C16.5979 0.755757 15.8703 0.318104 15.0609 0.119469C14.2516 -0.0791667 13.3995 -0.0292013 12.6201 0.262607C11.8406 0.554416 11.1713 1.07399 10.7027 1.75105C10.2341 2.42812 9.98882 3.23001 10 4.04827V4.93995C8.40239 4.98058 6.81934 4.63305 5.39183 3.92829C3.96431 3.22354 2.73665 2.18345 1.81818 0.900645C1.81818 0.900645 -1.81818 8.92575 6.36364 12.4925C4.49139 13.739 2.26105 14.364 0 14.2758C8.18182 18.7342 18.1818 14.2758 18.1818 4.02152C18.181 3.77315 18.1566 3.52539 18.1091 3.28143C19.0369 2.38395 19.6917 1.25082 20 0.00896646Z" fill="#4D527C"/></svg>
          </div></a>
        </div>}

        <div 
          className={classes.switchContainer}
          style={{ 
            left: hidden ? "6rem" : "15rem"
          }}
        >
          <div className={classes.switch} onClick={() => setHidden(!hidden)}>
            {
              hidden ? <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"></path></svg>
              : <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"></path></svg>
            }
          </div>
        </div>
        
        
      </Toolbar>
      <Toolbar variant="dense" className={classes.mobile}>
        <div className={classes.brand} onClick={() => history.push(`/home`)} style={{marginRight: "0.5rem"}}>
          <svg className={classes.logoSvg} tabIndex="-1" viewBox="-45 0 90 76"><path d="M-40,23 L-14,35 L0,5 L14,35 L40,23 L30,55 L-30,55 Z M-30,71 L30,71" fill="rgb(58, 137, 235)" stroke="rgb(58, 137, 235)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="10"></path></svg>
        </div>

        <div style={{display: "flex", justifyContent: "center"}}>
          <div className={classes.selectGame} onClick={() => setShowGames(!showGames)}>
            <svg className={classes.buttonIcon} style={{transition: "all .3s ease", transform: showGames ? "" : "rotate(-90deg)", width: "8px",height: "5px",flexShrink: 0,fill: "#FFF",opacity: 0.5,}} xmlns="http://www.w3.org/2000/svg" width="8" height="5" viewBox="0 0 8 5" fill="none"><path opacity="0.5" d="M7.59976 4.76837e-07L0.399555 4.76837e-07C0.326656 0.000191212 0.2552 0.0169754 0.192878 0.0485463C0.130557 0.0801172 0.0797286 0.125279 0.0458665 0.179171C0.0120039 0.233063 -0.00361156 0.293644 0.000701904 0.354393C0.00501537 0.415143 0.0290937 0.47376 0.0703454 0.523935L3.67045 4.86501C3.81965 5.045 4.17886 5.045 4.32847 4.86501L7.92857 0.523935C7.97024 0.473865 7.99468 0.415218 7.99922 0.354367C8.00377 0.293517 7.98826 0.23279 7.95436 0.178783C7.92047 0.124777 7.8695 0.0795579 7.80698 0.048038C7.74446 0.0165186 7.67279 -9.53674e-05 7.59976 4.76837e-07Z" fill="white"/></svg>
            Games
          </div>
          <div className={classes.gameDropDown} style={{opacity: showGames ? 1 : 0, pointerEvents: showGames ? "all" : "none", }}>
            <div className={classes.gameButton} style={{}} onClick={() => { history.push(`/battles`); setShowGames(!showGames) }}>
              <svg className={classes.buttonIcon} fill="currentColor" viewBox="0 0 512.001 512.001" xmlns="http://www.w3.org/2000/svg" width="24" height="24" ><g><path d="m59.603 384.898h45v90h-45z" transform="matrix(.707 -.707 .707 .707 -279.94 183.975)"></path><path  d="m13.16 498.841c17.547 17.545 46.093 17.545 63.64 0l-63.64-63.64c-17.547 17.547-17.547 46.093 0 63.64z"></path><path  d="m384.898 407.398h90v45h-90z" transform="matrix(.707 -.707 .707 .707 -178.07 429.898)"></path><path d="m435.201 498.841c17.547 17.545 46.093 17.545 63.64 0 17.547-17.547 17.547-46.093 0-63.64z"></path><path d="m424.595 360.955-21.213-21.215 31.818-31.818c5.863-5.863 5.863-15.352 0-21.215-5.863-5.861-15.35-5.861-21.213 0l-127.278 127.28c-5.863 5.863-5.863 15.35 0 21.213 5.861 5.863 15.35 5.863 21.213 0l31.82-31.82 21.213 21.213z"></path><path d="m128.722 277.214-19.102 19.102-10.607-10.607c-5.863-5.861-15.35-5.861-21.213 0-5.863 5.863-5.863 15.352 0 21.215l31.82 31.818-22.215 22.215 63.64 63.638 22.213-22.213 31.82 31.82c5.863 5.863 15.352 5.863 21.213 0 5.863-5.863 5.863-15.35 0-21.213l-10.605-10.607 19.102-19.102z"></path><path  d="m497.002.001h-84.853c-3.977 0-7.789 1.575-10.607 4.391l-124.329 124.33 106.066 106.066 124.329-124.331c2.818-2.816 4.393-6.628 4.393-10.605v-84.853c-.001-8.287-6.713-14.998-14.999-14.998z"></path><path d="m110.459 4.392c-2.818-2.816-6.63-4.391-10.607-4.391h-84.853c-8.286 0-14.999 6.711-14.999 14.998v84.853c0 3.977 1.575 7.789 4.393 10.605l271.711 271.713 106.066-106.066z"></path></g></svg>
              <div>
                <div>Case Battles</div>
                <div style={{fontSize: 10}}><BattlesPlayAmount /></div>
              </div>
            </div>
            <div className={classes.gameButton} style={{}} onClick={() => { history.push(`/cases`); setShowGames(!showGames) }}>
              <svg className={classes.buttonIcon} xmlns="http://www.w3.org/2000/svg" width="300.000000pt" height="300.000000pt" viewBox="0 0 300.000000 300.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,300.000000) scale(0.100000,-0.100000)" fill="currentColor"><path d="M454 2605 c-169 -37 -304 -159 -354 -322 -18 -60 -20 -93 -20 -419 l0 -354 240 0 240 0 -2 553 c-3 632 9 567 -104 542z"></path><path d="M710 2065 l0 -555 235 0 235 0 0 120 c0 125 11 171 45 184 9 3 133 6 275 6 328 0 304 14 308 -174 l4 -136 234 0 234 0 0 555 0 555 -785 0 -785 0 0 -555z"></path><path d="M2437 2613 c-4 -3 -7 -253 -7 -555 l0 -548 240 0 240 0 0 354 c0 326 -2 359 -20 419 -38 121 -123 223 -235 280 -70 35 -203 66 -218 50z"></path><path d="M1443 1646 l-28 -24 -3 -164 c-2 -101 1 -177 8 -200 19 -66 93 -85 137 -36 16 18 18 40 18 210 l0 190 -28 24 c-36 30 -68 30 -104 0z"></path><path d="M80 937 c0 -423 0 -424 23 -457 49 -73 57 -75 265 -75 l187 0 0 475 0 475 -237 3 -238 2 0 -423z"></path><path d="M710 880 l0 -480 785 0 785 0 0 480 0 480 -235 0 -235 0 0 -119 c0 -123 -8 -165 -38 -187 -23 -18 -509 -20 -546 -3 -36 17 -46 57 -46 190 l0 119 -235 0 -235 0 0 -480z"></path><path d="M2437 1353 c-4 -3 -7 -220 -7 -480 l0 -475 183 4 c203 3 229 11 274 78 23 33 23 34 23 456 l0 424 -233 0 c-129 0 -237 -3 -240 -7z"></path></g></svg>
              <div>
                <div>Cases</div>
                <div style={{fontSize: 10}}>Unbox Items</div>
              </div>
            </div>
            <div className={classes.gameButton} style={{}} onClick={() => { history.push(`/roulette`); setShowGames(!showGames) }}>
              <svg className={classes.buttonIcon}xmlns="http://www.w3.org/2000/svg" width="30px" height="24px" viewBox="0 0 24 24" ><g id="surface1"><path d="M 2.613281 22.402344 C 2.847656 23.34375 3.691406 24 4.660156 24 L 19.339844 24 C 20.308594 24 21.152344 23.34375 21.386719 22.402344 L 22.042969 19.78125 L 1.957031 19.78125 Z M 2.613281 22.402344 "></path><path d="M 0 14.15625 L 24 14.15625 L 24 18.375 L 0 18.375 Z M 0 14.15625 "></path><path d="M 6.375 8.4375 C 7.292969 8.4375 8.074219 7.851562 8.363281 7.03125 L 10.75 7.03125 L 10.121094 12.75 L 13.878906 12.75 L 13.25 7.03125 L 15.636719 7.03125 C 15.925781 7.851562 16.707031 8.4375 17.625 8.4375 C 18.785156 8.4375 19.734375 7.488281 19.734375 6.328125 C 19.734375 5.167969 18.785156 4.21875 17.625 4.21875 C 16.707031 4.21875 15.925781 4.804688 15.636719 5.625 L 13.09375 5.625 L 12.917969 4.007812 C 13.625 3.667969 14.109375 2.941406 14.109375 2.109375 C 14.109375 0.949219 13.160156 0 12 0 C 10.839844 0 9.890625 0.949219 9.890625 2.109375 C 9.890625 2.941406 10.375 3.667969 11.082031 4.007812 L 10.90625 5.625 L 8.363281 5.625 C 8.074219 4.804688 7.292969 4.21875 6.375 4.21875 C 5.214844 4.21875 4.265625 5.167969 4.265625 6.328125 C 4.265625 7.488281 5.214844 8.4375 6.375 8.4375 Z M 6.375 8.4375 "></path></g></svg> 
              
              <div>
                <div>Roulette</div>
                <div style={{fontSize: 10}}><RoulettePlayAmount /></div>
              </div>
            </div>
            <div className={classes.gameButton} style={{}} onClick={() => { history.push(`/crash`); setShowGames(!showGames) }}>
              <svg className={classes.buttonIcon} xmlns="http://www.w3.org/2000/svg" width="22" viewBox="0 -3 16 16" id="meteor-icon-kit__regular-chart-line-up-s" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M12.5858 2H10C9.4477 2 9 1.55228 9 1C9 0.44772 9.4477 0 10 0H15C15.5523 0 16 0.44772 16 1V6C16 6.5523 15.5523 7 15 7C14.4477 7 14 6.5523 14 6V3.4142L9.7071 7.7071C9.3166 8.0976 8.6834 8.0976 8.2929 7.7071L6 5.4142L1.70711 9.7071C1.31658 10.0976 0.68342 10.0976 0.29289 9.7071C-0.09763 9.3166 -0.09763 8.6834 0.29289 8.2929L5.29289 3.2929C5.68342 2.90237 6.3166 2.90237 6.7071 3.2929L9 5.5858L12.5858 2z" fill="currnetColor"></path></svg>
              <div>
                <div>Crash</div>
                <div style={{fontSize: 10}}><CrashPlayAmount /></div>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className={classes.login}>
            <Skeleton
              height={36}
              width={120}
              animation="wave"
              variant="rect"
              style={{ marginRight: "1rem" }}
            />
            <Skeleton height={36} width={120} animation="wave" variant="rect" />
          </div>
        ) : isAuthenticated && user ? (      
          <div className={classes.login}>
            <div className={classes.name} style={{margin: "0 0.5rem 0 0", cursor: "auto", backgroundColor: "#1E232F", height: "2.25rem", padding: "0 0.5rem" }}>
              <div style={{display: "flex", fontWeight: 450, alignItems: "center", gap: "0.25rem"}}>
                <img style={{height: 17, width: 17}} src={coin} />
                {user.wallet == 0 ? "0.00" : parseCommasToThousands(cutDecimalPoints(user.wallet ? user.wallet : 0.00))}
              </div>
            </div>

            <div>
              <div style={{margin: 0, padding: "0 0.5em"}} className={classes.popupButton} onClick={() => setShowDropdown(!showDropdown)}>
                <svg className={classes.buttonIcon} style={{margin: 0}} tabIndex="-1" viewBox="0 0 448 512"><path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path></svg> 
              </div>
              <div className={classes.dropDown} style={{height: "190px", width: "120px", opacity: showDropdown ? 1 : 0, pointerEvents: showDropdown ? "all" : "none", marginTop: "0.5rem", marginLeft: "-5.5rem"}}>
                <span style={{ margin: "auto", width: "70%", cursor: "pointer", alignItems: "center", gap: "0.35rem", display: "flex" }} onClick={() => setOpenProfile(!openProfile)}>
                  <svg style={{height: 12.5, width: 12.5}} xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 20 20" version="1.1" ><g id="Page-1" stroke="none" strokeWidth="1" fill="currentColor" fillRule="evenodd"><g id="Dribbble-Light-Preview" transform="translate(-180.000000, -2159.000000)" fill="currentColor"><g id="icons" transform="translate(56.000000, 160.000000)"><path d="M134,2008.99998 C131.783496,2008.99998 129.980955,2007.20598 129.980955,2004.99998 C129.980955,2002.79398 131.783496,2000.99998 134,2000.99998 C136.216504,2000.99998 138.019045,2002.79398 138.019045,2004.99998 C138.019045,2007.20598 136.216504,2008.99998 134,2008.99998 M137.775893,2009.67298 C139.370449,2008.39598 140.299854,2006.33098 139.958235,2004.06998 C139.561354,2001.44698 137.368965,1999.34798 134.722423,1999.04198 C131.070116,1998.61898 127.971432,2001.44898 127.971432,2004.99998 C127.971432,2006.88998 128.851603,2008.57398 130.224107,2009.67298 C126.852128,2010.93398 124.390463,2013.89498 124.004634,2017.89098 C123.948368,2018.48198 124.411563,2018.99998 125.008391,2018.99998 C125.519814,2018.99998 125.955881,2018.61598 126.001095,2018.10898 C126.404004,2013.64598 129.837274,2010.99998 134,2010.99998 C138.162726,2010.99998 141.595996,2013.64598 141.998905,2018.10898 C142.044119,2018.61598 142.480186,2018.99998 142.991609,2018.99998 C143.588437,2018.99998 144.051632,2018.48198 143.995366,2017.89098 C143.609537,2013.89498 141.147872,2010.93398 137.775893,2009.67298" id="profile-[#1341]"></path></g></g></g></svg>
                  Profile
                </span>
                <span style={{ margin: "auto", width: "70%", cursor: "pointer", alignItems: "center", gap: "0.35rem", display: "flex" }} onClick={() => setOpenRewards(!openRewards)}>
                  <svg style={{height: 12.5, width: 12.5}} tabIndex="-1" viewBox="0 0 512 512"><path fill="currentColor" d="M32 448c0 17.7 14.3 32 32 32h160V320H32v128zm256 32h160c17.7 0 32-14.3 32-32V320H288v160zm192-320h-42.1c6.2-12.1 10.1-25.5 10.1-40 0-48.5-39.5-88-88-88-41.6 0-68.5 21.3-103 68.3-34.5-47-61.4-68.3-103-68.3-48.5 0-88 39.5-88 88 0 14.5 3.8 27.9 10.1 40H32c-17.7 0-32 14.3-32 32v80c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16v-80c0-17.7-14.3-32-32-32zm-326.1 0c-22.1 0-40-17.9-40-40s17.9-40 40-40c19.9 0 34.6 3.3 86.1 80h-86.1zm206.1 0h-86.1c51.4-76.5 65.7-80 86.1-80 22.1 0 40 17.9 40 40s-17.9 40-40 40z"></path></svg>
                  Rewards
                </span>
                <span style={{ margin: "auto", width: "70%", cursor: "pointer", alignItems: "center", gap: "0.35rem", display: "flex" }} onClick={() => setOpenRace(!openRace)}>
                  <svg style={{height: 12.5, width: 12.5}} tabIndex="-1" viewBox="0 0 512 512"><path fill="currentColor" d="M210.4 173.6c-50.8 0-86.1 10-114.4 22.1V102a56 56 0 1 0-64 0v388a22 22 0 0 0 22 22h20a22 22 0 0 0 22-22V298.7c28.3-12.1 63.6-22.1 114.4-22.1a144.77 144.77 0 0 1 29.6 3.26v-103a144.77 144.77 0 0 0-29.6-3.26zM240 374.82c39.58 8.25 77.24 29.4 128 31.38v-95c-50.76-2-88.42-23.13-128-31.38zM368 97.76a169.27 169.27 0 0 1-18.5 1c-37.32 0-70.17-16.92-109.5-27.17v105.23c39.58 8.25 77.24 29.4 128 31.38zm143.9 146.3v-84c-35.79 24.58-88.14 48.3-136.3 48.3-2.57 0-5.09-.07-7.6-.16v103c2.51.09 5 .16 7.6.16 48.2 0 100.6-23.76 136.4-48.36v-17.16c-.06-.57-.09-1.16-.1-1.78z"></path></svg>
                  Race
                </span>
                <span style={{ margin: "auto", width: "70%", cursor: "pointer", alignItems: "center", gap: "0.35rem", display: "flex" }} onClick={() => setOpenAffiliates(!openAffiliates)}>
                  <svg style={{height: 12.5, width: 12.5}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" ><g ><path fill="currentColor" d="M416 311.4c57.3-11.1 96-31.7 96-55.4v-42.7c-23.2 16.4-57.3 27.6-96 34.5zm-4.7-95.1c60-10.8 100.7-32 100.7-56.3v-42.7c-35.5 25.1-96.5 38.6-160.7 41.8 29.5 14.3 51.2 33.5 60 57.2zM512 64c0-35.3-86-64-192-64S128 28.7 128 64s86 64 192 64 192-28.7 192-64z" ></path><path data-v-efc4949e="" fill="currentColor" d="M192 320c106 0 192-35.8 192-80s-86-80-192-80S0 195.8 0 240s86 80 192 80zM0 405.3V448c0 35.3 86 64 192 64s192-28.7 192-64v-42.7C342.7 434.4 267.2 448 192 448S41.3 434.4 0 405.3zm0-104.9V352c0 35.3 86 64 192 64s192-28.7 192-64v-51.6c-41.3 34-116.9 51.6-192 51.6S41.3 334.4 0 300.4z"></path></g></svg>
                  Affiliates
                </span>
                <span style={{ margin: "auto", width: "70%", cursor: "pointer", alignItems: "center", gap: "0.35rem", display: "flex" }} onClick={() => setOpenWallet(!openWallet)}>
                  <svg style={{height: 12.5, width: 12.5}} viewBox="0 0 14 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg" ><path d="M13.125 10.5029V11.5967C13.125 12.2 12.6341 12.6904 12.0312 12.6904H2.625C1.65987 12.6904 0.875 11.9056 0.875 10.9404C0.875 10.9404 0.875 3.50949 0.875 3.50293C0.875 2.5378 1.65987 1.75293 2.625 1.75293H10.7188C11.0814 1.75293 11.375 2.04693 11.375 2.40918C11.375 2.77143 11.0814 3.06543 10.7188 3.06543H2.625C2.38394 3.06543 2.1875 3.26143 2.1875 3.50293C2.1875 3.74443 2.38394 3.94043 2.625 3.94043H12.0312C12.6341 3.94043 13.125 4.43087 13.125 5.03418V6.12793H10.9375C9.73131 6.12793 8.75 7.10924 8.75 8.31543C8.75 9.52162 9.73131 10.5029 10.9375 10.5029H13.125Z"></path><path d="M13.125 7.00293V9.62793H10.9375C10.2126 9.62793 9.625 9.04037 9.625 8.31543C9.625 7.59049 10.2126 7.00293 10.9375 7.00293H13.125Z"></path></svg>
                  Wallet
                </span>
                <span style={{ margin: "auto", width: "70%", cursor: "pointer", alignItems: "center", gap: "0.35rem", display: "flex" }} onClick={() => setOpenSupport(!openSupport)}>
                  <svg style={{height: 12.5, width: 12.5}} role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm173.696 119.559l-63.399 63.399c-10.987-18.559-26.67-34.252-45.255-45.255l63.399-63.399a218.396 218.396 0 0 1 45.255 45.255zM256 352c-53.019 0-96-42.981-96-96s42.981-96 96-96 96 42.981 96 96-42.981 96-96 96zM127.559 82.304l63.399 63.399c-18.559 10.987-34.252 26.67-45.255 45.255l-63.399-63.399a218.372 218.372 0 0 1 45.255-45.255zM82.304 384.441l63.399-63.399c10.987 18.559 26.67 34.252 45.255 45.255l-63.399 63.399a218.396 218.396 0 0 1-45.255-45.255zm302.137 45.255l-63.399-63.399c18.559-10.987 34.252-26.67 45.255-45.255l63.399 63.399a218.403 218.403 0 0 1-45.255 45.255z"></path></svg>
                  Support
                </span>
                <span style={{ margin: "auto", width: "70%", color: "#FF4040", cursor: "pointer", alignItems: "center", gap: "0.35rem", display: "flex" }} onClick={logout}>
                  <svg style={{height: 12.5, width: 12.5}} role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z"></path></svg>
                  Logout
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className={classes.login}>
            <div className={classes.popupButton} onClick={() => setOpenLogin(!openLogin)}>
                <svg className={classes.buttonIcon} tabIndex="-1" viewBox="0 0 512 512"><path d="M416 448h-84c-6.6 0-12-5.4-12-12v-24c0-6.6 5.4-12 12-12h84c26.5 0 48-21.5 48-48V160c0-26.5-21.5-48-48-48h-84c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h84c53 0 96 43 96 96v192c0 53-43 96-96 96zM167.1 83.5l-19.6 19.6c-4.8 4.8-4.7 12.5.2 17.1L260.8 230H12c-6.6 0-12 5.4-12 12v28c0 6.6 5.4 12 12 12h248.8L147.7 391.7c-4.8 4.7-4.9 12.4-.2 17.1l19.6 19.6c4.7 4.7 12.3 4.7 17 0l164.4-164c4.7-4.7 4.7-12.3 0-17l-164.4-164c-4.7-4.6-12.3-4.6-17 .1z"></path></svg>
                Sign in   
            </div>
          </div>
        )}
      </Toolbar>
    </AppBar>
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