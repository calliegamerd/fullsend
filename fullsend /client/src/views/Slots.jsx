import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isAndroid, isIOS } from 'react-device-detect';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Preloader from "../Preloader"; // Import the Preloader component
import Button from "@material-ui/core/Button";
import pragmaticGameData from './PRAGMATIC_gamelist.json';
import TextField from "@material-ui/core/TextField";
import playButtonIcon from './play-button.png'; // Import the play button icon
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout } from "../actions/auth";
import parseCommasToThousands from "../utils/parseCommasToThousands";
import cutDecimalPoints from "../utils/cutDecimalPoints";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";

const ColorCircularProgress = withStyles({
  root: {
    color: "#fff !important",
  },
})(CircularProgress);

const useStyles = makeStyles(theme => ({
  root: {
    padding: "30px",
    width: "calc(100%)",
    padding: "1rem 2rem", /* top: 1rem, right/left: 2rem */
    paddingBottom: "2rem",
    borderBottom: "2px solid #101123",
    margin: "0 auto", /* Center the controls block horizontally */
    marginTop: "-100px", /* Move the container up by 50px */
    display: "flex",
    flexDirection: "column", // Align BetInput in a column
    alignItems: "center", // Center BetInput horizontally
    minHeight: "9999vh",
    height: "100vh",
    overflowY: "auto", // Enable vertical scrolling
    [theme.breakpoints.down("sm")]: {
      width: "calc(100%)",
      minHeight: "9999vh",
    },
  },
  loadMoreContainer: {
    display: 'flex',
    justifyContent: 'center', // Align the button to the center
    marginTop: '1rem', // Adjust margin as needed
  },
  gameName: {
    fontFamily: "Rubik",
    fontSize: "19px",
    fontWeight: 500,
    fontSize: '0.8rem', // Increase font size
    marginTop: '0.5rem', // Add some top margin for spacing
    color: '#fff', // Set text color to white
  },
  loader: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "25rem",
  },
  tooltip: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    opacity: 0, // Initially hidden
    transition: 'opacity 0.3s', // Fade-in transition
    pointerEvents: 'none', // Prevent tooltip from blocking hover events on the image
  },
  '&:hover .tooltip': {
    opacity: 1, // Show tooltip on hover
  },
  
  loadMoreButton: {
    border: "1px solid #FFC440",
    background: "#FFC440",
    textTransform: "none",
    color: "#000",
    fontFamily: "Rubik",
    padding: "12px 24px", // Add padding
    margin: "16px 0", // Add margin
    "&:hover": {
      boxShadow: "0px 0px 8px #FFC440",
      background: "#FFC440"
    },
  },
  gameImageContainer: {
    position: 'relative',
    width: '100%',
    height: '150px',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'box-shadow 0.3s, transform 0.3s', // Added transform transition
    '&:hover': {
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
  backgroundColor: 'rgba(0, 47, 135, 0.3)', // Blue overlay color
      opacity: 0, // Initially transparent
      transition: 'opacity 0.3s', // Fade-in transition
    },
    '&:hover::after': {
      opacity: 1, // Show overlay on hover
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)', // Center the icon
      width: '80px',
      height: '80px',
      backgroundImage: `url(${playButtonIcon})`, // Set play icon as background image
      backgroundSize: 'cover',
      opacity: 0, // Initially transparent
      transition: 'opacity 0.3s', // Fade-in transition
    },
    '&:hover::before': {
      opacity: 1, // Show icon on hover
    },
  },
  gameImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
}));

const BetInput = withStyles(theme => ({
  root: {
    filter: "brightness(130%)",
    width: "100%",
    marginTop: "auto",
    borderRadius: "10px",
    background: "#101123",
    padding: "1rem 2rem", // Increase padding
    [theme.breakpoints.down("sm")]: {
      //display: "none",
      marginBottom: "10px",
    },
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
      fontFamily: "Rubik",
      fontSize: "14px",
      height: "0.8rem", // Increase height
      marginLeft: "-15px",
      fontWeight: 500,
      letterSpacing: ".1em",
      "&.MuiFilledInput-root.Mui-focused": {
        background: "#101123",
      },
    },
    "& div": {
      background: "#101123",
      borderRadius: "10px",
      "&:hover": {
        background: "#101123",
        "&.MuiFilledInput-root.Mui-focused": {
          background: "#101123",
        },
      },
      "&.MuiFilledInput-root.Mui-focused": {
        background: "#0D1116",
      },
    },
    "&:hover": {
      background: "#101123",
    },
  },
}))(TextField);


const Slots = ({ user, logout }) => {
  const classes = useStyles();
  const [gameData, setGameData] = useState([]);
  const [displayedImages, setDisplayedImages] = useState(30);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGameData, setFilteredGameData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const combinedData = [
      ...pragmaticGameData.map(game => ({ ...game, provider: 'PRAGMATIC' }))
    ];
    setGameData(combinedData);
    setFilteredGameData(combinedData);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const filteredData = gameData.filter(game =>
      game.game_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredGameData(filteredData);
  }, [searchQuery, gameData]);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const loadMoreImages = () => {
    setDisplayedImages(prevCount => prevCount + 30);
  };

  const numColumns = isAndroid || isIOS ? 2 : 6;

  return (
    <div>
      {loading ? (
                <Box className={classes.loader}>
                <ColorCircularProgress />
              </Box>

      ) : (
        <div className={classes.root}>
          
          <div className="pt-4 xl:ml-[80px]">
            <div className="xl:w-[75%] lg:w-[80%] w-[70%] xl:ml-[390px] lg:ml-[420px] mx-auto lg:h-[700px] h-[700px] rounded-md ">
              
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}>
                <BetInput
                  type="text"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  style={{ maxWidth: '400px',  }}
                />
              </div>

              <div style={{
  marginTop: '2rem',
  overflow: 'auto', // Enable scrolling
}}>
  <div style={{
      overflow: 'auto', // Enable scrolling

    width: '100%',
    display: 'grid',
    gridTemplateColumns: `repeat(${numColumns}, minmax(0, 1fr))`,
    gridGap: '1rem',
  }}>

    {filteredGameData.slice(0, displayedImages).map(game => (
      <Link key={game.game_code} to={`/slots/${game.game_code}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white', textDecoration: 'none' }}>
        <div className={classes.gameImageContainer}>
          <img className={classes.gameImage} src={game.banner} alt={game.game_name} />
          <div className={classes.tooltip}>{game.game_name}</div> {/* Tooltip */}
        </div>
        <div className={classes.gameName}>{game.game_name}</div> {/* Updated styling for game name */}
      </Link>
    ))}
                </div>
              </div>
              <div className={classes.loadMoreContainer}>
                {displayedImages < filteredGameData.length && (
                  <Button
                    onClick={loadMoreImages}
                    variant="contained"
                    className={classes.loadMoreButton}
                  >
                    Load More
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
Slots.propTypes = {
  user: PropTypes.object,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(Slots);
