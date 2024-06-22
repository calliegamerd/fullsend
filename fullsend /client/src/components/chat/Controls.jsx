import React, { useEffect, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core";
import { chatSocket } from "../../services/websocket.service";
import { useToasts } from "react-toast-notifications";

import PropTypes from "prop-types";
import { connect } from "react-redux";

// MUI Components
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

// Components
import ChatRulesModal from "../modals/ChatRulesModal";
import ChatCommandsModal from "../modals/ChatCommandsModal";
import ControlsOnline from "./ControlsOnline";

// Components
import Rain from "./Rain";
import Trivia from "./Trivia";

import notifySound from "../../assets/sounds/notification.mp3";
const notifyAudio = new Audio(notifySound);

// Custom styles
const useStyles = makeStyles(theme => ({
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    display: "flex",
    flexDirection: "column",
    marginTop: "1rem",
    "& .MuiIconButton-root.Mui-disabled": {
      color: "rgb(91 99 104)",
    },
  },
  icon: {
    color: "#343a5b",
    marginLeft: "auto",
    fontSize: 15,
  },
  online: {
    display: "flex",
    alignItems: "center",
    marginLeft: "1rem",
    color: "#4b4f51",
    fontFamily: "Poppins",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: ".1em",
    "& span": {
      marginRight: 5,
      color: "#234224",
      fontFamily: "Poppins",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".1em",
    },
    "& p": {
      marginRight: 3,
    },
  },
  giphy: {
    background: "#3c4046",
    padding: 10,
    borderRadius: 5,
    position: "absolute",
    width: "285px",
    zIndex: 100,
    fontFamily: "Poppins",
    fontWeight: "500",
    bottom: "4rem",
    left: "10rem",
    opacity: 1,
    pointerEvents: "all",
    transition: "opacity 0.25s ease",
    "& input": {
      background: "#101123",
      border: "none",
      borderRadius: "6px",
      color: "white",
      fontFamily: "Poppins",
      fontWeight: "500",
      paddingLeft: 10,
      "&::placeholder": {
        fontFamily: "Poppins",
        fontWeight: "500",
        color: "#9d9d9d6b",
      },
    },
  },
  removed: {
    background: "#101123",
    padding: 10,
    borderRadius: 5,
    position: "absolute",
    zIndex: 100,
    bottom: "4rem",
    left: "10rem",
    "& input": {
      background: "#101123",
      border: "none",
      color: "#e0e0e0",
      fontFamily: "Poppins",
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: ".1em",
      paddingLeft: 10,
      "&::placeholder": {
        color: "#9d9d9d6b",
        fontFamily: "Poppins",
        fontSize: "13px",
        fontWeight: 500,
        letterSpacing: ".1em",
      },
    },
    opacity: 0,
    pointerEvents: "none",
    transition: "opacity 0.25s ease",
  },
  subFaq: {
    textDecoration: "none",
    "& > button": {
      color: "#707479",
      fontFamily: "Poppins",
      fontSize: "12.5px",
      fontWeight: 500,
      letterSpacing: ".05em",
      "& img": {
        opacity: 0.15,
      },
      "&:hover": {
        backgroundColor: "#101123",
        color: "#e0e0e0",
        "& span .MuiButton-startIcon": {
          color: "hsl(230, 50%, 50%)",
        },
      },
      "&:active": {
        color: "#e0e0e0",
      },
      "& span .MuiButton-startIcon": {
        marginRight: "20px",
        marginLeft: "21px",
      },
    },
  },
  reverse5: {
    marginTop: "30px",
    right: "29px",
    position: "absolute",
    color: "rgb(91 99 104)",
    "&:hover": {
      backgroundColor: "#101123",
      transition: "125ms ease",
      transform: "scale(1.07)",
    },
    "& .MuiIconButton-root.Mui-disabled": {
      color: "rgb(91 99 104)",
    },
  },
  reverse: {
    textTransform: "capitalize",
  },
  reverse2: {
    display: "flex",
    outline: "none",
    minWidth: 0,
    minHeight: 0,
    flexShrink: 0,
    padding: "8px 9px 2px 9px",
    borderRadius: "50%",
    marginRight: "4px",
    "&:hover": {
      backgroundColor: "#29363d",
    },
  },
  reverse3: {
    display: "flex",
    minWidth: 0,
    minHeight: 0,
    flexShrink: 0,
    padding: "8px 9px 2px 9px",
    borderRadius: "50%",
    marginRight: "80px",
    [theme.breakpoints.down("xs")]: {
      marginRight: "160px",
    },
    [theme.breakpoints.down("sm")]: {
      marginRight: "160px",
    },
    [theme.breakpoints.down("md")]: {
      marginRight: "160px",
    },
    "&:hover": {
      backgroundColor: "#29363d",
    },
  },
  lower: {
    display: "flex",
    background: "transparent",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem 0 0 0",
    color: "#fff",
    textAlign: "center",
    fontWeight: 500,
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
    fill: "currentColor",
    flex: "none",
    width: "1.25em",
    height: "1.25em",
    display: "inline-block",
    outline: "none",
  },
  boxed: {
    width: "calc(100% - 2rem)",
    borderRadius: "0.25rem",
    margin: "1rem",
    padding: "1rem",
    paddingBottom: 0,
    marginBottom: 10,
    fontWeight: 400,
    color: "hsl(220, 22%, 90%)",
    background: "#101123"
  },
  sendButton: {
    backgroundColor: "#151B37",
    color: "#2871FF",
    padding: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    cursor: "pointer",
    transitionDuration: "300ms",
    "&:hover": {
      filter: "brightness(125%)"
    }
  },
  emojiBox: {
    backgroundColor: "#101123",
    borderRadius: "0.75rem",
    padding: "0.75rem",
    margin: "0.5rem 0",
    display: "flex",
    gap: "0.45rem"
  },
  image: {
    height: 24,
    width: 24,
    cursor: "pointer",
  },
  onlineContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.3rem",
    color: "#9E9FBD",
  }
}));

