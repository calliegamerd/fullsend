import React, { useState, useEffect, Fragment } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { connect, useSelector, useStore } from "react-redux";
import { useToasts } from "react-toast-notifications";
import PropTypes from "prop-types";
import parseCommasToThousands from "../utils/parseCommasToThousands";
import cutDecimalPoints from "../utils/cutDecimalPoints";
import { useHistory } from 'react-router-dom';
import CircularProgress from "@material-ui/core/CircularProgress";
import { motion, AnimatePresence, animationControls } from "framer-motion";
import { Divider, Grow, Slide, useScrollTrigger } from "@material-ui/core";
import Slider from '@mui/material/Slider';
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { getCurrentSeedPair } from "../services/api.service";
import Provably from "../components/modals/upgrader/ProvablyModal";
import { upgraderSocket } from "../services/websocket.service";
import CountUp from 'react-countup';
import confetti from 'canvas-confetti';
import confettiSound1 from "../assets/small_celebration.wav";
import upgraderSound from "../assets/sounds/upgrader.mp3";

import Coin from "../assets/icons/coin.png";
import Gold from "../assets/colors/gold.png";
import Red from "../assets/colors/red.png";
import Purple from "../assets/colors/purple.png";
import Blue from "../assets/colors/blue.png";
import Grey from "../assets/colors/grey.png";
import GoldBG from "../assets/colors/goldbg.png";
import RedBG from "../assets/colors/redbg.png";
import PurpleBG from "../assets/colors/purplebg.png";
import BlueBG from "../assets/colors/bluebg.png";
import GreyBG from "../assets/colors/greybg.png";
import GoldBlob from "../assets/colors/goldblob.png";
import RedBlob from "../assets/colors/redblob.png";
import PurpleBlob from "../assets/colors/purpleblob.png";
import BlueBlob from "../assets/colors/blueblob.png";
import GreyBlob from "../assets/colors/greyblob.png";

const confettiAudio1 = new Audio(confettiSound1);
confettiAudio1.volume = 0.075;
const selectAudio = new Audio(upgraderSound);

const playSound = audioFile => {
  audioFile.play();
};

function calculateAngle(ticketNumber) {
  const maxTicketNumber = 1000000001;
  return (ticketNumber / maxTicketNumber) * 360;
};

