import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from '@material-ui/core';
import { casesSocket } from "../services/websocket.service";
import { useToasts } from "react-toast-notifications";
import parseCommasToThousands from "../utils/parseCommasToThousands";
import { getCase } from "../services/api.service";
import { useHistory } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Grow } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import coin from "../assets/icons/coin.png";

import error from "../assets/sounds/error.mp3";
const errorAudio = new Audio(error);

const playSound = audioFile => {
  audioFile.play();
};

const ColorCircularProgress = withStyles({
  root: {
    color: "#fff !important",
  },
})(CircularProgress);

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    gap: "0.5rem",
    maxWidth: "1250px",
    margin: "0 auto",
    color: "#fff",
    overflowY: "scroll",
    scrollbarWidth: "none"
  },
  reelContainer: {
    padding: "1rem 0",
    backgroundColor: "#0A0B1C",
    overflow: "hidden",
    justifyContent: "center",
    display: "flex",
    borderTopLeftRadius: "0.5rem",
    borderTopRightRadius: "0.5rem",
  },
  reel: {
    display: "flex",
    position: "relative",
    alignItems: "center",
    padding: "3rem 0"
  },
  reelSelector: {
    left: "50%",
    backgroundColor: "#fff",
    borderRadius: "0.4rem",
    height: "50px",
    position: "absolute",
    width: "1px",
    zIndex: 1,
    transform: "translate(-50%, 0)",
    transitionDuration: "300ms"
  },
  reelItemSecondContainer: {
    width: "100px",
    height: "0px",
    paddingTop: "100px",
    overflow: "hidden",
    position: "relative",
    display: "flex",
  },
  reelItemImage: {
    height: "auto",
    left: "50%",
    position: "absolute",
    right: 0,
    top: "50%",
    width: "50px",
    height: "50px",
    objectFit: "contain", 
    transform: "translate(-50%,-50%)",
    zIndex: 10
  },
  reelItemContainer: {
    height: "100px",
    width: "100px",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    position: "relative",
  },
  reelItemRadialGradient: {
    opacity: .15,
    width: "100%",
    height: "100%",
    zIndex: 0,
    top: 0,
    left: 0,
    position: "absolute",
  },
  
  topBar: {
    position: "relative",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    display: "flex",
    margin: "1rem 0"
  },
  backButtonContainer2: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    color: "#808080",
    gap: "0.5rem",
    cursor: "pointer",
    transitionDuration: "300ms",
    "&:hover": {
      filter: "brightness(125%)"
    }
  },
  popupButton: {
    flex: "none",
    border: "none",
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
    display: "inline-block",
    outline: "none",
  },

  midBar: {
    position: "relative",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    display: "flex",
    backgroundColor: "#101123",
    padding: "1rem",
    borderBottomLeftRadius: "0.5rem",
    borderBottomRightRadius: "0.5rem",
  },
  openBox: {
    display: "flex",
    gap: "1rem"
  },
  openButton: {
    padding: "0.5rem 2rem",
    backgroundColor: "hsl(215, 75%, 50%)",
    borderRadius: "0.25rem",
    cursor: "pointer",
    userSelect: "none",
    color: "#fff",
    transitionDuration: "300ms",
    "&:hover": {
      filter: "brightness(120%)",
    }
  },
  demoButton: {
    padding: "0.5rem",
    backgroundColor: "hsla(0,0%,100%,.05)",
    borderRadius: "0.25rem",
    cursor: "pointer",
    userSelect: "none",
    color: "#9E9FBD",
    transitionDuration: "300ms",
    "&:hover": {
      filter: "brightness(120%)",
      backgroundColor: "hsla(0,0%,100%,.1)",
    }
  },
  costBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.3rem",
    padding: "0.5rem 1rem",
    borderRadius: "0.25rem",
    backgroundColor: "#0A0B1C",
    color: "#fff"
  },


  bottomBar: {
    position: "relative",
    display: "flex",
    width: "100%",
    overflowX: "scroll",

  },
  caseBox: {
    background: "#101123",
    height: "fit-content",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    borderRadius: "0.5rem",
    padding: "0.5rem",
    cursor: "pointer",
    transitionDuration: "300ms",
    "&:hover": {
      filter: "brightness(130%)",
    },    
    [theme.breakpoints.down("md")]: {
      padding: "0.5rem",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "0.5rem",
    },
  },
  imageContainer: {
    backgroundColor: "#0A0B1C",
    borderRadius: "0.5rem",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  caseImage: {
    width: 110
  },
  popularCasesContainer: {
    width: "100%",
    display: "flex",
    gap: "1rem"
  },

  lootTableContainer: {
    borderRadius: "0.5rem",
    overflow: "hidden"
  },
  lootBoxContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.5rem",
    backgroundColor: "#101123",
    color: "hsl(220, 22%, 85%)",
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
  itemImageContainer: {
    flex: "0 0 auto",
    position: "relative",
    margin: "0 1rem",
    width: "80px",
    height: "80px",
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      marginBottom: "0.5rem",
    },
  },
  itemImage: {
    width: "60px",
    height: "60px",
    objectFit: "contain", 
  },
  priceContainer: {
    flex: "0 0 auto",
    marginRight: "1rem",
  },
  price: {
    display: "flex",
    alignItems: "center",
    color: "#fff",
    gap: "0.3rem"
  },
  itemNameText: {
    flex: "1 1 auto",
    marginRight: "1rem",
    color: "hsl(220, 22%, 85%)",
    [theme.breakpoints.down("sm")]: {
      marginBottom: "0.5rem",
    },
  },
  itemPercentContainer: {
    flex: "0 0 auto",
    textAlign: "right",
  },
  dropRateText: {
    fontSize: 12,
    color: "hsl(220, 22%, 85%)",
  },

  detailsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    marginTop: "1rem",
    opacity: 0,
    transitionDuration: "1000ms"
  },
  itemNumber: {
    fontSize: "12px",
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: "0.5rem",
  },
  itemName2: {
    fontSize: "12px",
    color: "#ffffff",
    maxWidth: "150px",
    minWidth: "150px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
}));

