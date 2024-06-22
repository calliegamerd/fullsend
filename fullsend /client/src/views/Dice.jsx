import React, {useRef, useState, useEffect } from "react";
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
import { diceSocket } from "../services/websocket.service";
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

const ResultInput = withStyles({
  root: {
    marginRight: 10,
    maxWidth: 180,
    minWidth: 0,
    marginBottom: 10, // Add top margin
    
    "& :before": {
      display: "none",
    },
    "& label": {
      color: "#323956",
      fontSize: 15,
    },
    "& input": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
      padding: "8px 8px", // Adjust padding as needed
    },
    "& div": {
      // background: "#171A28",
      // background: "#131426",
      // height: "2.25rem",
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
    betInputContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))', // Adjust column width
  
    gridGap: '.5rem',
    marginTop: '1rem', /* Adjust as needed */
    bottom: '1rem', // Adjust as needed
    transform: 'translateY(200%)', // Move the container down
    [theme.breakpoints.down("lg")]: {
      gridTemplateColumns: 'repeat(3, minmax(80px, 1fr))', // Adjust column width

      transform: 'translateY(100%)', // Move the container down
    },


  },

  numberContainer: {
    marginTop: "2%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "550px", // Default width
    color: "#ffffff",
    fontWeight: 500,
    [theme.breakpoints.down("lg")]: {
      
      width: "250px", // Adjusted width for lg and below
    },
  },
  number: {
    margin: 0,
    fontSize: "12px", // Adjust the font size as needed
  },
  inputRange: {
    WebkitAppearance: "none",
    appearance: "none",
    background: "#d3d3d3",
    outline: "none",
    height: "10px",
    transition: "opacity .2s",
    accentColor: "blue",
    backgroundColor: "#ffda21",
    width: "550px",
    borderRadius: "4px",
    [theme.breakpoints.down("lg")]: {
      width: "250px", // Adjusted width for lg and below
    },

    "&::-webkit-slider-thumb": {
      backgroundColor: "rgb(68, 131, 235)",
      borderRadius: "4px",
      cursor: "grab",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "3px",
      marginLeft: "-7px",
      transition: "all 0.05s ease",
      boxShadow: "rgba(43, 42, 42, 0.28) 0px -3px 0px inset",
      WebkitAppearance: "none",
      appearance: "none",
      width: "25px",
      height: "25px",
      borderRadius: "6px",
    },
    "&::-moz-range-thumb": {
      width: "35px",
      height: "35px",
      background: "cc",
      cursor: "pointer",
    },
  },
  resultIndicator: {
    position: "absolute",
    top: "-50px",
    left: "calc(calc(calc(100% - 40px) * var(--percentage)) / 100)",
    transform: "translateX(-20%)",
    fontFamily: "Rubik", // Adjust the font family
    fontWeight: 600, // Adjust the font weight
    fontSize: "14px", // Adjust the font size
    borderRadius: "8px", // Adjust the border radius
    backgroundColor: "#2F3241", // Adjust the background color
    padding: "10px", // Adjust the padding
    display: "none", // Hide by default
    transition: "display 1s",
    "&.visible": {
      display: "block", // Show when visible
    },
    "&.text-green": {
      color: "green", // Adjust the color for green text
    },
    "&.text-red": {
      color: "red", // Adjust the color for red text
    },
  },

  title: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "12px",
    fontWeight: 500,
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
    border: "1px solid #101123", // Add border style

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
  diceButtonDisabled: {
    opacity: 0.5, // Reduce opacity when disabled
    pointerEvents: "none", // Disable pointer events when disabled
  },
  
  diceButton: {
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

  diceSection: {
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
        height: "310px",
    },
    [theme.breakpoints.up("lg")]: {
        width: "100%", // Adjust the width as needed
        maxWidth: "700px", // Set the maximum width to maintain consistency
        marginLeft: "auto",
        marginRight: "auto",
    },
},
  
  
  
}));

