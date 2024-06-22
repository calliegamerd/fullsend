import React, { useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { getCrashSchema, getUserCrashData } from "../services/api.service";
import { crashSocket } from "../services/websocket.service";
import PropTypes from "prop-types";
import _ from "underscore";
import parseCommasToThousands from "../utils/parseCommasToThousands";
import cutDecimalPoints from "../utils/cutDecimalPoints";
import { TransitionGroup } from 'react-transition-group';
import { Line } from 'react-chartjs-2';

// MUI Components
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import Tooltip from "@material-ui/core/Tooltip";

import MonetizationOnOutlined from "@material-ui/icons/MonetizationOnOutlined";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import Grow from '@material-ui/core/Grow';
import { TimerBar } from "./TimerBar.js";

import Multi from "../components/crash/Multi.jsx";

// Icons
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import TrackChangesIcon from "@material-ui/icons/TrackChanges";
// Components
import Bets from "../components/crash/Bets";
import CrashGraph from "../components/crash/CrashGraph";
import HistoryEntry from "../components/crash/HistoryEntry";

import placebet from "../assets/sounds/place-bet.mp3";
import error from "../assets/sounds/error.mp3";
import success from "../assets/success.wav";
import crash from "../assets/sounds/crash.mp3";
import coin from "../assets/icons/coin.png";

const errorAudio = new Audio(error);
const placebetAudio = new Audio(placebet);
const successAudio = new Audio(success);
const crashAudio = new Audio(crash);

const playSound = audioFile => {
  audioFile.play();
};

const BetInput = withStyles({
  root: {
    width: "100%",
    marginTop: "auto",
    border: "1px solid transparent",
    background: "#101123",
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

const TargetInput = withStyles({
  root: {
    width: "50%",
    borderRadius: "10px",
    background: "#32363c",
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
      marginLeft: "-15px",
      fontWeight: 500,
      letterSpacing: ".1em",
      padding: "0.5rem 1rem",
      "&.MuiFilledInput-root.Mui-focused": {
        background: "#32363c",
      },
    },
    "& div": {
      background: "#0D1116",
      height: "2.25rem",
      borderRadius: "10px",
      "&:hover": {
        background: "#0D1116",
        "&.MuiFilledInput-root.Mui-focused": {
          background: "#0D1116",
        },
      },
      "&.MuiFilledInput-root.Mui-focused": {
        background: "#0D1116",
      },
    },
    "&:hover": {
      background: "#0D1116",
    },
  },
})(TextField);

// Custom Styles
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    width: "100%",
    maxWidth: "1250px",
    margin: "0 auto",
    overflowY: "auto",
    scrollbarWidth: "none"
  },
  container: {
    [theme.breakpoints.down("xs")]: {
      marginBottom: "140px",
    },
  },
  logo: {
    color: "#e4e4e4",
    fontFamily: "Poppins",
    fontSize: "19px",
    paddingLeft: "10px",
    fontWeight: 500,
    letterSpacing: ".1em",
    [theme.breakpoints.down("xs")]: {
      fontSize: 19,
      marginTop: 5,
    },
  },
  countdown: {
    fontSize: 20,
    marginBottom: "20px",
    marginLeft: "5px",
    marginTop: "-35px",
    [theme.breakpoints.down("xs")]: {
      fontSize: 15,
      marginBottom: "20px",
      marginLeft: "5px",
      marginTop: "0px",
    },
  },
  controls: {
    overflow: "visible",
    paddingTop: "1.5rem",
    paddingLeft: "24px",
    paddingRight: "24px",
    marginBottom: "33px",
    [theme.breakpoints.down("xs")]: {
      marginBottom: "20px",
    },
  },
  right: {
    display: "flex",
    maxWidth: "66rem",
    marginRight: "-24px",
    alignItems: "center",
    justifyContent: "flex-end",
    maskImage: "linear-gradient(240deg,rgba(0,0,0,1) 34%,rgba(0,0,0,0))",
    overflow: "hidden",
    marginLeft: "auto",
  },
  game: {
    display: "flex",
    width: "100%",
    gap: "0.75rem",
    // height: "75vh",
    [theme.breakpoints.down("xs")]: {
      height: "auto",
      width: "100%",
    },
  },
  cup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "8.75rem",
    position: "relative",
    overflow: "hidden",
    background: "#0A0B1C",
    border: "1px solid #161D26",
    borderRadius: 5,
    transition: "1s ease",
    padding: "1em"
  },
  gameInfo: {
    position: "absolute",
    top: 7.5,
    left: 10,
    color: "#5f6368",
    fontFamily: "Poppins",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: ".1em",
    zIndex: 10,
    "& span": {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      "& svg": {
        marginRight: 4,
      },
    },
  },
  maxProfit: {
    position: "absolute",
    top: 7.5,
    right: 10,
    color: "#5f6368",
    fontFamily: "Poppins",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: ".1em",
    zIndex: 10,
    "& span": {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      "& svg": {
        marginRight: 4,
      },
    },
  },
  amountbuttons: {
    display: "flex",
    paddingTop: "5px",
    marginTop: "-12px",
  },
  multiplier: {
    minWidth: "fit-content",
    border: "1.5px solid #272847;",
    backgroundColor: "transparent",
    color: "#9E9FBD",
    marginRight: 7,
    marginTop: "0.5rem",
    boxShadow: "none",
    fontFamily: "Poppins",
    fontSize: "12px",
    transition: "all 300ms ease",
    "&:hover": {
      backgroundColor: "transparent",
      borderColor: "#9E9FBD",
      boxShadow: "none",
      transform: "translateY(-2px)",
    },
  },
  placeBet: {
    background: "transparent",
    borderRadius: "0.4rem",
    // marginTop: "0.9rem",
    "& button": {
      color: "#e4e4e4",
      fontFamily: "Poppins",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".1em",
      "&:hover": {
        opacity: 1,
      },
    },
  },
  inputIcon: {
    marginTop: "0 !important",
    color: "#fff",
    background: "transparent !important",
  },
  title: {
    color: "#e4e4e4",
    fontFamily: "Poppins",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: ".1em",
    padding: "1rem 1.25rem 0",
    lineHeight: 1,
  },
  splitTitle: {
    display: "inline-block",
    color: "#e4e4e4",
    fontFamily: "Poppins",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: ".1em",
    padding: "1rem 1.25rem 0",
    lineHeight: 1,
    width: "50%",
  },
  contain: {
    flexDirection: "row",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  betCont: {
    width: "10%",
    alignItems: "center",
    margin: "auto",
    padding: "0.5rem 0 0",
    display: "flex"
  },
  cashoutCont: {
    display: "inline-flex",
    width: "50%",
    color: "#ffffff",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 10,
    padding: "0.5rem 0 1.25rem",
  },
  autoCont: {
    display: "inline-flex",
    width: "50%",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 10,
    padding: "0.5rem 0 1.25rem",
  },
  reverse: {
  },
  bet: {
    minWidth: "fit-content",
    backgroundColor: "#178ac9",
    borderColor: "#178ac9",
    boxShadow: "0 1.5px #191e24",
    color: "white",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: "#178ac9",
    },
  },
  cashout: {
    minWidth: "fit-content",
    backgroundColor: "#f44336",
    borderColor: "#f44336",
    color: "white",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: "#f44336",
    },
    "&.Mui-disabled": {
      backgroundColor: "rgba(244, 67, 54, 0.4)",
      color: "white",
    },
  },
  barContainer: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "1250px",
    color: "#fff",
    margin: "0 auto"
  },
  bar: {
    position: "relative",
    width: "100%",
    bottom: 0,
    left: 0,
    zIndex: 10,
  },
  betsContainer: {
      flex: "none",
      width: "20em",
      [theme.breakpoints.down("xs")]: {
        display: "none"
      },
  },
  mainContainer: {
    flex: "auto",
    // order: 1,
    minWidth: 0,
    marginLeft: "0.5em",
  },
  slideGraphics: {
    padding: "1rem",
    borderRadius: "0.5em",
    backgroundColor: "#0A0B1C",
  },
  recentRoundsContainer: {
    margin: "0.625rem 0",
    overflow: "hidden",
    maskImage: "linear-gradient(to right, rgb(0, 0, 0) 80%, rgba(0, 0, 0, 0.2) 100%)",
    display: "flex"
  },
  button: {
    flex: "auto",
    height: "2.75em",
    color: "rgb(255, 255, 255)",
    backgroundColor: "hsl(215, 75%, 50%)",
    border: "none",
    cursor: "pointer",
    display: "inline-flex",
    outline: "none",
    padding: "0 0.75em",
    position: "relative",
    alignItems: "center",
    fontWeight: 500,
    userSelect: "none",
    whiteSpace: "nowrap",
    willChange: "opacity",
    borderRadius: "0.25rem",
    justifyContent: "center",
    transitionDuration: "300ms",
    "&:hover": {
      backgroundColor: "#1B60C0"
    }
  },
  buttonDisabled: {
    flex: "auto",
    height: "2.75em",
    color: "rgb(255, 255, 255)",
    backgroundColor: "hsl(215, 75%, 50%)",
    border: "none",
    cursor: "pointer",
    display: "inline-flex",
    outline: "none",
    padding: "0 0.75em",
    position: "relative",
    alignItems: "center",
    fontWeight: 500,
    userSelect: "none",
    whiteSpace: "nowrap",
    willChange: "opacity",
    borderRadius: "0.25rem",
    justifyContent: "center",
    transitionDuration: "300ms",  
    opacity: "0.6",
    pointerEvents: "none"
  },
}));

