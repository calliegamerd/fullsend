import React, { useState, useEffect } from "react";
import { BsFileLock2Fill } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { GoArrowSwitch } from "react-icons/go";
import { makeStyles, withStyles,} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Box from "@material-ui/core/Box";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { limboSocket } from "../services/websocket.service";
import { useToasts } from "react-toast-notifications";
import { useSpring, animated, config } from 'react-spring';
import { ClipLoader } from "react-spinners";
import coin from "../assets/icons/coin.png";

const BetInput = withStyles({
  root: {
    marginRight: 10,
    maxWidth: 130,
    minWidth: 100,
    marginBottom: 10, // Add top margin
    fontFamily: "Rubik",

    "& :before": {
      display: "none",
    },
    "& label": {
      color: "#323956",
      fontSize: 15,
    },
    "& div input": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
      padding: "0.5rem 0.25rem",
    },
    "& div": {
      // background: "#171A28",
      background: "#131426",
      height: "2.25rem",
      borderRadius: 4,
    },
    
  },
})(TextField);

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: "3%",
    [theme.breakpoints.down("lg")]: {
      marginTop: "5%",

    },
  },

  title: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: ".1em",
    padding: "0.25rem 0.25rem 0",
    lineHeight: 1,
  },

  placeBet: {
    background: "#131426",
    borderRadius: 5,
    boxShadow: "0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)",
    marginTop: "0.6rem",
    "& button": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".1em",
      "&:hover": {
        opacity: 1,
      },
    },
  },

  betCont: {
    display: "flex",
    width: "95%",
    alignItems: "center",
    flexWrap: "wrap",
    margin: "auto",
    padding: "0.5rem 0 0",
  },
  container: {
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: "#0a0b1c", 
    borderRadius: "8px",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("xl")]: {
      width: "68%",
    },
    [theme.breakpoints.down("lg")]: {
      width: "90%",
    },
  },
  betSection: {
    
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: "12px",
    paddingBottom: "12px",
    [theme.breakpoints.down("lg")]: {
      flexDirection: "column-reverse", // Reverse column order on Android
    },
  },
  inputIcon: {
    marginTop: "0 !important",
    color: "#4fa0d8",
    background: "transparent !important",
  },
  betContainer: {
    
    border: "1px solid #101123",
    borderRadius: "4px",
    paddingRight: "12px",
    paddingLeft: "12px",
    paddingTop: "16px",
    paddingBottom: "16px",
    width: "300px",
    height: "450px",
    backgroundColor: "#101123",
    [theme.breakpoints.down("lg")]: {
      marginTop: "24px",
      width: "100%",
      height: "auto",
    },
  },
  inputContainer: {
    position: "relative",
    marginBottom: "24px",
  },
  betInput: {
    width: "100%",
    height: "40px",
    backgroundColor: "#101123",
    paddingLeft: "40px",
    color: "#ffffff",
    borderRadius: "4px",
    border: "none",
    outline: "none",
    fontFamily: "'Roboto', sans-serif",
    fontSize: "16px",
    fontWeight: 500,
    "&::placeholder": {
      color: "#cccccc",
    },
  },
  multiplierContainer: {
    position: "absolute",
    top: "10px",
    right: "10px",
    display: "flex",
    gap: "8px",
  },
  multiplier: {
    minWidth: "fit-content",
    backgroundColor: "#101123",
    borderColor: "#32363c",
    color: "white",
  },
  multiplierButton: {
    backgroundColor: "transparent",
    color: "#cccccc",
    border: "1px solid transparent",
    outline: "none",
    cursor: "pointer",
    padding: "4px",
    fontSize: "14px",
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 500,
    "&:hover": {
      backgroundColor: "#101123",
    },
  },
  insufficientFundsButton: {
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    width: "100%",
    height: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "2px solid #4c8bf5",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 500,
    "&:hover": {
      backgroundColor: "#2563eb",
      borderColor: "#1e429f",
    },
  },
  limboButtonDisabled: {
    opacity: 0.5, // Reduce opacity when disabled
    pointerEvents: "none", // Disable pointer events when disabled
  },
  
  limboButton: {
    textTransform: "none",
    width: "100%",
    height: "40px",
    padding: "0 30px",
    borderRadius: "4px",
    fontSize: "15px",
    fontWeight: 500,
    color:" #fff",
    background: "rgb(32, 112, 223)",
    border: "none",
    color: "#ffffff",
    transition: "opacity .3s ease",
    fontFamily: "Rubik",
    "&:hover": {
      background: "rgb(32, 112, 223)",
      borderColor: "#1e429f",
    },
  },

  limboSection: {
    border: "4px solid #101123",
    backgroundColor: "#101123",
    borderRadius: "6px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#ffffff", // Set text color to white
    fontSize: "24px", // Increase font size to 24px
    [theme.breakpoints.down("lg")]: {
        height: "400px",
        flexDirection: "column-reverse", // Reverse column order on Android
    },
    [theme.breakpoints.up("lg")]: {
        width: "100%", // Adjust the width as needed
        maxWidth: "700px", // Set the maximum width to maintain consistency
        marginLeft: "auto",
        marginRight: "auto",
        flexDirection: "column-reverse", // Reverse column order on Android
    },
},
  
  
  
}));