const ChatInput = withStyles({
  root: {
    width: "100%",
    background: "#101123",
    borderRadius: "0.25rem",
    "& :before": {
      display: "none",
    },
    "& :after": {
      display: "none",
    },
    "& label": {
      color: "#60658E",
      fontSize: 15,
    },
    "& .MuiInputLabel-root": {
      display: "none"
    },
    "& .MuiInputBase-root": {
      padding: "1.5rem 0.4rem"
    },
    "& div input": {
      color: "#9E9FBD",
      fontFamily: "Poppins",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
      padding: "1rem 0.25rem",
    },
    "& div": {
      height: "2.5rem",
      borderRadius: 4,
    },
  }
})(TextField);

const Controls = ({ isAuthenticated, rain, trivia }) => {
  // Declare state
  const classes = useStyles();
  const { addToast } = useToasts();

  const [input, setInput] = useState("");
  const [usersOnline, setUsersOnline] = useState(0);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [createRainVisible, setCreateRainVisible] = useState(false);
  const [notificationOn, setNotificationOn] = useState(true);
  const [openCommands, setOpenCommands] = useState(false);

  // TextField onKeyPress event handler
  const onKeyPress = es => {
    // If enter was pressed
    if (es.key === "Enter") {
      chatSocket.emit("send-chat-message", input);
      setInput("");
      return false;
    }
  };

  // Button onClick event handler
  const onClick = () => {
    chatSocket.emit("send-chat-message", input);
    setInput("");
  };

  // Input onChange event handler
  const onChange = e => {
    setInput(e.target.value);
  };

  const onEmoji = (e) => {
    chatSocket.emit("send-chat-message", e);
  };

  // TextInput onFocus event handler
  const onFocus = () => {
    const agreed = Boolean(window.localStorage.getItem("chat-rules-agreed"));

    // If user hasn't agreed the rules on this device
    if (!agreed) {
      setChatModalVisible(state => !state);
      window.localStorage.setItem("chat-rules-agreed", "true");
    }
  };

  const notify = (msg) => {
    notifyAudio.play();
    addToast(msg, { appearance: "info" });
  };

  const updateUsersOnline = newCount => {
    setUsersOnline(newCount+10);
  };

  useEffect(() => {
    chatSocket.on("users-online", updateUsersOnline);
    chatSocket.on("notification", notify);
    return () => {
      chatSocket.off("users-online", updateUsersOnline);
      chatSocket.off("notification", notify);
    };
  }, []);


  return (
    <Box>
      <ChatRulesModal
        open={chatModalVisible}
        handleClose={() => setChatModalVisible(!chatModalVisible)}
      />
      <ChatCommandsModal
        open={openCommands}
        handleClose={() => setOpenCommands(!openCommands)}
      />
      {trivia && trivia.active && <Trivia trivia={trivia} />}
      <Box className={classes.input}>
        <ChatInput
          label={isAuthenticated ? "Type your message..." : "Sign in or Sign up to chat"}
          variant="filled"
          onChange={onChange}
          onFocus={onFocus}
          onKeyPress={onKeyPress}
          value={input}
          InputProps={{
            endAdornment: (
              <span className={classes.sendButton}>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M8.7496 11.25L17.4996 2.50004M8.85591 11.5234L11.046 17.1551C11.2389 17.6512 11.3354 17.8993 11.4744 17.9717C11.5949 18.0345 11.7385 18.0346 11.859 17.9719C11.9981 17.8997 12.0949 17.6517 12.2884 17.1558L17.7803 3.0827C17.955 2.63505 18.0424 2.41123 17.9946 2.2682C17.9531 2.144 17.8556 2.04652 17.7314 2.00503C17.5884 1.95725 17.3646 2.0446 16.9169 2.21929L2.84381 7.71124C2.34791 7.90476 2.09997 8.00152 2.02771 8.14061C1.96507 8.26118 1.96515 8.40472 2.02794 8.52522C2.10036 8.66422 2.34842 8.76069 2.84454 8.95363L8.47621 11.1437C8.57692 11.1829 8.62727 11.2025 8.66967 11.2327C8.70725 11.2595 8.74012 11.2924 8.76692 11.33C8.79717 11.3724 8.81675 11.4227 8.85591 11.5234Z" stroke="#2871FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            ),
            startAdornment: (<></>),
          }}
        />
        <div className={classes.lower}>
          <div className={classes.popupButton} onClick={() => setOpenCommands(!openCommands)}>
            <svg className={classes.buttonIcon} xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M2 6C2 4.34315 3.34315 3 5 3H19C20.6569 3 22 4.34315 22 6V18C22 19.6569 20.6569 21 19 21H5C3.34315 21 2 19.6569 2 18V6ZM5 5C4.44772 5 4 5.44772 4 6V7H20V6C20 5.44772 19.5523 5 19 5H5ZM4 18V9H20V18C20 18.5523 19.5523 19 19 19H5C4.44772 19 4 18.5523 4 18ZM7.70711 11.2929C7.31658 10.9024 6.68342 10.9024 6.29289 11.2929C5.90237 11.6834 5.90237 12.3166 6.29289 12.7071L7.58579 14L6.29289 15.2929C5.90237 15.6834 5.90237 16.3166 6.29289 16.7071C6.68342 17.0976 7.31658 17.0976 7.70711 16.7071L9.70711 14.7071C10.0976 14.3166 10.0976 13.6834 9.70711 13.2929L7.70711 11.2929Z" fill="currentColor"/></svg>
            Commands      
          </div>
          <div className={classes.popupButton} onClick={() => setChatModalVisible(!chatModalVisible)} >
            <svg className={classes.buttonIcon} tabIndex="-1" viewBox="0 0 448 512"><path d="M448 360V24c0-13.3-10.7-24-24-24H96C43 0 0 43 0 96v320c0 53 43 96 96 96h328c13.3 0 24-10.7 24-24v-16c0-7.5-3.5-14.3-8.9-18.7-4.2-15.4-4.2-59.3 0-74.7 5.4-4.3 8.9-11.1 8.9-18.6zM128 134c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm0 64c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm253.4 250H96c-17.7 0-32-14.3-32-32 0-17.6 14.4-32 32-32h285.4c-1.9 17.1-1.9 46.9 0 64z"></path></svg>
            Rules
          </div>
          <div className={classes.onlineContainer}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="hsl(215, 75%, 50%)" width="14px" height="14px" viewBox="-2 -2 24 24" preserveAspectRatio="xMinYMin"><path d="M3.534 10.07a1 1 0 1 1 .733 1.86A3.579 3.579 0 0 0 2 15.26V17a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1.647a3.658 3.658 0 0 0-2.356-3.419 1 1 0 1 1 .712-1.868A5.658 5.658 0 0 1 14 15.353V17a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3v-1.74a5.579 5.579 0 0 1 3.534-5.19zM7 0a4 4 0 0 1 4 4v2a4 4 0 1 1-8 0V4a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v2a2 2 0 1 0 4 0V4a2 2 0 0 0-2-2zm10 3h2a1 1 0 0 1 0 2h-2v2a1 1 0 0 1-2 0V7h-2a1 1 0 0 1 0-2h2V3a1 1 0 0 1 2 0v2z"/></svg>
            {usersOnline}
          </div>
        </div>
      </Box>
    </Box>
  );
};

Controls.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {})(Controls);