// Same game states as in backend
const GAME_STATES = {
  NotStarted: 1,
  Starting: 2,
  InProgress: 3,
  Over: 4,
  Blocking: 5,
  Refunded: 6,
};

const BET_STATES = {
  Playing: 1,
  CashedOut: 2,
};

const Crash = ({ user, isAuthenticated }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();

  const [gameState, setGameState] = useState(1);
  const [gameId, setGameId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [betting, setBetting] = useState(false);
  const [plannedBet, setPlannedBet] = useState(false);
  const [ownBet, setOwnBet] = useState(null);
  const [autoCashoutEnabled, setAutoCashoutEnabled] = useState(false);
  const [autoBetEnabled, setAutoBetEnabled] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [history, setHistory] = useState([]);
  const [players, setPlayers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [payout, setPayout] = useState(1);
  const [betAmount, setBetAmount] = useState("0.00");
  const [target, setTarget] = useState("2");
  const [privateHash, setPrivateHash] = useState(null);
  const [publicSeed, setPublicSeed] = useState(null);
  const [maxProfit, setMaxProfit] = useState(0);
  const [ticks, setTicks] = useState([]);

  // Add new player to the current game
  const addNewPlayer = player => {
    setPlayers(state => [...state, player]);
  };

  // Button onClick event handler
  const clickBet = () => {
    if (parseFloat(betAmount) <= 0) return;

    if (gameState === GAME_STATES.Starting) {
      setJoining(true);

      // Emit new bet event
      crashSocket.emit(
        "join-game",
        autoCashoutEnabled ? parseFloat(target) * 100 : null,
        parseFloat(betAmount)
      );
    } else {
      if (plannedBet) {
        setPlannedBet(false);
      } else if (!autoBetEnabled) {
        setPlannedBet(true);
      }
    }
  };

  const clickCashout = () => {
    // Emit bet cashout
    crashSocket.emit("bet-cashout");
  };

  // TextField onChange event handler
  const onBetChange = e => {
    setBetAmount(e.target.value);
  };

  const onTargetChange = e => {
    setTarget(e.target.value);
  };

  const handleAutoCashoutChange = e => {
    if (!betting || cashedOut) setAutoCashoutEnabled(e.target.checked);
  };

  const handleAutoBetChange = e => {
    setAutoBetEnabled(e.target.checked);
    setPlannedBet(false);
  };

  // Add game to history
  const addGameToHistory = game => {
    setHistory(state =>
      state.length >= 50
        ? [game, ...state.slice(1, state.length)]
        : [game, ...state]
    );
  };

  // componentDidMount
  useEffect(() => {
    // Error event handler
    const joinError = msg => {
      setJoining(false);
      addToast(msg, { appearance: "error" });
      playSound(errorAudio);
    };

    // Success event handler
    const joinSuccess = bet => {
      setJoining(false);
      setOwnBet(bet);
      setBetting(true);
      addToast("Successfully joined the game!", { appearance: "success" });
      playSound(placebetAudio);
    };

    // Error event handler
    const cashoutError = msg => {
      addToast(msg, { appearance: "error" });
      playSound(errorAudio);
    };

    // Success event handler
    const cashoutSuccess = () => {
      addToast("Successfully cashed out!", { appearance: "success" });
      playSound(successAudio);

      // Reset betting state
      setTimeout(() => {
        setBetting(false);
      }, 1500);
    };

    // New round is starting handler
    const gameStarting = data => {
      // Update state
      setGameId(data._id);
      setStartTime(new Date(Date.now() + data.timeUntilStart));
      setGameState(GAME_STATES.Starting);
      setPrivateHash(data.privateHash);
      setPublicSeed(null);

      setPayout(1);
      setPlayers([]);
      setOwnBet(null);

      if (autoBetEnabled) {
        setJoining(true);

        // Emit new bet event
        crashSocket.emit(
          "join-game",
          autoCashoutEnabled ? parseFloat(target) * 100 : null,
          parseFloat(betAmount)
        );
      } else if (plannedBet) {
        setJoining(true);

        // Emit new bet event
        crashSocket.emit(
          "join-game",
          autoCashoutEnabled ? parseFloat(target) * 100 : null,
          parseFloat(betAmount)
        );

        // Reset planned bet
        setPlannedBet(false);
      }
    };

    // New round started handler
    const gameStart = data => {
      // Update state
      setStartTime(Date.now());
      setTicks([1.00])
      setGameState(GAME_STATES.InProgress);
      setPublicSeed(data.publicSeed);
    };

    // Current round ended handler
    const gameEnd = data => {
      // Update state
      setGameState(GAME_STATES.Over);
      playSound(crashAudio);
      setPayout(data.game.crashPoint);
      addGameToHistory(data.game);
      setBetting(false);
      setCashedOut(false);
    };

    // New game bets handler
    const gameBets = bets => {
      _.forEach(bets, bet => addNewPlayer(bet));
    };

    // New cashout handler
    const betCashout = bet => {
      // Check if local user cashed out
      if (bet.playerID === user._id) {
        setCashedOut(true);
        setOwnBet(Object.assign(ownBet, bet));

        // Reset betting state
        setTimeout(() => {
          setBetting(false);
        }, 1500);
      }

      // Update state
      setPlayers(state =>
        state.map(player =>
          player.playerID === bet.playerID ? Object.assign(player, bet) : player
        )
      );
    };

    // Current round tick handler
    const gameTick = payout => {
      if (gameState !== GAME_STATES.InProgress) return;

      setTicks(state => [...state, payout])
      setPayout(payout);
    };

    // Listeners
    crashSocket.on("game-starting", gameStarting);
    crashSocket.on("game-start", gameStart);
    crashSocket.on("game-end", gameEnd);
    crashSocket.on("game-tick", gameTick);
    crashSocket.on("game-bets", gameBets);
    crashSocket.on("bet-cashout", betCashout);
    crashSocket.on("game-join-error", joinError);
    crashSocket.on("game-join-success", joinSuccess);
    crashSocket.on("bet-cashout-error", cashoutError);
    crashSocket.on("bet-cashout-success", cashoutSuccess);

    return () => {
      // Remove Listeners
      crashSocket.off("game-starting", gameStarting);
      crashSocket.off("game-start", gameStart);
      crashSocket.off("game-end", gameEnd);
      crashSocket.off("game-tick", gameTick);
      crashSocket.off("game-bets", gameBets);
      crashSocket.off("bet-cashout", betCashout);
      crashSocket.off("game-join-error", joinError);
      crashSocket.off("game-join-success", joinSuccess);
      crashSocket.off("bet-cashout-error", cashoutError);
      crashSocket.off("bet-cashout-success", cashoutSuccess);
    };
  }, [
    addToast,
    gameState,
    startTime,
    plannedBet,
    autoBetEnabled,
    autoCashoutEnabled,
    betAmount,
    target,
    ownBet,
    user,
  ]);

  useEffect(() => {
    // Fetch crash schema from API
    const fetchData = async () => {
      setLoading(true);
      try {
        const schema = await getCrashSchema();
        //console.log(schema);

        // Update state
        setGameId(schema.current._id);
        setPrivateHash(schema.current.privateHash);
        setPublicSeed(schema.current.publicSeed);
        setPlayers(schema.current.players);
        setStartTime(new Date(Date.now() - schema.current.elapsed));
        setHistory(schema.history);
        setLoading(false);
        setGameState(schema.current.status);
        setMaxProfit(schema.options.maxProfit);
      } catch (error) {
        console.log("There was an error while loading crash schema:", error);
      }
    };

    // Initially, fetch data
    fetchData();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Fetch crash schema from API
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getUserCrashData();

        // Update state
        if (data.bet && data.bet.status === BET_STATES.Playing) {
          setBetting(true);
          setOwnBet(data.bet);
        }
      } catch (error) {
        console.log("There was an error while loading crash schema:", error);
      }
    };

    // If user is signed in, check user data
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  return (
  <Grow in timeout={620}>
    <Box className={classes.barContainer}>
      <h3>Crash</h3>
      <Box className={classes.root}>
        <div className={classes.betsContainer}>
          <Bets players={players} loading={loading} />
        </div>
        <div className={classes.mainContainer}>
          <div className={classes.slideGraphics}>
            <CrashGraph
              data={ticks}
            />
            <Tooltip
              interactive
              title={
                <span>
                  Round ID: {gameId}
                  <br />
                  Private Hash: {privateHash}
                  <br />
                  Public Seed:{" "}
                  {publicSeed ? publicSeed : "Not created yet"}
                </span>
              }
              placement="bottom"
            >
              <span>
                <InfoOutlinedIcon style={{ fontSize: 20, color: "rgb(72 82 97)", }} />
              </span>
            </Tooltip>
            <Multi
              loading={loading}
              payout={payout}
              ownBet={ownBet}
              gameState={gameState}
            />
            <div className={classes.bar}>
              {!loading && gameState === GAME_STATES.Starting && <TimerBar waitTime={startTime} gameStates={GAME_STATES} updateGameState={(state) => setGameState(state)} />}
            </div>
          </div>
          <div className={classes.recentRoundsContainer}>
            <TransitionGroup style={{display: "flex"}}>
              {history.map(game => (
                <HistoryEntry key={game._id} game={game} />
              ))}            
            </TransitionGroup>
          </div>
          <Box className={classes.placeBet}>
            <div style={{display: "flex", flexDirection: "row", color: "#9E9FBD", fontWeight: 550, marginBottom: "0.25rem"}}>
              <div style={{width: "100%", marginRight: "0.5rem"}}>Amount</div>
              {/*<div style={{width: "calc(50% - 0.25rem)"}}>Target multiplier</div>*/}
            </div>
            <div style={{display: "flex", flexDirection: "row"}}>
              <BetInput
                //style={{marginRight: "0.5rem"}}
                label=""
                variant="filled"
                value={betAmount}
                onChange={onBetChange}
                InputProps={{
                  endAdornment: (<Box className={classes.amountbuttons}>
                    <Button
                      className={classes.multiplier}
                      size="medium"
                      color="primary"
                      variant="contained"
                      onClick={() =>
                        setBetAmount(
                          state => (parseFloat(state) / 2).toFixed(2) || 0
                        )
                      }
                    >
                      <span className={classes.reverse}>1/2</span>
                    </Button>
                    <Button
                      className={classes.multiplier}
                      size="medium"
                      color="primary"
                      variant="contained"
                      onClick={() =>
                        setBetAmount(
                          state => (parseFloat(state) * 2).toFixed(2) || 0
                        )
                      }
                    >
                      <span className={classes.reverse}>X2</span>
                    </Button>
                    <Button
                      className={classes.multiplier}
                      size="medium"
                      color="primary"
                      variant="contained"
                      onClick={() => setBetAmount(user ? user.wallet.toFixed(2) : 0)}
                    >
                      <span className={classes.reverse}>Max</span>
                    </Button></Box>),
                  startAdornment: (
                    <InputAdornment
                      className={classes.inputIcon}
                      position="start"
                    >
                      <img style={{height: 17, width: 17}} src={coin} />
                    </InputAdornment>
                  ),
                }}
              />
              {/*<BetInput
                label=""
                variant="filled"
                value={target}
                onChange={onTargetChange}
                InputProps={{
                  endAdornment: (<Box className={classes.amountbuttons}>
                    <Button
                      className={classes.multiplier}
                      size="medium"
                      color="primary"
                      variant="contained"
                      onClick={() =>
                        setTarget(
                          state => (parseFloat(state) / 2).toFixed(2) < 1.01 ? 1.01 : (parseFloat(state) / 2).toFixed(2)
                        )
                      }
                    >
                      <span className={classes.reverse}>1/2</span>
                    </Button>
                    <Button
                      className={classes.multiplier}
                      size="medium"
                      color="primary"
                      variant="contained"
                      onClick={() =>
                        setTarget(
                          state => (parseFloat(state) * 2).toFixed(2) < 1.01 ? 1.01 : (parseFloat(state) * 2).toFixed(2)
                        )
                      }
                    >
                      <span className={classes.reverse}>X2</span>
                    </Button></Box>),
                  startAdornment: (
                    <div style={{ marginRight: "0.2rem"}} />
                  ),
                }}
              />*/}
            </div>
            {!betting ? <div style={{display: "flex", marginTop: "0.5rem"}} onClick={() => clickBet()}>
              <div className={joining ? classes.buttonDisabled : classes.button}>{joining ? "Betting..." : plannedBet ? "Cancel bet": "Place bet"}</div>
            </div> : <div style={{display: "flex", marginTop: "0.5rem"}} onClick={() => clickCashout()}>
              <div className={cashedOut ? classes.buttonDisabled : classes.button} style={{background: "#f44336"}}>{cashedOut ? "Cashed out" : "Cashout"}</div>
            </div>}
          </Box>
        </div>
      </Box>
      <Box className={classes.logo}>
      </Box>
    </Box>
  </Grow>
  );
};

Crash.propTypes = {
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Crash);