function hexToRGBA(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const items = [
  {
    "name": "Mixed Gemstone Stering Silver Ring",
    "price": 1973.33,
    "color": "gold",
    "image": "https://i.postimg.cc/jSFqYBPH/Removal-845-1-1.png",
  },
  {
    "name": "Chrome Hearts Plus Cross Allover Print Horseshoe Logo Hoodie 'Black'",
    "price": 1000,
    "color": "gold",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/087/710/933/original/1190103_00.png.png?action=crop&width=360",
  },
  {
    "name": "Acer Gaming Desktop Predator Orion 3000",
    "price": 949,
    "color": "gold",
    "image": "https://c1.neweggimages.com/ProductImageCompressAll300/83-101-901-19.png",
  },
  {
    "name": "BAPE Type 1 Bapex 'Green'",
    "price": 820,
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/081/483/898/original/1089405_00.png.png?action=crop&width=360",
    "color": "gold",
  },
  {
    "name": "Bottega Veneta Ski Goggles 'Green'",
    "price": 785,
    "color": "gold",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/079/652/190/original/1063266_00.png.png?action=crop&width=360",
  },
  {
    "name": "Saint Laurent Tiny Cassandre Credit Card Wallet 'Greyish Brown'",
    "price": 443,
    "color": "gold",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/092/195/372/original/1268717_00.png.png?action=crop&width=360",
  },
  {
    "name": "PS5 Console White",
    "price": 373,
    "color": "gold",
    "image": "https://i.postimg.cc/bNXrNkMN/Untitled.png",
  },

  {
    "name": "Casio GShock Dragonball Z GA-110JDB1A4",
    "price": 307.3,
    "color": "gold",
    "image": "https://i.postimg.cc/pLvDyprz/removal.png",
  },
  {
    "name": "Apple Watch Series 5 (GPS + Cellular, 40MM)",
    "price": 301.3,
    "color": "gold",
    "image": "https://i.postimg.cc/43thXGbn/Untitled.png",
  },
  {
    "name": "Apple IPHONE 11 Matte Black Fullsize",
    "price": 291,
    "color": "gold",
    "image": "https://i.postimg.cc/WbWZnX1p/Untitled.png",
  },
  {
    "name": "The Powerpuff Girls x Dunk Low Pro SB QS 'Buttercup'",
    "price": 283,
    "color": "gold",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/095/942/929/original/1252845_00.png.png?width=100",
  },
  {
    "name": "Nike Air Force 1 Low Multi-Swoosh Black Crimson",
    "price": 276,
    "color": "gold",
    "image": "https://postimg.cc/1ggCGfRH",
  },
  {
    "name": "Air Jordan 1 Retro High '85 OG 'Metallic Burgundy'",
    "price": 241,
    "color": "gold",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/096/293/508/original/BQ4422_161.png.png?width=100",
  },
  {
    "name": "Kobe 8 Protro 'Radiant Emerald'",
    "price": 228,
    "color": "red",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/097/654/763/original/1210578_00.png.png?width=100",
  },
  {
    "name": "Zoom Kobe 6 Protro 'Reverse Grinch'",
    "price": 219,
    "color": "red",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/095/313/945/original/1124766_00.png.png?width=100",
  },
  {
    "name": "Air Jordan 3 Retro SE 'Craft Ivory'",
    "price": 212,
    "color": "red",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/097/217/890/original/1301503_00.png.png?width=100",
  },
  {
    "name": "GIGABYTE X670E AORUS PRO X AM5 AMD Motherboard",
    "price": 210,
    "color": "purple",
    "image": "https://c1.neweggimages.com/ProductImageCompressAll300/13-145-485-01.png",
  },
  {
    "name": "Sp5der Beluga Hoodie 'Grey'",
    "price": 200,
    "color": "purple",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/087/250/471/original/1185693_00.png.png?action=crop&width=360",
  },
  {
    "name": "Burberry Collared Sweater",
    "price": 198,
    "color": "purple",
    "image": "https://postimg.cc/Y43cP4Bw",
  },
  {
    "name": "Air Foamposite One 'Anthracite' 2023",
    "price": 192,
    "color": "purple",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/094/716/194/original/1277513_00.png.png?width=100",
  },
  {
    "name": "Air Jordan 3 Retro 'Fear' 2023",
    "price": 167,
    "color": "purple",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/094/065/966/original/1128539_00.png.png?width=100",
  },
  {
    "name": "Air Max Plus OG 'Voltage Purple' 2024",
    "price": 162,
    "color": "purple",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/097/304/814/original/1304924_00.png.png?width=100",
  },
  {
    "name": "BAPE Color Camo Big Ape Head Tee 'Black/Red'",
    "price": 156,
    "color": "purple",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/062/284/193/original/837549_00.png.png?action=crop&width=750",
  },
  {
    "name": "Acer 27in 170Hz 2K Gaming Monitor",
    "price": 155,
    "color": "purple",
    "image": "https://c1.neweggimages.com/ProductImageCompressAll300/24-011-452-01.png",
  },
  {
    "name": "Apple Pencil (2nd generation)",
    "price": 153,
    "color": "purple",
    "image": "https://i.postimg.cc/6qBZHPZq/removal.png",
  },
  {
    "name": "Jean Paul Gaultier La Belle Eau de Parfum Spray 100ml",
    "price": 144.3,
    "color": "purple",
    "image": "https://i.postimg.cc/P550ZFvX/removal.png",
  },
  {
    "name": "A Ma Maniére x Wmns Air Jordan 5 Retro 'Dawn'",
    "price": 137.3,
    "color": "purple",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/095/078/025/original/1243222_00.png.png?width=100",
  },
  {
    "name": "Apple Airpod Pro 2nd Generation White",
    "price": 135.3,
    "color": "purple",
    "image": "https://i.postimg.cc/m28YnT8s/Untitled.png",
  },
  {
    "name": "Burberry Striped Bucket Hat",
    "price": 133.3,
    "color": "purple",
    "image": "https://i.postimg.cc/43HffwQr/removal-ai-6b33c3cf-8441-4b95-ab92-01b8a7cc0993-image-1-1.png",
  },
  {
    "name": "Chrome Hearts Underwear",
    "price": 133.0,
    "color": "purple",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/074/556/346/original/994931_00.png.png?action=crop&width=360",
  },
  {
    "name": "Corsair MP600 CORE XT SSD",
    "price": 132,
    "color": "purple",
    "image": "https://c1.neweggimages.com/ProductImageCompressAll300/20-236-988-01.png",
  },
  {
    "name": "Acer Nitro 31.5in Gaming Monitor Curved",
    "price": 125,
    "color": "purple",
    "image": "https://c1.neweggimages.com/ProductImageCompressAll300/24-011-456-04.png",
  },
  {
    "name": "Wmns Air Force 1 Low 'Valentine's Day 2024'",
    "price": 121,
    "color": "purple",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/097/948/373/original/1362888_00.png.png?action=crop&width=360",
  },
  {
    "name": "CORSAIR XTM70 Performance Thermal Paste",
    "price": 115,
    "color": "purple",
    "image": "https://c1.neweggimages.com/ProductImageCompressAll300/35-181-325-01.png",
  },
  {
    "name": "AMP All In Hoodie",
    "price": 114,
    "color": "purple",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/087/250/471/original/1185693_00.png.png?action=crop&width=360",
  },
  {
    "name": "Nike LeBron 3 The Shop Black University Red (2022)",
    "price": 114,
    "color": "purple",
    "image": "https://i.postimg.cc/0jKzXCBh/removal.png",
  },
  {
    "name": "Apple Magic Keyboard White FullSize Keyboard",
    "price": 103,
    "color": "purple",
    "image": "https://m.media-amazon.com/images/I/71i+D5oZPWL._AC_SX679_.jpg",
  },
  {
    "name": "Apple Iphone 8 with HomeButton Rose",
    "price": 102.5,
    "color": "purple",
    "image": "https://i.postimg.cc/KvZ7Q17f/Untitled.png",
  },
  {
    "name": "BAPE Big Ape Head Tee 'Beige'",
    "price": 102,
    "color": "purple",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/059/873/060/original/815982_00.png?action=crop&width=600",
  },
  {
    "name": "$100 Uber Eats Digital Card",
    "price": 100,
    "color": "purple",
    "image": "https://i.postimg.cc/25KPwFRs/Untitled.png",
  },
  {
    "name": "Trident 32GB (2x16) RAM RGB DDR5",
    "price": 92,
    "color": "purple",
    "image": "https://c1.neweggimages.com/ProductImageCompressAll300/20-374-351-10.png",
  },
  {
    "name": "Air Force 1 '07 'Triple White'",
    "price": 89,
    "color": "blue",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/048/340/054/original/712867_00.png.png?action=crop&width=360",
  },
  {
    "name": "Dunk Low 'Polar Blue'",
    "price": 83,
    "color": "blue",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/093/184/220/original/1173790_00.png.png?action=crop&width=360",
  },
  {
    "name": "Jimmy Choo Urban Hero Eau de Parfum Spray 50ml",
    "price": 79,
    "color": "blue",
    "image": "https://i.postimg.cc/9XPkkjGX/removal.png",
  },
  {
    "name": "Gucci Socks 'Camel/Dark Green'",
    "price": 74,
    "color": "blue",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/093/126/707/original/1097215_00.png.png?action=crop&width=360",
  },
  {
    "name": "Supreme Handcuffs Keychain Silver",
    "price": 71,
    "color": "blue",
    "image": "https://i.postimg.cc/qqN1m900/removal.png",
  },
  {
    "name": "Supreme Glass Spray Bottle Red",
    "price": 66,
    "color": "blue",
    "image": "https://i.postimg.cc/nhb3kRWb/removal.png",
  },
  {
    "name": "Supreme Spitfire Skate Tool Red",
    "price": 61,
    "color": "blue",
    "image": "https://i.postimg.cc/Kzzfzd1L/removal.png",
  },
  {
    "name": "Fear of God Essentials Sweatpants 'Stretch Limo'",
    "price": 60,
    "color": "blue",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/073/921/807/original/986347_00.png.png?action=crop&width=360",
  },
  {
    "name": "Book: Dior By Dior",
    "price": 59,
    "color": "blue",
    "image": "https://i.postimg.cc/xjRPVjqC/removal.png",
  },
  {
    "name": "Lemaire Mini Drop Earring 'Silver'",
    "price": 52,
    "color": "blue",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/077/938/631/original/1036902_00.png.png?action=crop&width=360",
  },
  {
    "name": "Lemaire Mini Drop Earring 'Gold'",
    "price": 51,
    "color": "blue",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/094/019/147/original/1257652_00.png.png?action=crop&width=360",
  },
  {
    "name": "Stussy Stock Tone Logo Tee 'Red'",
    "price": 48,
    "color": "blue",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/058/741/834/original/806236_00.png.png?action=crop&width=360",
  },
  {
    "name": "Fear of God Essentials Hoodie 'Light Oatmeal'",
    "price": 47,
    "color": "blue",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/073/921/741/original/986342_00.png.png?action=crop&width=360",
  },
  {
    "name": "Supreme Audubon Bird Call Red",
    "price": 46,
    "color": "blue",
    "image": "https://i.postimg.cc/xCzRMLPT/removal.png",
  },
  {
    "name": "Market Smiley Sun Dye Sweatpants 'Yellow Blue Tie Dye'",
    "price": 41,
    "color": "blue",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/070/284/539/original/923343_00.png.png?action=crop&width=360",
  },
  {
    "name": "Pleasures Puppies Hoodie 'Black'",
    "price": 39,
    "color": "blue",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/085/739/377/original/1091523_00.png.png?action=crop&width=360",
  },
  {
    "name": "Fear of God Essentials Sweatpants 'Dark Oatmeal'",
    "price": 38.9,
    "color": "blue",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/073/921/802/original/986345_00.png.png?action=crop&width=360",
  },
  {
    "name": "Wii Console with Controller and Strap",
    "price": 35,
    "color": "blue",
    "image": "https://i.postimg.cc/DfGpR4XK/Untitled.png",
  },
  {
    "name": "Off-White New Logo Face Mask Black/White",
    "price": 33.75,
    "color": "blue",
    "image": "https://i.postimg.cc/FHwND44F/Removal-87-1-1.png",
  },
  {
    "name": "Razer DeathAdder Essential Gaming Mouse",
    "price": 33,
    "color": "blue",
    "image": "https://i.postimg.cc/CxxzWYXj/removal.png",
  },
  {
    "name": "Mr Beast Basketball",
    "price": 32,
    "color": "blue",
    "image": "https://i.postimg.cc/g0wnNWBN/removal.png",
  },
  {
    "name": "Market Cali Lock Gradient Sweatpants 'Black Overdye/Bodye'",
    "price": 31,
    "color": "blue",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/070/284/582/original/923353_00.png.png?action=crop&width=360",
  },
  {
    "name": "Supreme Audubon Bird Call Red",
    "price": 46,
    "color": "blue",
    "image": "https://i.postimg.cc/xCzRMLPT/removal.png",
  },
  {
    "name": "Palace Polartec Powerstretch Gloves 'Orange'",
    "price": 21,
    "color": "blue",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/093/630/347/original/1292495_00.png.png?action=crop&width=360",
  },
  {
    "name": "Advisory Board Crystals Hologram Beanie 'Green'",
    "price": 19,
    "color": "blue",
    "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/093/908/132/original/1241536_00.png.png?action=crop&width=360",
  },
  {
    "name": "Bape Crew socks, Red",
    "price": 15,
    "color": "blue",
    "image": "https://i.postimg.cc/NGnGCmYk/Removal-304-1.png",
  },
  {
    "name": "CROCS THE OFFICE DUNDER MIFFLIN LOGO CHARM",
    "price": 7,
    "color": "blue",
    "image": "https://i.postimg.cc/D0pcL5bD/Removal-207-1-1-removebg-preview.png",
  },
  {
    "name": "Fullsend $2.50 Voucher",
    "price": 2.5,
    "color": "blue",
    "image": "https://i.postimg.cc/VsJ4cPQP/Untitled.png320d93d4d5de31ea95528cc20b7d706908862585b18ee7428c0f0dadfe&format=webp&quality=lossless&",
  },
  {
    "name": "Fullsend $1.00 Voucher",
    "price": 1,
    "color": "grey",
    "image": "https://i.postimg.cc/fb6njjYV/Untitled.png96d6b91c464354be4c67be6790642cf7c54d3f1fcfcb74189c13d4310e&format=webp&quality=lossless&",
  },
  {
    "name": "Fullsend $0.50 Voucher",
    "price": 0.5,
    "color": "grey",
    "image": "https://i.postimg.cc/rw7RW3Zx/Untitled.png558855a780135adef6d6c9174d2c3783a109c09997cec7a2f8ca8a4ee2&format=webp&quality=lossless&",
  },
  {
    "name": "Fullsend $0.25 Voucher",
    "price": 0.25,
    "color": "grey",
    "image": "https://i.postimg.cc/QxpQXXfw/Untitled.png7171339a2992186728433d1ebc595e2e78cb254086fc883242ece7499b&format=webp&quality=lossless&",
  },
  {
    "name": "Fullsend $0.01 Voucher",
    "price": 0.01,
    "color": "grey",
    "image": "https://i.postimg.cc/5tr82jL5/Untitled.pnge40a3558400403cbb4e92e3a7db9d4bac002165df68159e33cdc341ea&format=webp&quality=lossless&",
  },
];

const ColorCircularProgress = withStyles({
  root: {
    color: "#fff !important",
  },
})(CircularProgress);

const BetInput = withStyles({
  root: {
    width: "100%",
    marginTop: "auto",
    border: "1px solid transparent",
    background: "#1A1B33",
    borderRadius: "5px",
    overflow: "hidden",
    "& :before": {
      display: "none",
    },
    "& :after": {
      display: "none",
    },
    "& label": {
      color: "#323956",
      fontSize: 15,
    },
    "& div input": {
      color: "#e4e4e4",
      fontFamily: "Poppins",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
      padding: "0rem 0rem",
    },
    "& div": {
      height: "2.5rem",
      borderRadius: 4,
    },
    "&:hover": {
    }
  }
})(TextField);

const useStyles = makeStyles(theme => ({
  root: {
    color: "#fff",
    fontFamily: "Poppins",
    overflowY: "scroll",
    scrollbarWidth: "none",
    height: "100%",
    width: "100%",
    maxWidth: "1355px",
    margin: "0 auto"
  },
  loader: {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  itemsContainer: {
    marginTop: "0.5rem",
    //background: "#101123",
    borderRadius: "0.25rem",
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)", 
    gap: "1rem",
    //padding: "0.5rem",
  },
  bigItemBox: {
    width: "300px",
    height: "200px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative", 
    borderRadius: "0.5rem", 
    overflow: "hidden", 
    backgroundSize: "cover",
    backgroundPosition: "center", 
  },
  bigItemImage: {
    width: "200px",
    height: "200px",
    objectFit: "contain",
    zIndex: 2
  },
  bigItemColor: {
    width: "300px",
    height: "auto",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1
  },
  itemBox: {
    width: "210px",
    height: "120px",
    cursor: "pointer",
    backgroundColor: "#0A0B1C",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative", 
    borderRadius: "0.5rem", 
    overflow: "hidden", 
    backgroundSize: "cover",
    backgroundPosition: "center", 
  },
  itemImage: {
    width: "100px",
    height: "75px",
    objectFit: "contain",
    zIndex: 2
  },
  itemColor: {
    width: "150px",
    height: "auto",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1
  },
  itemPrice: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    gap: "0.3rem",
    padding: "0.25rem 0.5rem",
    fontSize: "12px",
    borderTopRightRadius: "0.25rem",
    borderBottomRightRadius: "0.25rem",
    bottom: 10,
    left: 0,
    fontWeight: 500
  },
  topContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "1rem", 
    gap: "2rem",
  },
  balanceControllerBox: {
    position: "relative",
    background: "#101123",
    borderRadius: "0.25rem",
    flex: "1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  upgraderBox: {
    height: "25rem",
    width: "25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    position: "relative"
  },
  progressCircle: {
    position: "absolute",
    height: "290px",
    width: "290px",
  },
  spinnerMirror: {
    borderRadius: "50%",
    position: "absolute",
    height: "278px",
    width: "278px",
    zIndex: 1,
    transition: `all 5s cubic-bezier(0.05, 0.1, 0.1, 1)`
  },
  spinnerSelector: {
    position: "absolute",
    top: "-20px",
    left: "50%",
    transform: "translate(-50%, -25%)",
  },
  upgraderCircle: {
    background: "#0A0B1C",
    borderRadius: "50%",
    height: "278px",
    width: "278px",
    border: "1px solid #222333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2
  },
  upgraderContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    width: "144px",
    textAlign: "center"
  },
  itemControllerBox: {
    borderRadius: "0.25rem",
    flex: "1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },
  inputIcon: {
    marginTop: "0 !important",
    color: "#fff",
    background: "transparent !important",
  },
  balanceContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    width: "20rem",
    textAlign: "center"
  },
  provablyFairButton: {
    padding: "0.5rem 0.75rem",
    backgroundColor: "hsl(215, 75%, 50%)",
    position: "absolute",
    bottom: 10,
    right: 10,
    borderRadius: "0.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer"
  },
  upgradeText: {
    fontWeight: 500,
    fontSize: 14,
    marginBottom: "0.5rem"
  },
  percentContainer: {
    display: "flex",
    gap: "0.25rem"
  },
  percentBox: {
    flexGrow: "1",
    borderRadius: "0.25rem",
    padding: "0.5rem 0",
    fontWeight: 500,
    cursor: "pointer",
    useSelect: "none"
  },
  OverAndUnder: {
    position: "absolute",
    bottom: -15,
    display: "flex",
    textAlign: "center",
    flexDirection: "column",
    cursor: "pointer",
    marginTop: "1.5rem",
    userSelect: "none"
  },
  upgradeButton: {
    padding: "0.5rem 0rem",
    width: "100%",
    backgroundColor: "hsl(215, 75%, 50%)",
    borderRadius: "0.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontWeight: 500
  },
  percentText: {
    fontWeight: 500,
    fontSize: 20
  },
  multiplierText: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    top: 10,
    left: 10,
    fontWeight: 500
  },
  itemNameText: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    alignItems: "end",
    bottom: 10,
    right: 10,
    fontWeight: 500
  },
  canvas: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    pointerEvents: "none",
    zIndex: 10000,
  },
}));

