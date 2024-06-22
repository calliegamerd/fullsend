import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

// MUI Components
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import { TransitionGroup } from 'react-transition-group';
import Collapse from '@material-ui/core/Collapse';
import coin from "../../assets/icons/coin.png";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100%",
    display: "flex",
    paddingTop: "0.75em",
    paddingLeft: "0.75em",
    borderRadius: "0.5em",
    paddingRight: "0.75em",
    flexDirection: "column",
    backgroundColor: "#101123",
    border: "1px solid transparent",
  },
  userlevel: {
    fontSize: 9,
    padding: "5px 7px",
    color: "#fff",
    fontFamily: "Poppins",
    fontWeight: 500,
    letterSpacing: ".15em",
    marginTop: "-4px",
    borderTopLeftRadius: "3px",
    borderBottomLeftRadius: "3px",
    borderRight: "1px solid #272b2f",
  },
  betAmount: {
    width: "100%",
    height: "2.1rem",
    display: "flex",
    alignItems: "center",
    color: "#9E9FBD",
    fontFamily: "Poppins",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: ".1em",
    "& span": {
      display: "flex",
      marginLeft: "auto",
      color: "#4caf50",
      fontFamily: "Poppins",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".1em",
    },
  },
  bets: {
    display: "flex",
    color: "white",
    height: "100%",
    flexDirection: "column",
    overflowY: "auto",
  },
  bet: {
    display: "flex",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 5,
    width: "100%",
    padding: "10 10",
    color: "#e4e4e4",
    fontFamily: "Poppins",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: ".1em",
    position: "relative",
  },
  winningAmount: {
    color: "#6afe43",
    // filter: "drop-shadow(0px 0px 15px green) invert(10%)",
  },
  avatar: {
    height: 25,
    width: 25,
    borderRadius: "100%",
  },
  noBets: {
    flex: "auto",
    color: "#9E9FBD",
    display: "flex",
    alignItems: "center",
    paddingBottom: "0.75em",
    justifyContent: "center",
  }
}));

const Bets = ({ players, loading }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.betAmount}>
        {players.length} bets
        <Box style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.3rem" }}>
        <img style={{height: 17, width: 17}} src={coin} />
          {loading
            ? "Loading..."
            :
            players
              .map(player => parseFloat(player.betAmount))
              .reduce((a, b) => a + b, 0)
              .toFixed(2)}
        </Box>
      </Box>    
      {players.length <= 0 ? (
        <div className={classes.noBets}>No bets to display.</div>
      ) : players.sort((a, b) => b.betAmount - a.betAmount).map((player, index) => (
      <Box className={classes.bets}>
        <TransitionGroup>
          <Collapse key={index}>
            <Box key={index}>
              <Box className={classes.bet}>
                <Box
                  style={{
                    width: "50%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    className={classes.avatar}
                    src={player.avatar}
                    variant="rounded"
                  />
                  <Box ml={1}>{player.username}</Box>
                </Box>
                {player?.winningAmount ? (
                  <Box
                    ml="auto"
                    style={{ width: "30%", display: "flex", alignItems: "center", gap: "0.3rem" }}
                    className={classes.winningAmount}
                  >
                    <img style={{height: 17, width: 17}} src={coin} />
                    {player.winningAmount && `${player.winningAmount.toFixed(2)}`}
                  </Box>
                ): (
                  <Box ml="auto" style={{ width: "30%", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <img style={{height: 17, width: 17}} src={coin} />
                    {player.betAmount.toFixed(2)}
                  </Box>
                )}
                
              </Box>
            </Box>
          </Collapse>
        </TransitionGroup>
      </Box>
      ))}
    </Box>
  );
};

Bets.propTypes = {
  players: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default Bets;
