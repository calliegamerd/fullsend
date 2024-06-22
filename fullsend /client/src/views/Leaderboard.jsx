import React, { useState, useEffect, Fragment } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import parseCommasToThousands from "../utils/parseCommasToThousands.js";
import { useToasts } from "react-toast-notifications";
import { getRaceInformation, getLastRaceInformation, getRacePosition } from "../services/api.service";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import Countdown from "react-countdown";
import { Grow, Slide } from "@material-ui/core";
import { motion } from "framer-motion";

import coin from "../assets/icons/coin.png";
import WideLogo from "../assets/navbar/logo2.png";
import FlagsLeft from "../assets/leaderboard/flags-left.png";
import FlagsRight from "../assets/leaderboard/flags-right.png";
import First from "../assets/leaderboard/first2.png";
import Second from "../assets/leaderboard/second2.png";
import Third from "../assets/leaderboard/third2.png";


const cutDecimalPoints = (num) => {
  const roundedNum = parseFloat(num).toFixed(2);
  return roundedNum;
};

const ColorCircularProgress = withStyles({
  root: {
    color: "#fff !important",
  },
})(CircularProgress);

// Custom Styles
const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: "820px",
    margin: "0 auto",
    color: "#fff",
    overflowY: "scroll",
    scrollbarWidth: "none"
  },
  container: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  content: {
    width: "100%",
    display: "block",
  },
  raceTableOutline: {
    marginTop: "0.5rem",
    display: "flex",
    flexDirection: "column",
    borderRadius: "0.25rem",
  },
  raceTableContainer: {
    display: "flex",
    fontSize: 13,
    borderRadius: "0.25rem",
    width: "100%",
    padding: "0.5em 2em",
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    opacity: 0.5
  },
  placementContainer: {
    display: "flex",
    justifyContent: "flex-start",
    width: "20%",
    alignItems: "center"
  },
  playerContainer: {
    display: "flex",
    justifyContent: "flex-start",
    width: "80%",
    alignItems: "center"
  },
  wageredContainer: {
    display: "flex",
    justifyContent: "center",
    width: "50%",
    alignItems: "center",
    gap: "0.25rem",
    fontSize: 16
  },
  prizeContainer: {
    display: "flex",
    justifyContent: "center",
    width: "50%",
    alignItems: "center",
    gap: "0.25rem",
  },
  prizeBox: {
    backgroundColor: "#4F4340",
    color: "#E1B56F",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.25rem",
    padding: "0.35rem 1rem",
    borderRadius: "0.25rem",
    fontSize: 16
  },
  players: {
    "& td:nth-child(even)": { 
      backgroundColor: "#fff !important",
    },
    "& td:nth-child(odd)": { 
      backgroundColor: "#fff !important",
    },
  },
  playerBox: {
    display: "flex",
    padding: "1em 2em",
    background: "#13142D",
    marginBottom: "12px",
    borderRadius: "0.25rem"
  },
  playerAvatar: {
    width: "35px",
    height: "35px",
    borderRadius: "8px",
  },
  loader: {
    width: "100%",
    height: "100%",
    margin: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  textContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    "& > h2": {
      fontSize: "30px",
      letterSpacing: "2px",
      fontWeight: 600,
      margin: 0,
      padding: 0
    },
    "& > p": {
      fontSize: "12px",
      color: "#fff",
      fontWeight: 400,
      opacity: 0.5,
      margin: 0,
      padding: 0
    }
  },
  topThreeContainer: {
    width: "100%",
    height: 450,
    margin: "3rem 0 2rem 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "bottom",
  },
  firstPlaceContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "end",
  },
  first: {
    marginTop: "auto",
    height: 283,
    width: 247,
    alignSelf: "end",
    position: "relative",
    backgroundImage: `url(${First})`,
    textAlign: "center"
  },
  second: {
    height: 283,
    width: 247,
    alignSelf: "end",
    position: "relative",
    backgroundImage: `url(${Second})`,
    textAlign: "center",
  },
  third: {
    height: 283,
    width: 247,
    alignSelf: "end",
    position: "relative",
    backgroundImage: `url(${Third})`,
    textAlign: "center"
  },
  finalistAvatar: {
    height: 80,
    width: 80,
    borderRadius: "0.5rem",
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translate(-50%, -50%)"
  },
  usernameText: {
    fontSize: 21,
    marginTop: 50,
  },
  wageredText: {
    fontSize: 13,
    opacity: 0.5,
    marginTop: 55,
  },
  wagerAmountText: {
    fontSize: 20,
    marginTop: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.3rem",
  },
  winAmountText: {
    fontSize: 30,
    marginTop: 40,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.3rem"
  },

}));

