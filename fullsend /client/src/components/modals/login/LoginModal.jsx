import React, { useState, useEffect, Fragment } from "react";
import { Tab, makeStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Dialog from "@material-ui/core/Dialog";
import Login from "./Login";
import Registration from "./Registration";

// Custom Styles
const useStyles = makeStyles(theme => ({
  modal: {
    "& .MuiDialog-paperWidthSm": {
      scrollbarWidth: "none",
      width: "50%",
      background: "#050614",
      borderRadius: "0.5em",
      color: "#fff",
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        margin: "15px",
        marginTop: "80px",
        maxHeight: "80%",
      },
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        margin: "15px",
        marginTop: "80px",
        maxHeight: "80%",
      },
      [theme.breakpoints.down("md")]: {
        width: "100%",
        margin: "15px",
        marginTop: "80px",
        maxHeight: "80%",
      },
    },
  },
  titleBox: {
    display: "flex",
    boxShadow: "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
    alignItems: "center",
    paddingTop: "1em",
    paddingLeft: "1.5em",
    paddingRight: "1em",
    paddingBottom: "1em",
    fontFamily: "Poppins", 
    backgroundColor: "#101123", 
    justifyContent: "space-between",
    width: "100%"
  },
  content: {
    padding: "1.5em",
    display: "block",
  },
  buttonIcon: {
    color: "#9E9FBD",
    marginRight: ".5em",
    fill: "currentColor",
    flex: "none",
    width: "1.25em",
    height: "1.25em",
    display: "inline-block",
    outline: "none",
  },
  tabContainer: {
    marginBottom: "2em",
    display: "flex",
    borderBottom: "1px solid #272847",
  },
  tabButton: {
    color: "#9E9FBD",
    fontWeight: 500,
    userSelect: "none",
    paddingLeft: "0.5em",
    paddingRight: "0.5em",
    paddingBottom: "0.5em",
    cursor: "pointer",
    transitionDuration: "300ms",
    borderBottom: "2px solid transparent"
  },
  buttonActive: {
    color: "hsl(220, 22%, 90%)",
    borderBottom: "2px solid hsl(220, 22%, 90%)"
  },
}));

const Affiliates = ({  user, isAuthenticated, open, handleClose, }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();

  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("login");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        setLoading(false);
      } catch (error) {

      }
    };
    
    if (open) {
      fetchData();
    } else {

    }
  }, [open]);

  return (
      <Dialog
        className={classes.modal}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >    
        <div className={classes.titleBox} onClose={handleClose} >
          <span style={{flex: "auto", fontSize: "1.5rem", color: "#E0E4EB" }}>Sign in</span>
          <svg className={classes.buttonIcon} style={{cursor: "pointer"}} onClick={() => handleClose()} fill="currentColor" tabIndex="-1" viewBox="0 0 320 512"><path d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>
        </div>
        <div className={classes.content} >
          <div className={classes.tabContainer}>
            <div className={`${classes.tabButton} ${tab == "login" ? classes.buttonActive : ""}`} onClick={() => setTab("login")}>
              Login
            </div>
            <div className={`${classes.tabButton} ${tab == "registration" ? classes.buttonActive : ""}`} onClick={() => setTab("registration")} style={{marginLeft: "0.5em"}}>
              Registration
            </div>
          </div>
          {
            tab == "login" 
            ? <Login />
            : tab == "registration"
            ? <Registration />
            : ""
          }
        </div> 
      </Dialog>
  );
};

Affiliates.propTypes = {
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, {})(Affiliates);