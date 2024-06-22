import React, { useEffect, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useHistory } from 'react-router-dom';
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import parseCommasToThousands from "../utils/parseCommasToThousands";
import { getActiveCases } from "../services/api.service";
import { Grow } from "@material-ui/core";
import coin from "../assets/icons/coin.png";

const ColorCircularProgress = withStyles({
  root: {
    color: "#fff !important",
  },
})(CircularProgress);

const useStyles = makeStyles(theme => ({
  image: {
    height: "100%",
    width: "100%",
    filter: "blur(10px)",
    width: "100%",
    //maxWidth: "1150px"
  },
  comingSoon: {
    color: "#fff",
    position: "fixed",
    zIndex: 1000,
    top: "50%",
    left: "50%"
  }
}));

const Blackjack = () => {
  const classes = useStyles();
  const history = useHistory();

  const [loading, setLoading] = useState(true);


  const fetchData = async () => {
    try {

      setLoading(false);
    } catch (error) {
      console.log("There was an error getting active cases: " + error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [])

  return loading ? (
      <div>
        <ColorCircularProgress />
      </div>
    ) : (
    <Grow in timeout={620}>
      <div>
        <img className={classes.image} src="https://cdn.discordapp.com/attachments/1070718292446162974/1214399639017492542/image.png?ex=65f8f8cc&is=65e683cc&hm=edcf1d9b2c768172c71ba2eb3ae72223018e60aeb3a41fd59bb879665c50c108&" />
      </div>
    </Grow>
  );
};

export default Blackjack;