const Upgrader = ({ user, isAuthenticated }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [clientSeed, setClientSeed] = useState("clientseed");
  const [serverSeedHashed, setServerSeedHashed] = useState("serverseedhashed");
  const [nonce, setNonce] = useState(0);
  const [openProvably, setOpenProvably] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [betAmount, setBetAmount] = useState(0);
  const [isUnder, setIsUnder] = useState(true);
  const [rotateEndpoint, setRotateEndpoint] = useState(0);
  let ROTATE_ENDPOINT = 0;
  const [multiplier, setMultiplier] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [tickets, setTickets] = useState({
    low: 0,
    high: 0
  });
  const [lastTicket, setLastTicket] = useState(0);
  const [previous, setPrevious] = useState(0);
  const [selectedItem, setSelectedItem] = useState({
    name: null,
    price: 0,
    image: null,
    color: null,
    blob: null,
    hex: null
  });

  const updateTicketRange = (perc, under) => {
    const maxTicketNumber = 1;
    if (!under) {
      setTickets({
        low: Math.abs((perc / 100) * maxTicketNumber - 1),
        high: maxTicketNumber - 1,
      });
    } else {
      setTickets({
        low: maxTicketNumber - 1,
        high: (perc / 100) * maxTicketNumber,
      });
    }
  };

  const triggerUpgrader = () => {
    try {
      setUpgrading(true);
      upgraderSocket.emit("upgrader:attempt", parseFloat(betAmount), selectedItem, isUnder);
    } catch (error) {
      addToast("An error occured when trying attempt the upgrade: " + error, { appearance: "error" });
    }
  };

  const triggerConfetti = () => {
    const containerCenter = document.querySelector(`#canvas-center`);
  
    if (containerCenter) {
      const confettiCenter = confetti.create(containerCenter, {
        resize: true,
      });
  
      playSound(confettiAudio1);
  
      confettiCenter({
        particleCount: 75,
        spread: 40,
        angle: 90,
        origin: {
          x: 0.5, 
          y: 1.1 
        },
      });
    }
  };

  const simulateAnimation = (data) => {
    const remainder = ROTATE_ENDPOINT % 360;
    const adding = 360 - remainder;
    const extra = 720 + ROTATE_ENDPOINT;
    const angle = calculateAngle(data.ticket)

    ROTATE_ENDPOINT = extra + angle + adding;
    setRotateEndpoint(ROTATE_ENDPOINT);
    setNonce(state => state + 1);
    setTimeout(() => {
      setPrevious(lastTicket)
      setLastTicket(data.ticket / 1000000001);
      if(data.success) triggerConfetti();
      setUpgrading(false);
    }, 5000);
  };

  const updateAll = (newBetAmount, newSliderValue, newPercentSelector) => {
    if(upgrading) return;
    if(!user || !isAuthenticated) return;
    if(!selectedItem.name) return;
    
    if(betAmount != newBetAmount) {
      if(((newBetAmount / selectedItem.price)*100).toFixed(2) > 80) return;
      setBetAmount(newBetAmount);
      newSliderValue = ((newBetAmount / user.wallet) * 100).toFixed(2);
      setSliderValue(newSliderValue);
    } else if(newSliderValue != sliderValue) {
      if((((user.wallet * (newSliderValue / 100) / selectedItem.price)*100).toFixed(2) > 80)) return;
      setSliderValue(newSliderValue);
      newBetAmount = (user.wallet * (newSliderValue / 100)).toFixed(2);
      setBetAmount((user.wallet * (newSliderValue / 100)).toFixed(2));
    } else if(newPercentSelector != sliderValue) {
      if((((user.wallet * (newPercentSelector / 100) / selectedItem.price)*100).toFixed(2) > 80)) return;
      setSliderValue(newPercentSelector);
      newBetAmount = (user.wallet * (newPercentSelector / 100)).toFixed(2);
      setBetAmount((user.wallet * (newPercentSelector / 100)).toFixed(2));
    }
    
    setMultiplier(parseCommasToThousands(((selectedItem.price / newBetAmount)*.9).toFixed(2)));
    setPercentage(parseCommasToThousands((((newBetAmount / selectedItem.price)*100)).toFixed(2)));
    updateTicketRange((((newBetAmount / selectedItem.price)*100)).toFixed(2), isUnder);
  };

  useEffect(() => {
    playSound(selectAudio);
    setMultiplier(0);
    setPercentage(0);
    setBetAmount(0.00);
    setSliderValue(0);
    updateTicketRange(0, isUnder);
  }, [selectedItem]);

  useEffect(() => {
    updateTicketRange(percentage, isUnder);
  }, [isUnder]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCurrentSeedPair();
  
        setClientSeed(response.clientSeed);
        setServerSeedHashed(response.serverSeedHash);
        setNonce(response.nonce);

        setBetAmount(0.00);
        setSliderValue(0);

        setLoading(false);
      } catch (error) {
        addToast("An error has occured when trying to get seed pair data.", { appearance: "error" });
        console.log("There was an error while loading upgrader data:", error);
      }
    };    

    const error = msg => {
      setUpgrading(false);
      addToast(msg, { appearance: "error" });
    };

    const success = msg => {
      addToast(msg, { appearance: "success" });
    };

    if(user && isAuthenticated) {
      fetchData();
    } else {
      setBetAmount(0.00);
      setSliderValue(100);
      setLoading(false);
    }

    upgraderSocket.on("upgrader:result", simulateAnimation);
    upgraderSocket.on("upgrader:success", success);
    upgraderSocket.on("upgrader:error", error);
    return () => {
      upgraderSocket.off("upgrader:result", simulateAnimation);
      upgraderSocket.off("upgrader:success", success);
      upgraderSocket.off("upgrader:error", error);
    };
  }, []);

  const getColorSet = (color) => {
    switch(color) {
      case "grey":
        return { Color: Grey, Background: GreyBG, Hex: "#91A0B1", Blob: GreyBlob }
      case "blue":
        return { Color: Blue, Background: BlueBG, Hex: "#4159CF", Blob: BlueBlob }
      case "purple":
        return { Color: Purple, Background: PurpleBG, Hex: "#703ECF", Blob: PurpleBlob }
      case "red":
        return { Color: Red, Background: RedBG, Hex: "#BF4141", Blob: RedBlob }
      case "gold":
        return { Color: Gold, Background: GoldBG, Hex: "#B69768", Blob: GoldBlob }
      default:
        return { Color: Grey, Background: GreyBG, Hex: "#91A0B1", Blob: GreyBlob }
    }
  };

  return loading ? (
    <div className={classes.loader}>
      <ColorCircularProgress />
    </div>
  ) : (
    <Grow in timeout={620}>
      <div className={classes.root}>
        <Provably 
          open={openProvably}
          handleClose={() => setOpenProvably(!openProvably)}
          serverSeedHash={serverSeedHashed}
          clientSeed={clientSeed}
          nonce={nonce}
        />
        <div className={classes.topContainer}>
          <div className={classes.balanceControllerBox}>
            <div className={classes.balanceContainer}>
              <div className={classes.upgradeText}>Use your balance to upgrade!</div>
              <BetInput
                type="number"
                label=""
                variant="filled"
                value={betAmount}
                onChange={(e) => updateAll(e.target.value, sliderValue, sliderValue)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      className={classes.inputIcon}
                      position="start"
                    >
                      <img style={{height: 17, width: 17}} src={Coin} />
                    </InputAdornment>
                  ),
                }}
              />
              <Slider
                value={sliderValue}
                onChange={(e) => updateAll(betAmount, e.target.value, e.target.value)}
                aria-label="My slider"
                defaultValue={50} 
                valueLabelDisplay="auto"
                step={0.01} 
                min={0} 
                max={100}
              />
              <div className={classes.percentContainer}> 
                <motion.div 
                  animate={{ filter: "brightness(100%)" }} 
                  whileHover={{ filter: "brightness(85%)" }} 
                  className={classes.percentBox} 
                  onClick={() => updateAll(betAmount, sliderValue, 10)}
                  style={{
                    color: sliderValue == 10 ? "#fff" : "#9E9FBD",
                    backgroundColor: sliderValue == 10 ? "hsl(215, 75%, 50%)" : "#1A1B33"
                  }}
                >
                  10%
                </motion.div>
                <motion.div 
                  animate={{ filter: "brightness(100%)" }} 
                  whileHover={{ filter: "brightness(85%)" }} 
                  className={classes.percentBox} 
                  onClick={() => updateAll(betAmount, sliderValue, 25)}
                  style={{
                    color: sliderValue == 25 ? "#fff" : "#9E9FBD",
                    backgroundColor: sliderValue == 25 ? "hsl(215, 75%, 50%)" : "#1A1B33"
                  }}
                >
                  25%
                </motion.div>
                <motion.div 
                  animate={{ filter: "brightness(100%)" }} 
                  whileHover={{ filter: "brightness(85%)" }} 
                  className={classes.percentBox} 
                  onClick={() => updateAll(betAmount, sliderValue, 30)}
                  style={{
                    color: sliderValue == 30 ? "#fff" : "#9E9FBD",
                    backgroundColor: sliderValue == 30 ? "hsl(215, 75%, 50%)" : "#1A1B33"
                  }}
                >
                  30%
                </motion.div>
                <motion.div 
                  animate={{ filter: "brightness(100%)" }} 
                  whileHover={{ filter: "brightness(85%)" }} 
                  className={classes.percentBox} 
                  onClick={() => updateAll(betAmount, sliderValue, 50)}
                  style={{
                    color: sliderValue == 50 ? "#fff" : "#9E9FBD",
                    backgroundColor: sliderValue == 50 ? "hsl(215, 75%, 50%)" : "#1A1B33"
                  }}
                >
                  50%
                </motion.div>
              </div>
            </div>
            <motion.div className={classes.provablyFairButton} whileTap={{ scale: 0.97 }} animate={{ filter: "brightness(100%)" }} whileHover={{ filter: "brightness(85%)" }} onClick={() => setOpenProvably(!openProvably)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18" fill="none"><path d="M12.4702 6.75L9.30354 9.75L7.7202 8.25M16.4285 7.62375C16.4285 12.55 12.4955 14.7586 10.8281 15.4735L10.826 15.4744C10.6506 15.5496 10.5628 15.5873 10.3635 15.6197C10.2373 15.6403 9.95389 15.6403 9.8277 15.6197C9.62765 15.5872 9.53882 15.5494 9.36212 15.4735C7.69471 14.7586 3.76187 12.55 3.76187 7.62375V4.65015C3.76187 3.81007 3.76187 3.38972 3.93445 3.06885C4.08624 2.7866 4.32829 2.5573 4.62621 2.41349C4.9649 2.25 5.40861 2.25 6.29536 2.25H13.8954C14.7821 2.25 15.2249 2.25 15.5636 2.41349C15.8615 2.5573 16.1043 2.7866 16.2561 3.06885C16.4285 3.3894 16.4285 3.80924 16.4285 4.64768V7.62375Z" stroke="white" stroke-width="1.5" stroke-linecap="round" strokeLinejoin="round"/></svg>
            </motion.div>
          </div>
          <div className={classes.upgraderBox}>
            <canvas id={`canvas-center`} className={classes.canvas}></canvas>
            <motion.div className={classes.spinnerMirror} style={{ transform: `rotate(${rotateEndpoint}deg)`}}>
              <svg className={classes.spinnerSelector} width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M25.8233 0.25H2.98657C1.4147 0.25 0.442158 1.96294 1.24768 3.31273L12.666 22.4462C13.4516 23.7625 15.3582 23.7625 16.1438 22.4462L27.5622 3.31273C28.3677 1.96294 27.3951 0.25 25.8233 0.25Z" fill="white"></path></svg>            </motion.div>
              <div style={{ transform: isUnder ? "none" : "scaleX(-1)", height: "290px", width: "290px", position: "absolute" }}>
                <CircularProgressbar
                  value={percentage}
                  className={classes.progressCircle}
                  styles={buildStyles({
                    strokeLinecap: 'butt',
                    pathColor: `hsl(215, 75%, 50%)`,
                    trailColor: '#222333',
                  })}
                />
              </div>
            <div className={classes.upgraderCircle}>
              <div className={classes.upgraderContainer}>
                <div className={classes.percentText}>{(parseFloat(percentage)).toFixed(2)}<span style={{ color: "hsl(215, 75%, 50%)" }}>%</span></div>
                <motion.div 
                  whileTap={{ scale: 0.97 }} 
                  className={classes.upgradeButton} 
                  onClick={() => triggerUpgrader()}
                  style={{
                    pointerEvents: upgrading ? "none" : "all", 
                    opacity: upgrading ? 0.5 : 1, 
                    cursor: upgrading ? "not-allowed" : "pointer" 
                  }}
                >
                  {upgrading ? "Upgrading..." : "Upgrade"}
                </motion.div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#9E9FBD", marginTop: "0.25rem"}}>{tickets.low.toFixed(4)} - {tickets.high.toFixed(4)}</div>
              </div>
            </div>
            <motion.div className={classes.OverAndUnder} whileTap={{ scale: 0.97 }} onClick={() => setIsUnder(state => upgrading ? state : !isUnder)}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 500, fontSize: 18, color: "#9E9FBD"}}>
                <motion.svg style={{ rotate: isUnder ? 180 : 0, transitionDuration: "200ms" }} xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M18.2205 4.18331C18.5796 3.83466 19.1533 3.8431 19.502 4.20218L23.6084 8.43134C23.9498 8.78297 23.9498 9.34232 23.6084 9.69396L19.502 13.9231C19.1533 14.2822 18.5796 14.2907 18.2205 13.9419C17.8615 13.5933 17.853 13.0196 18.2016 12.6605L20.8151 9.96888H6.04154C5.54103 9.96888 5.13529 9.56315 5.13529 9.06263C5.13529 8.56213 5.54103 8.15638 6.04154 8.15638H20.8151L18.2016 5.46481C17.853 5.10571 17.8615 4.53197 18.2205 4.18331ZM10.7792 15.058C11.1383 15.4067 11.1467 15.9804 10.7981 16.3395L8.18438 19.0313H22.9582C23.4587 19.0313 23.8645 19.4371 23.8645 19.9376C23.8645 20.4381 23.4587 20.8438 22.9582 20.8438H8.18485L10.7981 23.5351C11.1467 23.8943 11.1383 24.468 10.7792 24.8167C10.4201 25.1653 9.84637 25.1568 9.4977 24.7978L5.39131 20.5687C5.0499 20.2171 5.0499 19.6577 5.39131 19.306L9.4977 15.0769C9.84637 14.7178 10.4201 14.7094 10.7792 15.058Z" fill="#2070DF"/></motion.svg>
                Over or Under
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#9E9FBD", display: "flex", gap: "0.3rem", justifyContent: "center"}}>Ticket: 
                <CountUp
                  delay={0}
                  duration={1}
                  decimals={9}
                  start={previous}
                  end={lastTicket}
                />
              </div>
            </motion.div>
          </div>
          <motion.div 
            className={classes.itemControllerBox}
            style={{
              background: selectedItem.name ? `linear-gradient(to right, ${hexToRGBA(selectedItem.hex, 0.2)} 0%, rgba(253, 27, 98, 0) 100%) #101123` : "#101123"
            }}
          >
            <AnimatePresence>
              {selectedItem.name && (
                <motion.div
                  initial={{ opacity: 0, y: 100, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 100  , scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={classes.bigItemBox} onClick={() => setSelectedItem(state => upgrading ? state : { name: null, price: 0, image: null, color: null, blob: null, hex: null })}>
                    <img src={selectedItem.image} className={classes.bigItemImage} />
                    <img src={selectedItem.blob} className={classes.bigItemColor} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className={classes.multiplierText}>
              <div style={{ fontSize: 13, color: ""}}>Your multiplier</div>
              <div style={{ fontSize: 16, color: ""}}>{(parseFloat(multiplier)).toFixed(2)}<span style={{color: selectedItem.hex}}>x</span></div>
              <div style={{ fontSize: 13, color: "#9E9FBD"}}>{(parseFloat(percentage)).toFixed(2)}%</div>
            </div>
            <div className={classes.itemNameText}>
              <div style={{ fontSize: 13, color: ""}}>{selectedItem.name ? selectedItem.name : "Select an item"}</div>
              <div style={{display: "flex", alignItems: "center", gap: "0.3rem", fontSize: 18, fontWeight: "bold"}}>
                <img src={Coin} style={{ height: 18, width: 18}} />
                {selectedItem.name ? selectedItem.price.toFixed(2) : "0.00"}
              </div>
            </div>
          </motion.div>
        </div>
        <div>
          <div>Choose an Item</div>
          <div className={classes.itemsContainer}>
            {items.map((item, index) => {
              const { Color, Background, Hex, Blob } = getColorSet(item.color);
              return (
                <motion.div
                  key={index}
                  className={classes.itemBox}
                  onClick={() => {
                    if(selectedItem.name == item.name) {
                      setSelectedItem({
                        name: null,
                        price: 0,
                        image: null,
                        color: null,
                        blob: null,
                        hex: null
                      });
                    } else {
                      setSelectedItem({
                        name: null,
                        price: 0,
                        image: null,
                        color: null,
                        blob: null,
                        hex: null
                      });     
                      setBetAmount(0);
                      setSliderValue(0);
                      setPercentage(0);
                      setMultiplier(0);
                      setSelectedItem({ ...item, blob: Blob, hex: Hex });
                    }
                  }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    backgroundImage: `url(${Background})`,
                    filter: selectedItem.name == item.name ? "brightness(75%)" : "brightness(100%)",
                    border: selectedItem.name == item.name ? "1px solid #222333" : ""
                  }}
                >
                  <img src={item.image} alt={item.name} className={classes.itemImage} />
                  <img src={Blob} alt={item.color} className={classes.itemColor} />
                  <div className={classes.itemPrice} style={{ backgroundColor: Hex }}>
                    <img src={Coin} alt="Coin" style={{height: 12.5, width: 12.5}} />
                    {parseCommasToThousands(item.price.toFixed(2))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </Grow>
  );
};

Upgrader.propTypes = {
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Upgrader);
