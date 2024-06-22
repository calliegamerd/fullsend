import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import parseCommasToThousands from "../../utils/parseCommasToThousands";
import cutDecimalPoints from "../../utils/cutDecimalPoints";


const useStyles = makeStyles({
  meta: {
    
  },
  payout: {
    color: "#f8f8f8",
    fontFamily: "Poppins",
    fontSize: "40px",
    fontWeight: 500,
    letterSpacing: ".1em",
    userSelect: "none",
    lineHeight: 1,
    position: "relative",
    left: "50%",
    top: "50%",
    transform: "translateX(-50%) translateY(-550%)",
    textAlign: "center",
  },
  profit: {
    color: "#11ca52",
    fontFamily: "Poppins",
    fontSize: "30px",
    fontWeight: 500,
    letterSpacing: ".1em",
    userSelect: "none",
    lineHeight: 1,
    marginTop: 3,
    transition: "color 0.4s ease",
    "&.cashed": {
      color: "#11ca52",
    },
  },
});

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

const Multi = ({ loading, payout, ownBet, gameState }) => {
  const classes = useStyles();

  return (
    <div className={classes.meta}>
      <div className={classes.payout}>
        {loading ? "Loading..." : `x${payout.toFixed(2)}`}
        {(gameState === GAME_STATES.InProgress ||
        gameState === GAME_STATES.Over) &&
        ownBet && (
          <div
            className={`${classes.profit} ${ownBet.status === BET_STATES.CashedOut ? "cashed" : ""
              }`}
          >
            +$
            {ownBet.status === BET_STATES.Playing
              ? parseCommasToThousands(
                cutDecimalPoints((ownBet.betAmount * payout).toFixed(7))
              )
              : parseCommasToThousands(
                cutDecimalPoints(ownBet.winningAmount.toFixed(7))
              )}
          </div>
        )}
      </div>
      
    </div>
  );
};

export default Multi;