const CasePage = () => {
  const classes = useStyles();
  const history = useHistory();
  const { caseSlug } = useParams();
  const { addToast } = useToasts();

  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selector, setSelector] = useState(true);

  let items = [];
  let doors = document.querySelectorAll('#door');

  const fetchData = async () => {
    try {
      const data = await getCase(caseSlug);
      setCaseData(data);
      setLoading(false);
    } catch (error) {
      console.log("There was an error while loading case data:", error);
    }
  };

  useEffect(() => {
    fetchData();  

    const error = msg => {
      addToast(msg, { appearance: "error" });
      playSound(errorAudio);
    };

    const success = msg => {
      addToast(msg, { appearance: "success" });
    };

    const open = async (x) => {
      setOpen(true);
      items = getRandomWeightedItems(x.case, 70);
      await spin({ item: x.caseResult });
      setOpen(false);
    };

    casesSocket.on("cases:error", error);
    casesSocket.on("cases:success", success);
    casesSocket.on("cases:opened", open);
    return () => {
      casesSocket.off("cases:error", error);
      casesSocket.off("cases:success", success);
      casesSocket.off("cases:opened", open);
    };
  }, []);

  const getBackgroundForItem = (item) => {
    let background = "";
    
    switch (item.color) {
        case "grey":
            background = "radial-gradient(50% 50% at 50% 50%, rgb(128, 128, 128) 0%, rgba(0, 0, 0, 0) 100%)";
            break;
        case "blue":
            background = "radial-gradient(50% 50% at 50% 50%, rgb(54, 86, 255) 0%, rgba(0, 0, 0, 0) 100%)";
            break;
        case "purple":
            background = "radial-gradient(50% 50% at 50% 50%, rgb(124, 46, 223) 0%, rgba(0, 0, 0, 0) 100%)";
            break;
        case "red":
            background = "radial-gradient(50% 50% at 50% 50%, rgb(255, 51, 51) 0%, rgba(0, 0, 0, 0) 100%)";
            break;
        case "gold":
            background = "radial-gradient(50% 50% at 50% 50%, rgb(252, 177, 34) 0%, rgba(0, 0, 0, 0) 100%)";
            break;
        default:
            background = ""; 
    }
    
    return background;
  };

  async function init(firstInit = true, groups = 1, duration = 1, data) {
    let i = 0;

    doors = document.querySelectorAll('#door');

    for (const door of doors) {
      if (firstInit) {
        door.dataset.spinned = '0';
      } else if (door.dataset.spinned === '1') {
        return;
      }

      const boxes = door.querySelector('#boxes');
      const boxesClone = boxes.cloneNode(false);
      let pool = ['❓'];

      if (!firstInit) {
        const arr = [];
        for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
          arr.push(...items);
        }
        let t = shuffle(arr);
        t.splice(25, 0, data.item);
        pool = t;
      }

      boxesClone.innerHTML = '';

      for (let i = pool.length - 1; i >= 0; i--) {
        const reelItemContainer = document.createElement('div');
        reelItemContainer.classList.add('box');
        reelItemContainer.classList.add(classes.reelItemContainer);
        reelItemContainer.dataset.index = i;
  
        const reelItemSecondContainer = document.createElement('div');
        reelItemSecondContainer.classList.add(classes.reelItemSecondContainer);
  
        const image = document.createElement('img');
        image.classList.add(classes.reelItemImage);
        image.src = pool[i].image; 

        const gradient = document.createElement('div');
        gradient.classList.add(classes.reelItemRadialGradient);
        gradient.style.background = getBackgroundForItem(pool[i]);

        reelItemSecondContainer.appendChild(gradient);
        reelItemSecondContainer.appendChild(image);
        reelItemContainer.appendChild(reelItemSecondContainer);
        boxesClone.appendChild(reelItemContainer);
      }
      
      boxesClone.style.transform = `translateX(0px)`;
      boxesClone.style.transform = `translateX(${(door.clientWidth / boxes.childElementCount) * 26}px)`;
      door.replaceChild(boxesClone, boxes);
      i++;
    }
  };

  async function spin(data) {
    init(false, 1, 2, data);

    await new Promise((resolve) => setTimeout(resolve, 50));

    let w = [];
    for (const door of doors) {
      const boxes = door.querySelector('#boxes');

      const randomPixelValue = Math.floor(Math.random() * 101) - 50;

      boxes.style.transition = `all 4.25s cubic-bezier(0.2, 0.4, 0.1, 1.0)`;
      boxes.style.transform = `translateX(-${1000 + randomPixelValue}px)`;

      const boxToSave = door.querySelector('.box[data-index="25"]');
      w.push(boxToSave);
    };

    await new Promise((resolve) => setTimeout(resolve, 4500));

    for (const door of doors) {
      const boxes = door.querySelector('#boxes');

      boxes.style.transitionDuration = `350ms`;
      boxes.style.transform = `translateX(-1000px)`;
    };

    await new Promise((resolve) => setTimeout(resolve, 350));

    let i = 0;
    for (const box of w) {
      if(!box) return;
      setSelector(false);
      box.style.transitionDuration = "300ms";
      box.style.width = "250px";
      box.style.margin = "0 1rem";
      box.style.justifyContent = "left";

      await new Promise((resolve) => setTimeout(resolve, 300));

      const number = parseCommasToThousands(parseFloat((data.item.price.toFixed(2))));


      const container = document.createElement('div');
      container.classList.add(classes.detailsContainer);

      const numberElement = document.createElement('span');
      numberElement.classList.add(classes.itemNumber);
      numberElement.textContent = `$${number}`;

      const nameElement = document.createElement('span');
      nameElement.classList.add(classes.itemName2);
      nameElement.textContent = data.item.name;

      container.appendChild(nameElement);
      container.appendChild(numberElement);
      box.appendChild(container);

      container.style.opacity = 1;

      i++;
    }
  };

  function shuffle([...arr]) {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  };

  const demoSpin = async () => {
    if(open) return;
    setSelector(true);
    setOpen(true);
    items = getRandomWeightedItems(caseData, 70);
    const ticket = ~~(Math.random() * 100_000)
    const item = caseData.items.find(
      (item) => ticket >= item.ticketsStart && ticket <= item.ticketsEnd
    );
    await spin({item: item });
    setOpen(false)
  };

  function getRandomWeightedItems(data, totalItems) {
    const itemList = data.items;
    let weightedList = [];

    for (const item of itemList) {
      const weight = item.ticketsEnd - item.ticketsStart + 1;
      for (let i = 0; i < weight; i++) {
        weightedList.push(item);
      }
    }

    for (let i = weightedList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [weightedList[i], weightedList[j]] = [weightedList[j], weightedList[i]];
    }

    return weightedList.slice(0, totalItems);
  };

  const openCase = () => {
    if(open) return;
    setSelector(true);
    setOpen(true);
    try {
      casesSocket.emit("cases:open", caseSlug);
    } catch (error) {
      addToast("Request to open case failed!", { appearance: "error" });
    }
    setOpen(false);
  };

  const copyLinkAction = () => {
    const caseLink = `https://fullsend.gg/cases/${caseSlug}`;
    navigator.clipboard.writeText(caseLink)
      .then(() => {
        addToast("Successfully copied case link!", { appearance: "success" });
      })
      .catch((error) => {
        addToast("Failed to copy case link.", { appearance: "error" });
        console.error("Error copying text to clipboard:", error);
      });
  };

  return (
    loading ? (
      <div style={{margin: "auto", display: "flex"}}>
        <ColorCircularProgress />
      </div>
    ) : (
    <Grow in timeout={620}>
      <div className={classes.root}> 
        <div className={classes.topBar}>
          <div className={classes.backButtonContainer} onClick={() => history.push(`/cases`)}>
            <div className={classes.popupButton}>
              <svg className={classes.buttonIcon} stroke="currentColor" fill="currentColor" strokeWidth="1" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"></path></svg>
              Back
            </div>
          </div>
          <div style={{gap: "0.5rem", display: "flex"}}>
            <div className={classes.popupButton} onClick={() => copyLinkAction()}>
              <svg className={classes.buttonIcon} xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"><path d="M5.848 10.18a1 1 0 0 1-.798-.98v-8a1 1 0 0 1 1-1h3.086a1 1 0 0 1 .707.293l2.414 2.414a1 1 0 0 1 .293.707V9.2a1 1 0 0 1-1 1h-5.5c-.069 0-.136-.007-.202-.02Z"></path><path d="M3.45 9.2V3.8h-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h5.5a1 1 0 0 0 1-1v-1h-2.9a2.6 2.6 0 0 1-2.6-2.6Z"></path></svg>
              Share Case
            </div>
            <div className={classes.popupButton}>
              <svg className={classes.buttonIcon} xmlns="http://www.w3.org/2000/svg" width="14" height="15" fill="none" ><path fill="currentColor" d="M12.983 3.002a.544.544 0 0 0-.108-.301.418.418 0 0 0-.245-.16C10.31 2.059 9.342 1.708 7.177.57a.379.379 0 0 0-.354 0C4.658 1.707 3.69 2.058 1.37 2.542a.418.418 0 0 0-.245.159.544.544 0 0 0-.108.3c-.103 1.908.117 3.685.656 5.282a11.265 11.265 0 0 0 1.921 3.511c1.434 1.77 2.957 2.54 3.247 2.675a.373.373 0 0 0 .322 0c.29-.136 1.813-.905 3.247-2.675a11.27 11.27 0 0 0 1.918-3.51c.538-1.598.758-3.375.655-5.282Zm-2.931 2.987L6.498 9.34a.444.444 0 0 1-.138.123.382.382 0 0 1-.168.05h-.018a.4.4 0 0 1-.3-.143l-1.32-1.504a.51.51 0 0 1-.094-.161.57.57 0 0 1 .088-.545.402.402 0 0 1 .302-.15.4.4 0 0 1 .305.142l.992 1.133 3.256-2.95c.075-.1.18-.161.294-.17a.392.392 0 0 1 .312.12c.086.087.139.21.147.341a.554.554 0 0 1-.104.363Z"></path></svg>  
              Provably Fair
            </div>
          </div>
        </div>
      
        <div className={classes.reelContainer}>
          <div className={classes.reel}>
            <div className={classes.reelSelector} style={{opacity: selector ? 1 : 0}} />
            <div id="door" style={{display: "flex"}}>
              <div id="boxes" style={{display: "flex"}}>
                {getRandomWeightedItems(caseData, 21).map((item) => {
                  return (
                    <div className={classes.reelItemContainer}>
                      <div className={classes.reelItemSecondContainer}>
                        <img className={classes.reelItemImage} src={item.image} />
                        <div className={classes.reelItemRadialGradient} style={{background: getBackgroundForItem(item)}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className={classes.midBar}>
          <div className={classes.openBox}>
            <div 
              className={classes.openButton}
              onClick={() => openCase()}
              style={{
                opacity: open ? 0.5 : 1,
                cursor: open ? "not-allowed" : "pointer",
              }}
            >Open</div>
            <div className={classes.costBox}>
              <img style={{ height: 17, width: 17 }} src={coin} />
              {parseCommasToThousands(caseData.price)}
            </div>
          </div>
          


          <div 
            className={classes.demoButton} 
            onClick={() => demoSpin()}
            style={{
              opacity: open ? 0.5 : 1,
              cursor: open ? "not-allowed" : "pointer",

            }}
          >Demo</div>
        </div>

        <div className={classes.bottomBar}>
          <div>
            <h3>This case</h3>
            <div className={classes.caseBox}>
              <div className={classes.imageContainer}>
                <img className={classes.caseImage} src={caseData.image} />
              </div>
              <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <div style={{color: "hsl(220, 22%, 85%)", fontSize: "12px"}}>{caseData.name}</div>
                <div style={{display: "flex", alignItems: "center", gap: "0.25rem"}}></div>
              </div>
            </div>
          </div>
          <div style={{marginLeft: "1rem", width: "100%"}}>
            <h3>Popular cases</h3>
            <div className={classes.popularCasesContainer}>
              {[{
    "id": "1708118018",
    "slug": "50-50",
    "name": "50/50",
    "image": "https://web.archive.org/web/20190104223531im_/https://app.mysterybrand.net/images/5b1827c73a376144a6e929ad8ab194f7.png",
    "price": 132.98,
    "items": [{
        "name": "Air Jordan 1 Retro High '85 OG 'Metallic Burgundy'",
        "price": 241,
        "color": "purple",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/096/293/508/original/BQ4422_161.png.png?width=100",
        "ticketsStart": 0,
        "ticketsEnd": 50000
      },
      {
        "name": "Bricks & Wood Logo Socks 'Olive'",
        "price": 5,
        "color": "grey",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/088/712/185/original/1209638_00.png.png?action=crop&width=360",
        "ticketsStart": 50001,
        "ticketsEnd": 100000
      }
    ]
  },
  {
    "id": "1708118452",
    "slug": "High-Roller",
    "name": "High Roller",
    "image": "https://web.archive.org/web/20190104223531im_/https://app.mysterybrand.net/images/04055ebc3ea3cc6ad36b9b608b4c8087.png",
    "price": 531.45,
    "items": [{
        "name": "Gucci GG Marmont Matelasse Super Mini Bag 'Black'",
        "price": 1148,
        "color": "gold",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/092/768/056/original/1278382_00.png.png?action=crop&width=360",
        "ticketsStart": 0,
        "ticketsEnd": 15000
      },
      {
        "name": "Chrome Hearts Plus Cross Allover Print Horseshoe Logo Hoodie 'Black'",
        "price": 1000,
        "color": "red",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/087/710/933/original/1190103_00.png.png?action=crop&width=360",
        "ticketsStart": 15001,
        "ticketsEnd": 30000
      },
      {
        "name": "BAPE Type 1 Bapex 'Green'",
        "price": 820,
        "color": "purple",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/081/483/898/original/1089405_00.png.png?action=crop&width=360",
        "ticketsStart": 30001,
        "ticketsEnd": 50000
      },
      {
        "name": "Pleasures Impact Watch Cap 'Black'",
        "price": 11,
        "color": "grey",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/081/860/107/original/1072537_00.png.png?action=crop&width=360",
        "ticketsStart": 50001,
        "ticketsEnd": 100000
      }
    ]
  },
  {
    "id": "1710122375",
    "slug": "Random-PC",
    "name": "Random PC",
    "image": "https://web.archive.org/web/20190104223532im_/https://app.mysterybrand.net/images/e4ba3f315bd396396aad638772f2449d.png",
    "price": 194.16,
    "items": [{
        "name": "Acer Gaming Desktop Predator Orion 3000",
        "price": 949,
        "color": "gold",
        "image": "https://c1.neweggimages.com/ProductImageCompressAll300/83-101-901-19.png",
        "ticketsStart": 0,
        "ticketsEnd": 10000
      },
      {
        "name": "GIGABYTE X670E AORUS PRO X AM5 AMD Motherboard",
        "price": 210,
        "color": "purple",
        "image": "https://c1.neweggimages.com/ProductImageCompressAll300/13-145-485-01.png",
        "ticketsStart": 10001,
        "ticketsEnd": 25000
      },
      {
        "name": "Corsair MP600 CORE XT SSD",
        "price": 132,
        "color": "blue",
        "image": "https://c1.neweggimages.com/ProductImageCompressAll300/20-236-988-01.png",
        "ticketsStart": 25001,
        "ticketsEnd": 35000
      },
      {
        "name": "CORSAIR XTM70 Performance Thermal Paste",
        "price": 115,
        "color": "blue",
        "image": "https://c1.neweggimages.com/ProductImageCompressAll300/35-181-325-01.png",
        "ticketsStart": 35001,
        "ticketsEnd": 68000
      },
      {
        "name": "Off-White Arrow iPhone 12 Mini Case 'Black'",
        "price": 7,
        "color": "grey",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/063/970/405/original/853554_00.png.png?action=crop&width=360",
        "ticketsStart": 68001,
        "ticketsEnd": 100000
      }
    ]
  },
  {
    "id": "1710122665",
    "slug": "Cozy-Comfort",
    "name": "Cozy Comfort",
    "image": "https://web.archive.org/web/20190104223531im_/https://app.mysterybrand.net/images/5cca11745279a8b11e4177ca12ef5421.png",
    "price": 92.01,
    "items": [{
        "name": "Sp5der Beluga Hoodie 'Grey'",
        "price": 200,
        "color": "gold",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/087/250/471/original/1185693_00.png.png?action=crop&width=360",
        "ticketsStart": 0,
        "ticketsEnd": 13000
      },
      {
        "name": "Chrome Hearts Underwear",
        "price": 133,
        "color": "red",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/074/556/346/original/994931_00.png.png?action=crop&width=360",
        "ticketsStart": 13001,
        "ticketsEnd": 29000
      },
      {
        "name": "BAPE Big Ape Head Tee 'Beige'",
        "price": 102,
        "color": "purple",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/059/873/060/original/815982_00.png?action=crop&width=600",
        "ticketsStart": 29001,
        "ticketsEnd": 50000
      },
      {
        "name": "Fear of God Essentials Sweatpants 'Stretch Limo'",
        "price": 61,
        "color": "blue",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/073/921/807/original/986347_00.png.png?action=crop&width=360",
        "ticketsStart": 50001,
        "ticketsEnd": 72000
      },
      {
        "name": "Pleasures Impact Watch Cap 'Black'",
        "price": 11,
        "color": "grey",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/081/860/107/original/1072537_00.png.png?action=crop&width=360",
        "ticketsStart": 72001,
        "ticketsEnd": 100000
      }
    ]
  },
  {
    "id": "1710384100",
    "slug": "budget-rolex",
    "name": "Budget Rolex",
    "image": "https://web.archive.org/web/20190104151148im_/https://app.mysterybrand.net/images/case_78d92a5c0276fb3417dd638e20d4806c.png",
    "price": 70.40,
    "items": [{
        "name": "BAPE Type 1 Bapex 'Green'",
        "price": 820,
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/081/483/898/original/1089405_00.png.png?action=crop&width=360",
        "color": "gold",
        "ticketsStart": 0,
        "ticketsEnd": 1000
      },
      {
        "name": "Acer 27in 170Hz 2K Gaming Monitor",
        "price": 155,
        "purple": "purple",
        "image": "https://c1.neweggimages.com/ProductImageCompressAll300/24-011-452-01.png",
        "ticketsStart": 1001,
        "ticketsEnd": 4000
      },
      {
        "name": "Chrome Hearts Plus Cross Allover Print Horseshoe Logo Hoodie 'Black'",
        "price": 1000,
        "color": "gold",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/087/710/933/original/1190103_00.png.png?action=crop&width=360",
        "ticketsStart": 4001,
        "ticketsEnd": 5000
      },
      {
        "name": "Acer Nitro 31.5in Gaming Monitor Curved",
        "price": 125,
        "color": "purple",
        "image": "https://c1.neweggimages.com/ProductImageCompressAll300/24-011-456-04.png",
        "ticketsStart": 5001,
        "ticketsEnd": 20000
      },
      {
        "name": "Marine Serre Branded Daily Mask 'All Over Moon Tan'",
        "price": 13,
        "color": "grey",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/080/872/247/original/919918_00.png.png?action=crop&width=360",
        "ticketsStart": 20001,
        "ticketsEnd": 40000
      },
      {
        "name": "Dunk Low 'Polar Blue'",
        "price": 83,
        "color": "blue",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/093/184/220/original/1173790_00.png.png?action=crop&width=360",
        "ticketsStart": 40001,
        "ticketsEnd": 60000
      },
      {
        "name": "Market Lizard Tie Dye Socks 'Red Tie Dye'",
        "price": 11,
        "color": "grey",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/084/038/837/original/1123435_00.png.png?action=crop&width=360",
        "ticketsStart": 60001,
        "ticketsEnd": 100000
      }
    ]
  },
  {
    "id": "1710383974",
    "slug": "1%-gucci",
    "name": "1% gucci",
    "image": "https://web.archive.org/web/20190104150948im_/https://app.mysterybrand.net/images/632aa804acc8e9c4d572c45fa0035c0e.png",
    "price": 135,
    "items": [{
        "name": "Gucci GG Marmont Matelasse Super Mini Bag 'Black'",
        "price": 1148,
        "color": "gold",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/092/768/056/original/1278382_00.png.png?action=crop&width=360",
        "ticketsStart": 0,
        "ticketsEnd": 1000
      },
      {
        "name": "GREATEST Magazine Issue 08",
        "price": 9,
        "color": "grey",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/095/705/975/original/1315603_00.png.png?action=crop&width=360",
        "ticketsStart": 1001,
        "ticketsEnd": 100000
      }
    ]
  },
  {
    "id": "1711494805",
    "slug": "Bape-Buds",
    "name": "Bape & Buds",
    "image": "http://web.archive.org/web/20181013190758im_/https://mysterybrand.net/images/ecbee8c603402c1230bef2cc27f3bd48.png",
    "price": 136.75,
    "items": [{
        "name": "Chrome Hearts Plus Cross Allover Print Horseshoe Logo Hoodie 'Black'",
        "price": 1000,
        "color": "gold",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/087/710/933/original/1190103_00.png.png?action=crop&width=360",
        "ticketsStart": 0,
        "ticketsEnd": 3600
      },
      {
        "name": "Saint Laurent Tiny Cassandre Credit Card Wallet 'Greyish Brown'",
        "price": 443,
        "color": "red",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/092/195/372/original/1268717_00.png.png?action=crop&width=360",
        "ticketsStart": 3601,
        "ticketsEnd": 10000
      },
      {
        "name": "Sp5der Beluga Hoodie 'Grey'",
        "price": 200,
        "color": "purple",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/087/250/471/original/1185693_00.png.png?action=crop&width=360",
        "ticketsStart": 10001,
        "ticketsEnd": 13300
      },
      {
        "name": "BAPE Color Camo Big Ape Head Tee 'Black/Red'",
        "price": 156,
        "color": "blue",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/062/284/193/original/837549_00.png.png?action=crop&width=750",
        "ticketsStart": 13301,
        "ticketsEnd": 24810
      },
      {
        "name": "BAPE Big Ape Head Tee 'Beige'",
        "price": 102,
        "color": "blue",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/059/873/060/original/815982_00.png?action=crop&width=600",
        "ticketsStart": 24811,
        "ticketsEnd": 37110
      },
      {
        "name": "Gucci Socks 'Camel/Dark Green'",
        "price": 74,
        "color": "blue",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/093/126/707/original/1097215_00.png.png?action=crop&width=360",
        "ticketsStart": 37111,
        "ticketsEnd": 59110
      },
      {
        "name": "Lemaire Mini Drop Earring 'Gold'",
        "price": 51,
        "color": "blue",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/094/019/147/original/1257652_00.png.png?action=crop&width=360",
        "ticketsStart": 59111,
        "ticketsEnd": 70110
      },
      {
        "name": "Paris Saint-Germain David Luiz #32 Home Stadium Scarf 'Red'",
        "price": 11,
        "color": "grey",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/092/768/528/original/1223550_00.png.png?action=crop&width=360",
        "ticketsStart": 70111,
        "ticketsEnd": 100000
      }
    ]
  },
  {
    "id": "1711594812",
    "slug": "OnlyShoes",
    "name": "OnlyShoes",
    "image": "https://web.archive.org/web/20190104151148im_/https://app.mysterybrand.net/images/5afbfa82a83780e05ef3eb8899be0f17.png",
    "price": 30.26,
    "items": [{
        "name": "The Powerpuff Girls x Dunk Low Pro SB QS 'Buttercup'",
        "price": 283,
        "color": "gold",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/095/942/929/original/1252845_00.png.png?width=100",
        "ticketsStart": 0,
        "ticketsEnd": 1000
      },
      {
        "name": "Air Jordan 1 Retro High '85 OG 'Metallic Burgundy'",
        "price": 241,
        "color": "red",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/096/293/508/original/BQ4422_161.png.png?width=100",
        "ticketsStart": 1001,
        "ticketsEnd": 2000
      },
      {
        "name": "Kobe 8 Protro 'Radiant Emerald'",
        "price": 228,
        "color": "red",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/097/654/763/original/1210578_00.png.png?width=100",
        "ticketsStart": 2001,
        "ticketsEnd": 3000
      },
      {
        "name": "Zoom Kobe 6 Protro 'Reverse Grinch'",
        "price": 219,
        "color": "red",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/095/313/945/original/1124766_00.png.png?width=100",
        "ticketsStart": 3001,
        "ticketsEnd": 4000
      },
      {
        "name": "Air Foamposite One 'Anthracite' 2023",
        "price": 192,
        "color": "purple",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/094/716/194/original/1277513_00.png.png?width=100",
        "ticketsStart": 4001,
        "ticketsEnd": 5000
      },
      {
        "name": "Air Max Plus OG 'Voltage Purple' 2024",
        "price": 162,
        "color": "purple",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/097/304/814/original/1304924_00.png.png?width=100",
        "ticketsStart": 5001,
        "ticketsEnd": 6000
      },
      {
        "name": "Dunk Low CO.JP 'Reverse Curry' 2024",
        "price": 88,
        "color": "purple",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/097/104/892/original/1249413_00.png.png?width=100",
        "ticketsStart": 6001,
        "ticketsEnd": 7000
      },
      {
        "name": "Dunk Low 'Vintage Michigan'",
        "price": 82,
        "color": "purple",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/097/554/276/original/1358572_00.png.png?width=100",
        "ticketsStart": 7001,
        "ticketsEnd": 8000
      },
      {
        "name": "Gucci Socks 'Camel/Dark Green'",
        "price": 74,
        "color": "purple",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/093/126/707/original/1097215_00.png.png?action=crop&width=360",
        "ticketsStart": 8001,
        "ticketsEnd": 11000
      },
      {
        "name": "MM6 Maison Margiela Kids Socks 'White/Black'",
        "price": 15,
        "color": "grey",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/084/465/429/original/1121810_00.png.png?action=crop&width=360",
        "ticketsStart": 11001,
        "ticketsEnd": 38000
      },
      {
        "name": "Market Lizard Tie Dye Socks 'Red Tie Dye'",
        "price": 11,
        "color": "grey",
        "image": "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/084/038/837/original/1123435_00.png.png?action=crop&width=360",
        "ticketsStart": 38001,
        "ticketsEnd": 100000
      }
    ]
  },
  {
    "id": "1712253642",
    "slug": "CASIO-DIY",
    "name": "CASIO DIY",
    "image": "http://web.archive.org/web/20181013190758im_/https://mysterybrand.net/images/1344b9b3d51913b949f18d65ae2f13ba.png",
    "price": 10.90,
    "items": [{
        "name": "Casio GShock GM5600SG-9",
        "price": 156,
        "color": "gold",
        "image": "https://cdn.discordapp.com/attachments/1224913388656791583/1225177340020264990/removal.png?ex=66202e50&is=660db950&hm=0d1341e07c608db3622ed6c742f009bbbb3375f70c78753a177a34e8c0b94e95&",
        "ticketsStart": 0,
        "ticketsEnd": 1100
      },
      {
        "name": "Casio GShock  MTPVD01B1B",
        "price": 101,
        "color": "red",
        "image": "https://cdn.discordapp.com/attachments/1224913388656791583/1225177073119793162/Removal-3_1_1.png?ex=66202e10&is=660db910&hm=b5ef565e7a0dd842a52ebb085cba222e2740b3c4b7dd6b531a38bd3d0ca48d06&",
        "ticketsStart": 1101,
        "ticketsEnd": 3000
      },
      {
        "name": "Casio GShock  AE1400WH9A",
        "price": 76.75,
        "color": "red",
        "image": "https://cdn.discordapp.com/attachments/1224913388656791583/1225176959089250394/removal.png?ex=66202df5&is=660db8f5&hm=7f21e0d203dbbd543729b06ff83ded4dfb52e51f8f9ccb7acf5bb5c177739bc5&",
        "ticketsStart": 3001,
        "ticketsEnd": 6200
      },
      {
        "name": "Casio GShock  MW2407E",
        "price": 54.4,
        "color": "red",
        "image": "https://cdn.discordapp.com/attachments/1224913388656791583/1225176766767956039/removal.png?ex=66202dc7&is=660db8c7&hm=3b0a94a41c7d7f9bac69511cc6e849a2a995c564ef88d75a8ff4acb421037bc2&",
        "ticketsStart": 6201,
        "ticketsEnd": 8400
      },
      {
        "name": "Casio 10160334 Watch Strap",
        "price": 8,
        "color": "blue",
        "image": "https://media.discordapp.net/attachments/1224913388656791583/1225151331702935642/Removal-791_1.png?ex=66201617&is=660da117&hm=d485a7eaf51f79e16b345c003868c07f9bb37a9b568fe59ebecaf6c338d2b2fa&=&format=webp&quality=lossless",
        "ticketsStart": 8401,
        "ticketsEnd": 42360
      },
      {
        "name": "Fullsend $0.01 Voucher",
        "price": 0.01,
        "color": "grey",
        "image": "https://media.discordapp.net/attachments/1214404136590647306/1225258512318468126/Untitled.png?ex=662079e9&is=660e04e9&hm=5d143ece40a3558400403cbb4e92e3a7db9d4bac002165df68159e33cdc341ea&format=webp&quality=lossless&",
        "ticketsStart": 42361,
        "ticketsEnd": 100000
      }
    ]
  }].map((item, index) => {
                return (
                  <a href={`/cases/${item.slug}`}>
                  <div className={classes.caseBox}>
                    <div className={classes.imageContainer}>
                      <img className={classes.caseImage} src={item.image} />
                    </div>
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                      <div style={{color: "hsl(220, 22%, 85%)", fontSize: "12px"}}>{item.name}</div>
                      <div style={{display: "flex", alignItems: "center", gap: "0.25rem"}}></div>
                    </div>
                  </div>
                  </a>
                )      
              })}
            </div>   
          </div>
          
        </div>

        <h3>Loot Table</h3>
        <div className={classes.lootTableContainer}>
          {caseData?.items.map((item, index) => {
            const totalTickets = item.ticketsEnd - (item.ticketsStart == 0 ? +1 : item.ticketsStart) + 1;
            const percent = totalTickets / 1000;
            return (
              <div className={classes.lootBoxContainer} style={{boxShadow: index == 0 ? "none" : ""}}>
                <div className={classes.itemImageContainer}>
                  <img className={classes.itemImage} src={item.image} />
                  <div className={classes.reelItemRadialGradient} style={{background: getBackgroundForItem(item)}}/>
                </div>
                <div className={classes.priceContainer}>
                  <span className={classes.price}>
                    <img style={{height: 17, width: 17}} src={coin} />
                    {parseCommasToThousands(item?.price.toFixed(2))}
                  </span>
                </div>
                <span className={classes.itemNameText}>{item?.name}</span>
                <div className={classes.itemPercentContainer}>
                  <span className={classes.dropRateText}>{percent.toFixed(2)}% Drop Rate</span>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </Grow>
    
    )
  );
};

export default CasePage;