const Dice = (user, isAuthenticated) => {
  const classes = useStyles();
  const { addToast } = useToasts();
  const [rangeData, setRangeData] = useState(50);
  const [betAmount, setBetAmount] = useState("0.00");
  const [multiplier, setMultiplier] = useState("2"); // State for multiplier
  const [loading, setLoading] = useState(false); // Initialize loading state
  const [diceResult, setDiceResult] = useState(0); 
  const [payout, setPayout] = useState(0); 

  let inputRef = useRef();
  const handleRangeChange = (e) => {
    setRangeData(e.target.value);
  };
  const [showDiceResult, setShowDiceResult] = useState(true); // Define showDiceResult state variable

  const [sliderValue, setSliderValue] = useState(50);
  const rollOver = rangeData + 0.1; // Calculate the roll over value

  // Function to handle slider value change
  const handleSliderChange = event => {
    setSliderValue(event.target.value);
    setDiceResult(null); // Reset diceResult when the slider is moved

  };
  const redPercentage = (sliderValue - 1.2);
  const greenPercentage = (redPercentage);

  // Dynamic background value for the slider
  const sliderBackground = `linear-gradient(90deg, rgb(5, 223, 5) ${redPercentage}%, rgb(255, 0, 0) ${greenPercentage}%)`;



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
  const open = async (data) => {
    const { diceresult, payout } = data; // Extract the diceresult value from the data
    setDiceResult(diceresult); // Update dice result with only diceresult value
    console.log(diceresult)
    setPayout(payout); // Update dice result with only diceresult value
    console.log(payout)

  };
  
  const handleDiceBet = () => {
    setLoading(true); // Set loading state to true when placing the bet
    diceSocket.emit("dice:bet", { amount: betAmount, multiplier: multiplier, rangeData: sliderValue});
 
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
        console.log("There was an error while betting on dice:", error);
      }
    };

    fetchData();
    diceSocket.on("game-creation-error", creationError);
    diceSocket.on("dice:bet", success);
    diceSocket.on("dice:result", open);
    return () => {
      diceSocket.off("game-creation-error", creationError);

      diceSocket.off("dice:bet", success);
      diceSocket.off("dice:result", open);
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
            <div className={classes.title}>Profit</div>
            <div className={classes.inputContainer}>
              <Box className={classes.placeBet}>
                <Box className={classes.betCont}>
                  <BetInput
                    label=""
                    variant="filled"
                    value={(betAmount * 100 / sliderValue).toFixed(2)} // Fixed to 2 decimal places
                    readOnly // Add this line to make the input uneditable
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
            </div>

        {/* Place Bet Button */}
        <Button
  variant="contained"
  color="primary"
  className={`${classes.diceButton} ${loading ? classes.diceButtonDisabled : ''}`}
  onClick={handleDiceBet}
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

          {/* Dice Section */}
          
          <div className={classes.diceSection}>
  {/* Input Range */}
  <div style={{ position: 'relative', }}> {/* Add relative positioning to the container */}
    <input
      className={classes.inputRange}
      type="range"
      name="range"
      min="0.1"
      step="0.1"
      value={sliderValue}
      onChange={handleSliderChange}
      max="99.9"
      style={{ background: sliderBackground }}
    />
    {/* Dice Result Indicator */}
    <div
  style={{ 
    position: 'absolute',
    top: '-50px',
    left: `${(diceResult - 0.1) / (104.9 + 2.1) * 99.9}%`,
    transform: 'translateX(-30%)',
    fontFamily: 'Rubik',
    fontWeight: 500,
    fontSize: '14px',
    borderRadius: '8px',
    backgroundColor: 'rgb(46 47 62 / 21%)',
    padding: '10px',
    display: diceResult ? 'block' : 'none', /* Show indicator only if diceResult is truthy */
    color: payout > 0 ? 'rgb(5, 223, 5)' : payout === 0 ? 'rgb(255, 0, 0)' : 'rgb(5, 223, 5)', /* Change text color dynamically */
    transition: 'left 0.5s ease-in-out', // Add transition property for left position change
    border: payout > 0 ? '1px solid rgb(5, 223, 5)' : payout === 0 ? '1px solid rgb(255, 0, 0)' : 'none', /* Add border dynamically based on payout value */
  }}
>
  {diceResult}
</div>
  </div>


  <div className={classes.numberContainer}>
    <p className={classes.number}>0</p>
    <p className={classes.number}>25</p>
    <p className={classes.number}>50</p>
    <p className={classes.number}>75</p>
    <p className={classes.number}>100</p>
  </div>


  <div className={classes.betInputContainer}>
    
  <Box className={classes.placeBet}>
  <div className={classes.title}>Multiplier</div>

    <ResultInput
    
      label=""
      value={(100 / sliderValue).toFixed(2)} 
      readOnly // Add this line to make the input uneditable
      InputProps={{
        startAdornment: (
          <InputAdornment
            className={classes.inputIcon}
            position="end"
          >
            <img src="https://shuffle.com/icons/increase.svg" alt="Money Icon" style={{ width: 16, height: 16 }} />
          </InputAdornment>
        ),
      }}
    />
    </Box>
    <Box className={classes.placeBet}>
    <div className={classes.title}>Roll Under</div>

    <ResultInput
      label=""
      value={sliderValue} // Set the value to the calculated roll over value
      readOnly // Add this line to make the input uneditable
      InputProps={{
        startAdornment: (
          <InputAdornment
            className={classes.inputIcon}
            position="end"
          >
            <img src="https://shuffle.com/icons/increase.svg" alt="Money Icon" style={{ width: 16, height: 16 }} />
          </InputAdornment>
        ),
      }}
    />
    </Box>
    <Box className={classes.placeBet}>
    <div className={classes.title}>Chance</div>

    <ResultInput
  label=""
  value={(sliderValue)} // Set the value to the calculated roll over value with 2 decimal places
  readOnly // Add this line to make the input uneditable
  InputProps={{
    startAdornment: (
      <InputAdornment
        className={classes.inputIcon}
        position="end"
      >
        <img src="https://shuffle.com/icons/increase.svg" alt="Money Icon" style={{ width: 16, height: 16 }} />
      </InputAdornment>
    ),
  }}
/>

    </Box>

  </div>



            {/* Remaining content */}
          </div>
          
        </div>
        
      </div>
      
    </div>
    
  );
};

Dice.propTypes = {
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Dice);