const tt = [
  {
    _id: "655115219075c878ccf134a9",
    value: 1100.94,
    _user: {
      wager: 376.61000000000007,
      _id: "65504d039e86f0287008662e",
      username: 'üp',
      avatar: 'https://avatars.steamstatic.com/408fa5f4aa2011080a86aef18f69395a3b2a661d_full.jpg'
    },
    user_level: '10',
    user_levelColor: 'rgb(193, 172, 166)',
    _race: "655114831e01fd6954fa712c",
    created: "2023-11-12T18:10:41.518Z",
  },
  {
    _id: "655115219075c878ccf134a9",
    value: 800.34,
    _user: {
      wager: 376.61000000000007,
      _id: "65504d039e86f0287008662e",
      username: 'üp',
      avatar: 'https://avatars.steamstatic.com/408fa5f4aa2011080a86aef18f69395a3b2a661d_full.jpg'
    },
    user_level: '10',
    user_levelColor: 'rgb(193, 172, 166)',
    _race: "655114831e01fd6954fa712c",
    created: "2023-11-12T18:10:41.518Z",
  },
  {
    _id: "655115219075c878ccf134a9",
    value: 600.21,
    _user: {
      wager: 376.61000000000007,
      _id: "65504d039e86f0287008662e",
      username: 'üp',
      avatar: 'https://avatars.steamstatic.com/408fa5f4aa2011080a86aef18f69395a3b2a661d_full.jpg'
    },
    user_level: '10',
    user_levelColor: 'rgb(193, 172, 166)',
    _race: "655114831e01fd6954fa712c",
    created: "2023-11-12T18:10:41.518Z",
  },
  {
    _id: "655115219075c878ccf134a9",
    value: 495.32,
    _user: {
      wager: 376.61000000000007,
      _id: "65504d039e86f0287008662e",
      username: 'üp',
      avatar: 'https://avatars.steamstatic.com/408fa5f4aa2011080a86aef18f69395a3b2a661d_full.jpg'
    },
    user_level: '10',
    user_levelColor: 'rgb(193, 172, 166)',
    _race: "655114831e01fd6954fa712c",
    created: "2023-11-12T18:10:41.518Z",
  },
  {
    _id: "655115219075c878ccf134a9",
    value: 433.33,
    _user: {
      wager: 376.61000000000007,
      _id: "65504d039e86f0287008662e",
      username: 'üp',
      avatar: 'https://avatars.steamstatic.com/408fa5f4aa2011080a86aef18f69395a3b2a661d_full.jpg'
    },
    user_level: '10',
    user_levelColor: 'rgb(193, 172, 166)',
    _race: "655114831e01fd6954fa712c",
    created: "2023-11-12T18:10:41.518Z",
  },
  {
    _id: "655115219075c878ccf134a9",
    value: 350.67,
    _user: {
      wager: 376.61000000000007,
      _id: "65504d039e86f0287008662e",
      username: 'üp',
      avatar: 'https://avatars.steamstatic.com/408fa5f4aa2011080a86aef18f69395a3b2a661d_full.jpg'
    },
    user_level: '10',
    user_levelColor: 'rgb(193, 172, 166)',
    _race: "655114831e01fd6954fa712c",
    created: "2023-11-12T18:10:41.518Z",
  },
  {
    _id: "655115219075c878ccf134a9",
    value: 270.93,
    _user: {
      wager: 376.61000000000007,
      _id: "65504d039e86f0287008662e",
      username: 'üp',
      avatar: 'https://avatars.steamstatic.com/408fa5f4aa2011080a86aef18f69395a3b2a661d_full.jpg'
    },
    user_level: '10',
    user_levelColor: 'rgb(193, 172, 166)',
    _race: "655114831e01fd6954fa712c",
    created: "2023-11-12T18:10:41.518Z",
  },
  {
    _id: "655115219075c878ccf134a9",
    value: 150.99,
    _user: {
      wager: 376.61000000000007,
      _id: "65504d039e86f0287008662e",
      username: 'üp',
      avatar: 'https://avatars.steamstatic.com/408fa5f4aa2011080a86aef18f69395a3b2a661d_full.jpg'
    },
    user_level: '10',
    user_levelColor: 'rgb(193, 172, 166)',
    _race: "655114831e01fd6954fa712c",
    created: "2023-11-12T18:10:41.518Z",
  },
  {
    _id: "655115219075c878ccf134a9",
    value: 93.12,
    _user: {
      wager: 376.61000000000007,
      _id: "65504d039e86f0287008662e",
      username: 'üp',
      avatar: 'https://avatars.steamstatic.com/408fa5f4aa2011080a86aef18f69395a3b2a661d_full.jpg'
    },
    user_level: '10',
    user_levelColor: 'rgb(193, 172, 166)',
    _race: "655114831e01fd6954fa712c",
    created: "2023-11-12T18:10:41.518Z",
  },
  {
    _id: "655115219075c878ccf134a9",
    value: 10.21,
    _user: {
      wager: 376.61000000000007,
      _id: "65504d039e86f0287008662e",
      username: 'üp',
      avatar: 'https://avatars.steamstatic.com/408fa5f4aa2011080a86aef18f69395a3b2a661d_full.jpg'
    },
    user_level: '10',
    user_levelColor: 'rgb(193, 172, 166)',
    _race: "655114831e01fd6954fa712c",
    created: "2023-11-12T18:10:41.518Z",
  },
]