const Limbo = (user, isAuthenticated) => {
  const classes = useStyles();
  const { addToast } = useToasts();

  const [betAmount, setBetAmount] = useState("0.00");
  const [multiplier, setMultiplier] = useState("2"); // State for multiplier
  const [loading, setLoading] = useState(false); // Initialize loading state
  const [limboResult, setLimboResult] = useState({ crashpoint: 1 }); // State to store limbo result

  const springProps = useSpring({
    from: { crashpoint: 1 },
    to: { crashpoint: limboResult.crashpoint ? parseFloat(limboResult.crashpoint) : 1 },
    config: { duration: 250 }, // Adjust duration to make animation faster (e.g., 500 milliseconds)
  });
  


  const onMultiplierChange = event => {
    const newMultiplier = event.target.value;
    // Check if newMultiplier is a valid number
    if (!isNaN(newMultiplier)) {
      setMultiplier(newMultiplier);
    }
  };
  const handleBetAmountChange = (event) => {
    const newBetAmount = event.target.value;
    if (!isNaN(newBetAmount)) {
      setBetAmount(newBetAmount);
    }
  };

  const handleBetAmountButton = (factor) => {
    const newBetAmount = parseFloat(betAmount) * factor;
    setBetAmount(newBetAmount.toFixed(2));
  };

  const handleMultiplierButton = factor => {
    const newMultiplier = parseFloat(multiplier) * factor;
    setMultiplier(newMultiplier.toFixed(2));
  };
  const success = msg => {
    addToast(msg, { appearance: "success" });
  };
  const onBetChange = e => {
    setBetAmount(e.target.value);
  };
  const [target, setTarget] = useState("2");


  const onTargetChange = e => {
    setTarget(e.target.value);
  };
  const open = async (x) => {
    setLimboResult(x); // Update limbo result from the event data
  };

  const handleLimboBet = () => {
    setLoading(true); // Set loading state to true when placing the bet
    limboSocket.emit("limbo:bet", { amount: betAmount, multiplier: multiplier });

    // Simulate loading for 1 second
    setTimeout(() => {
      setLoading(false); // Reset loading state after 1 second
    }, 350);
  };
  const creationError = msg => {
    // Update state
    setLoading(true); // Set loading state to true when placing the bet

    addToast(msg, { appearance: "error" });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(false);
      try {
      } catch (error) {
        console.log("There was an error while betting on limbo:", error);
      }
    };

    fetchData();
    limboSocket.on("game-creation-error", creationError);
    limboSocket.on("limbo:bet", success);
    limboSocket.on("limbo:result", open);
    return () => {
      limboSocket.off("game-creation-error", creationError);
      limboSocket.off("limbo:bet", success);
      limboSocket.off("limbo:result", open);
    };
  }, [addToast]);


  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.betSection}>
          <div className={classes.betContainer}>
            {/* Bet Amount */}
            <div className={classes.title}>Bet Amount</div>
            <div className={classes.inputContainer}>
              <Box className={classes.placeBet}>
                <Box className={classes.betCont}>
                  <BetInput
                    label=""
                    variant="filled"
                    value={betAmount}
                    onChange={onBetChange}
        InputProps={{
          startAdornment: (
            <InputAdornment
              className={classes.inputIcon}
              position="start"
            >
<img src={coin} alt="Money Icon" style={{ width: 16, height: 16 }} />
            </InputAdornment>
          ),
        }}
      />
                </Box>
              </Box>
              <div className={classes.multiplierContainer}>
                {/* Buttons for changing multiplier */}
                <Button
                  className={classes.multiplier}
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={() => handleBetAmountButton(0.5)}
                >
                  <span className={classes.reverse}>1/2</span>
                </Button>
                <Button
                  className={classes.multiplier}
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={() => handleBetAmountButton(2)}
                >
                  <span className={classes.reverse}>2x</span>
                </Button>
              </div>
            </div>

            {/* Multiplier Amount */}
            <div className={classes.title}>Multiplier Amount</div>
            <div className={classes.inputContainer}>
              <Box className={classes.placeBet}>
                <Box className={classes.betCont}>
                  <BetInput
                    label=""
                    variant="filled"
                    value={multiplier}
                    onChange={onMultiplierChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          className={classes.inputIcon}
                          position="start"
                        >
            <img src="https://shuffle.com/icons/increase.svg" alt="Money Icon" style={{ width: 16, height: 16 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                            </Box>
              </Box>
              <div className={classes.multiplierContainer}>
                {/* Buttons for changing multiplier */}
                <Button
                  className={classes.multiplier}
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={() => handleMultiplierButton(0.5)}
                >
                  <span className={classes.reverse}>1/2</span>
                </Button>
                <Button
                  className={classes.multiplier}
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={() => handleMultiplierButton(2)}
                >
                  <span className={classes.reverse}>2x</span>
                </Button>
              </div>
            </div>

        {/* Place Bet Button */}
        <Button
  variant="contained"
  color="primary"
  className={`${classes.limboButton} ${loading ? classes.limboButtonDisabled : ''}`}
  onClick={handleLimboBet}
>
  {loading ? (
    <ClipLoader
      color="#fff"           // Set the color of the loader
      loading={true}         // Set loading to true
      size={10}              // Set the size of the loader
    />
  ) : (
    'Place Bet'
  )}
</Button>


          </div>

          {/* Limbo Section */}
          <div className={classes.limboSection}>
          <animated.div
  style={{
    fontSize: "5rem",
    color:
      parseFloat(limboResult.crashpoint) === 1
        ? "white"
        : parseFloat(multiplier) < parseFloat(limboResult.crashpoint)
        ? "rgb(61, 209, 121)" // Green
        : parseFloat(multiplier) > parseFloat(limboResult.crashpoint)
        ? "rgb(241, 50, 62)" // Red
        : "white",
    userSelect: "none", // This makes the text not selectable
  }}
>
  {springProps.crashpoint.interpolate(val => `${val.toFixed(2)}x`)}
</animated.div>




            {/* Remaining content */}
          </div>
        </div>
      </div>
    </div>
  );
};

Limbo.propTypes = {
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Limbo);