const Leaderboard = ({ open, handleClose, user }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();

  const [loading, setLoading] = useState(true);
  const [loadingPersonal, setLoadingPersonal] = useState(false);
  const [activeRace, setActiveRace] = useState(false);
  const [topWinners, setTopWinners] = useState(null);
  const [personalPosition, setPersonalPosition] = useState(0);
  const [personalProgress, setPersonalProgress] = useState(0);
  const [prizeDistribution, setPrizeDistribution] = useState([]);
  const [first, setFirst] = useState(false);
  const [second, setSecond] = useState(false);
  const [third, setThird] = useState(false);
  const [text, setText] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getRaceInformation();
        const responseLast = await getLastRaceInformation();

        // If race is active
        if (response.active) {
          // Update state
          setTopWinners(response.topTen);
          setActiveRace(response.activeRace);
          setPrizeDistribution(response.prizeDistribution);
          setLoading(false);
          setTimeout(() => {
            setThird(true)
            setTimeout(() => {
              setSecond(true)
              setTimeout(() => {
                setFirst(true)
              }, 250)
            }, 250)
          }, 250)
          console.log(response)
        }
        // If Last Race
        else if (false) {
          // Update state
          setTopWinners(responseLast.topTen);
          setActiveRace(responseLast.activeRace);
          setPrizeDistribution(responseLast.prizeDistribution);
          setLoading(false);
        }
        else {
          setActiveRace(null);
          setLoading(false);
        }

      } catch (error) {
        console.log("There was an error while loading race data:", error);
        addToast(
          "There was an error while loading race data, please try again later!",
          { appearance: "error" }
        );
      }
    };
    
    fetchData();
  }, []);

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      function z(t) {
        return t < 10 ? `0${t}` : t;
      }
      return (
        <div>
          <span>{days}d {z(hours)}h {z(minutes)}:{z(seconds)}</span>
        </div>
      );
    } else {
      function z(t) {
        return t < 10 ? `0${t}` : t;
      }
      return (
        <div style={{width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem 0 0 0"}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M16.5 2.75C8.90608 2.75 2.75 8.90608 2.75 16.5C2.75 24.0938 8.90608 30.25 16.5 30.25C24.0938 30.25 30.25 24.0938 30.25 16.5C30.25 8.90608 24.0938 2.75 16.5 2.75ZM17.875 9.625C17.875 8.86561 17.2594 8.25 16.5 8.25C15.7406 8.25 15.125 8.86561 15.125 9.625V16.5C15.125 17.2594 15.7406 17.875 16.5 17.875C17.2594 17.875 17.875 17.2594 17.875 16.5V9.625Z" fill="#D7B949"/><path fillRule="evenodd" clipRule="evenodd" d="M26.5277 3.15272C25.9908 3.6897 25.9908 4.5603 26.5277 5.09728L27.9027 6.47228C28.4397 7.00924 29.3103 7.00924 29.8473 6.47228C30.3842 5.9353 30.3842 5.0647 29.8473 4.52772L28.4723 3.15272C27.9353 2.61576 27.0647 2.61576 26.5277 3.15272Z" fill="#D7B949"/></svg>
          <div style={{color: "#D7B949"}}>Ends In</div>
          <span>{days}d {z(hours)}h {z(minutes)}:{z(seconds)}</span>
        </div>
      );
    }
  };

  return (
      <div className={classes.root}>    
        {loading ?
          <Box className={classes.loader}>
            <ColorCircularProgress />
          </Box>
          : (
          <Grow in timeout={620}>
            <div className={classes.container}>
              {/*<motion.img src={FlagsLeft} style={{width: 250, position: "absolute", top: 0, left: 0}} />
              <motion.img src={FlagsRight} style={{width: 250, position: "absolute", top: 0, right: 0}} />*/}

              <div className={classes.textContainer}>
                <h2>$1,000.00 WEEKLY RACE</h2>
                <p>The race is based on your wager amount every week.</p>
              </div>

              {!activeRace ? (
                <div style={{display: "flex", gap: "0.5rem", color: "#fff", marginTop: "15rem"}}>No active race.</div>
              ) : (
              <>
                <div className={classes.topThreeContainer}>
                  <Slide in={second} direction="up" timeout={350}>
                    <div className={classes.second}>
                      <img className={classes.finalistAvatar} src={topWinners[1]._user.avatar} style={{border: "1px solid #C0C0C0"}}/>
                      <div className={classes.usernameText}>{topWinners[1]._user.username}</div>
                      <div className={classes.wageredText}>Wagered</div>
                      <div className={classes.wagerAmountText}><img style={{height: 17, width: 17}} src={coin} />{parseCommasToThousands(cutDecimalPoints(topWinners[1].value))}</div>
                      <div className={classes.winAmountText} style={{color: "#C0C0C0"}}><img style={{height: 25, width: 25}} src={coin} />{parseCommasToThousands(cutDecimalPoints(activeRace.prize *(prizeDistribution[1] / 100)))}</div>
                    </div>
                  </Slide>
                  
                  <div className={classes.firstPlaceContainer}>
                    <Slide in={first} direction="up" timeout={350}>
                      <div className={classes.first}>
                        <img className={classes.finalistAvatar} src={topWinners[0]._user.avatar} style={{border: "1px solid #E1B56F"}}/>
                        <div className={classes.usernameText}>{topWinners[0]._user.username}</div>
                        <div className={classes.wageredText}>Wagered</div>
                        <div className={classes.wagerAmountText}><img style={{height: 17, width: 17}} src={coin} />{parseCommasToThousands(cutDecimalPoints(topWinners[0].value))}</div>
                        <div className={classes.winAmountText} style={{color: "#E1B56F"}}><img style={{height: 25, width: 25}} src={coin} />{parseCommasToThousands(cutDecimalPoints(activeRace.prize *(prizeDistribution[0] / 100)))}</div>
                      </div>
                    </Slide>
                    <Countdown date={new Date(activeRace?.endingDate)} renderer={renderer} style={{ color: "#fff" }}/>
                  </div>

                  <Slide in={third} direction="up" timeout={350}>
                    <div className={classes.third}>
                      <img className={classes.finalistAvatar} src={topWinners[2]._user.avatar} style={{border: "1px solid #CD7F32"}}/>
                      <div className={classes.usernameText}>{topWinners[2]._user.username}</div>
                      <div className={classes.wageredText}>Wagered</div>
                      <div className={classes.wagerAmountText}><img style={{height: 17, width: 17}} src={coin} />{parseCommasToThousands(cutDecimalPoints(topWinners[2].value))}</div>
                      <div className={classes.winAmountText} style={{color: "#CD7F32"}}><img style={{height: 25, width: 25}} src={coin} />{parseCommasToThousands(cutDecimalPoints(activeRace.prize *(prizeDistribution[2] / 100)))}</div>
                    </div>
                  </Slide>
                  
                </div>
                <div className={classes.content}>
                  <div className={classes.content} >
                    <div className={classes.raceTableOutline}>
                      <div className={classes.raceTableContainer}>
                        <div style={{display: "flex", width: "50%"}}>
                          <div className={classes.placementContainer}>#</div>
                          <div className={classes.playerContainer}>Player</div>
                        </div>
                        <div style={{display: "flex", width: "50%"}}>
                          <div className={classes.wageredContainer} style={{fontSize: 12}}>Wagered</div>
                          <div className={classes.prizeContainer}>Prize</div>
                        </div>
                      </div>
                      <div className={classes.players}>
                        {!topWinners ? "" : topWinners.map((entry, index) => {
                          if(index <= 2) return
                          return (
                            <div className={classes.playerBox}>
                              <div style={{display: "flex", width: "50%"}}>
                                <div className={classes.placementContainer}>{index + 1}</div>
                                <div className={classes.playerContainer} style={{gap: "0.5rem"}}>
                                  <img className={classes.playerAvatar} src={entry._user.avatar} />
                                  {entry._user.username}
                                </div>
                              </div>
                              <div style={{display: "flex", width: "50%"}}>
                                <div className={classes.wageredContainer}><img style={{height: 17, width: 17}} src={coin} />{parseCommasToThousands(cutDecimalPoints(entry.value))}</div>
                                <div className={classes.prizeContainer}><div className={classes.prizeBox}><img style={{height: 17, width: 17}} src={coin} />{parseCommasToThousands(cutDecimalPoints(activeRace.prize *(prizeDistribution[index] / 100)))}</div></div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div> 
                </div>
              </>
              )}   
            </div>
          </Grow>
          )}  
      </div>
  );
};

export default Leaderboard;