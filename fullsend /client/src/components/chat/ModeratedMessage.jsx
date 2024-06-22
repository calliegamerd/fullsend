import React, { Fragment, useState } from "react";
import Moment from 'react-moment';
import { makeStyles } from "@material-ui/core";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { chatSocket } from "../../services/websocket.service";
import { useHistory } from 'react-router-dom';


import PropTypes from "prop-types";
import { connect } from "react-redux";

// MUI Components
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";

import TipModal from "../modals/user/TipModal";

import Kappa from "../../assets/emoji/kappa.png";
import Kek from "../../assets/emoji/kek.png";
import Stonks from "../../assets/emoji/stonks.png";
import Yes from "../../assets/emoji/yes.png";
import No from "../../assets/emoji/no.png";
import Stfu from "../../assets/emoji/stfu.png";
import Knife from "../../assets/emoji/knife.png";
import Chill from "../../assets/emoji/chill.png";
import Fax from "../../assets/emoji/fax.png";
import Cap from "../../assets/emoji/cap.png";
import Bruh from "../../assets/emoji/bruh.png";
import Comrade from "../../assets/emoji/comrade.png";
import Tate from "../../assets/emoji/andrewtate.png";
import BTC from "../../assets/emoji/bitcoin.png";
import Damn from "../../assets/emoji/damn.png";
import Pray from "../../assets/emoji/pray.png";
import Sus from "../../assets/emoji/sus.png";
import Sadge from "../../assets/emoji/sadge.png";
import Tom from "../../assets/emoji/tom.png";
import Yikes from "../../assets/emoji/yikes.png";
import Angry from "../../assets/emoji/angry.png";
import Sad from "../../assets/emoji/sad.png";
import Cry from "../../assets/emoji/pepehands.png";
import Wtf from "../../assets/emoji/wtf.png";
import Swag from "../../assets/emoji/swag.png";
import Fuck from "../../assets/emoji/fuck.png";
import Pepebusiness from "../../assets/emoji/pepebusiness.png";
import Yey from "../../assets/emoji/Yey.png";
import Clown from "../../assets/emoji/clown.png";
import Rip from "../../assets/emoji/rip.png";
import Pepe from "../../assets/emoji/pepe.png";
import Monkas from "../../assets/emoji/monkaS.png";

import Developer from "../../assets/developer.png";
import Highroller from "../../assets/highroller.png";
import Whale from "../../assets/whale.png";

import Profile from "../modals/user/ProfileModal";

import Emoji from './Emoji';

import notifySound from "../../assets/sounds/notification.mp3";
const notifyAudio = new Audio(notifySound);

const useStyles = makeStyles({
  content: {
    width: "100%",
    lineHeight: "1.25rem",
    color: "#C0C1DE",
    fontSize: "13px",
    display: "block",
    fontStyle: "normal",
    whiteSpace: "normal",
    wordWrap: "break-word",
    hyphens: "auto",
    display: "flex",
    flexDirection: "column"
  },
  avatar: {
    width: 25,
    height: 25,
    alignContent: "center",
    borderRadius: "0.25rem",
    cursor: "pointer",
  },
  chatbox: {
    display: "flex",
    fontFamily: "Poppins",
    borderRadius: "0.5em",
    maxWidth: "340px",
    // backgroundColor: "#101123",
    marginBottom: "0.5rem",
    padding: "0.25rem 0.5rem",
    "& .message": {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      fontFamily: "Poppins",
      fontSize: 11,
      gap: "0.5rem"
    },
    "& .username": {
      color: "#fff",
      fontFamily: "Poppins",
      position: "relative",
      fontSize: ".875rem",
      fontStyle: "normal",
      fontWeight: 500,
      lineHeight: "1.25rem",
      display: "flex",
      alignItems: "center",
      cursor: "pointer"
    },
    "& .username2": {
      color: "#9E9FBD",
      fontFamily: "Poppins",
      fontWeight: 500,
      letterSpacing: ".1em",
      position: "relative",
      fontSize: "9.6px",
    },
    "& .developer": {
      opacity: 1,
      marginLeft: "5px"
    },
    "& .whale": {
      marginLeft: "5px"
    },
    "& .highroller": {
      marginLeft: "5px"
    },
    "& .user": {
      background: "#31363c",
      borderRadius: "2.5px",
      fontSize: "9.4px",
      marginRight: 10,
      padding: "5px 4.5px",
      color: "#fff",
      fontFamily: "Poppins",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
    "& .userlevel": {
      padding: "5px 4.5px",
      marginRight: "8px",
      color: "#ffffff",
      fontFamily: "Poppins",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
      borderRadius: "4px",
      fontSize: "9px",
    },
    "& .bronze": {
      background: "#C27C0E",
      borderRadius: "2.5px",
      fontSize: "9.4px",
      marginRight: 10,
      padding: "5px 5.1px",
      color: "#fff",
      fontFamily: "Poppins",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
    "& .silver": {
      background: "#95A5A6",
      borderRadius: "2.5px",
      fontSize: "9.4px",
      marginRight: 10,
      padding: "5px 5.1px",
      color: "#fff",
      fontFamily: "Poppins",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
    "& .gold": {
      background: "#b99309",
      borderRadius: "2.5px",
      fontSize: "9.4px",
      marginRight: 10,
      padding: "5px 5.1px",
      color: "#fff",
      fontFamily: "Poppins",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
    "& .diamond": {
      background: "#3498DB",
      borderRadius: "2.5px",
      fontSize: "9.4px",
      marginRight: 10,
      padding: "5px 5.1px",
      color: "#fff",
      fontFamily: "Poppins",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
  },
  gif: {
    width: "100%",
    borderRadius: 5,
    marginTop: 5,
  },
  contextMenu: {
    background: "#212529",
    border: "1px solid #212529",
    color: "#fff",
    fontFamily: "Poppins",
    fontWeight: 500,
    letterSpacing: ".1em",
    padding: "1rem 0 0 0",
    zIndex: "100",
  },
  contextMenuItem: {
    cursor: "pointer",
    color: "white",
    padding: ".7rem 1.5rem",
    transition: "all .3s ease",
    // borderTop: "1px solid #2d334a42",
    "&:hover": {
      color: "#737990",
    },
  },
});

const Message = ({ rank, message, isAuthenticated, isLoading, user }) => {
  // Declare state
  const classes = useStyles();
  const history = useHistory();

  const emotes = [
    { word: "Kappa", src: `${Kappa}`, alt: "Kappa" },
    { word: "Kek", src: `${Kek}`, alt: "Kek" },
    { word: "Stonks", src: `${Stonks}`, alt: "Stonks" },
    { word: "Yes", src: `${Yes}`, alt: "Yes" },
    { word: "No", src: `${No}`, alt: "Yes" },
    { word: "Stfu", src: `${Stfu}`, alt: "Yes" },
    { word: "Knife", src: `${Knife}`, alt: "Knife" },
    { word: "Chill", src: `${Chill}`, alt: "Chill" },
    { word: "Fax", src: `${Fax}`, alt: "Fax" },
    { word: "Cap", src: `${Cap}`, alt: "Cap" },
    { word: "Bruh", src: `${Bruh}`, alt: "Bruh" },
    { word: "Comrade", src: `${Comrade}`, alt: "Comrade" },
    { word: "Tate", src: `${Tate}`, alt: "Tate" },
    { word: "BTC", src: `${BTC}`, alt: "BTC" },
    { word: "Damn", src: `${Damn}`, alt: "Damn" },
    { word: "Pray", src: `${Pray}`, alt: "Pray" },
    { word: "Sus", src: `${Sus}`, alt: "Sus" },
    { word: "Sadge", src: `${Sadge}`, alt: "Sadge" },
    { word: "Tom", src: `${Tom}`, alt: "Tom" },
    { word: "Yikes", src: `${Yikes}`, alt: "Yikes" },
    { word: "Angry", src: `${Angry}`, alt: "Angry" },
    { word: "Sad", src: `${Sad}`, alt: "Sad" },
    { word: "WTF", src: `${Wtf}`, alt: "WTF" },
    { word: "Swag", src: `${Swag}`, alt: "Swag" },
    { word: "Fuck", src: `${Fuck}`, alt: "Fuck" },
    { word: "Clown", src: `${Clown}`, alt: "Clown" },
    { word: "Yey", src: `${Yey}`, alt: "Yey" },
    { word: "Pepe", src: `${Pepe}`, alt: "Pepe" },
    { word: "MonkaS", src: `${Monkas}`, alt: "MonkaS" },
    { word: "Rip", src: `${Rip}`, alt: "Rip" },
    { word: "Cry", src: `${Cry}`, alt: "Cry" },
    { word: "Pepebusiness", src: `${Pepebusiness}`, alt: "Pepebusiness" },
  ];

  const [modalVisible, setModalVisible] = useState(false);
  const [profile, setProfile] = useState(false);

  const openTipUserModal = () => {
    setModalVisible(true);
  }

  // MenuItem onClick event handler
  const onContextClick = (event, action, props) => {
    switch (action) {
      case "mute":
        return chatSocket.emit(
          "send-chat-message",
          `.mute-user ${props.userId}`
        );
      case "ban":
        return chatSocket.emit(
          "send-chat-message",
          `.ban-user ${props.userId}`
        );
      case "remove-message":
        return chatSocket.emit(
          "send-chat-message",
          `.remove-message ${props.msgId}`
        );
      default:
        break;
    }
  };

  const handleLeftClick = e => {
    openTipUserModal();
  };

  const isBattleLink = /https:\/\/fullsend.gg\/battles\/([a-f0-9]+)$/i;
  const match = message.content.match(isBattleLink);

  return (
    <Fragment>
      <TipModal
        handleClose={() => setModalVisible(!modalVisible)}
        open={modalVisible}
        userId={message.user.id}
        userName={message.user.username}
        userAvatar={message.user.avatar}
      />
      <Profile 
        handleClose={() => setProfile(!profile)}
        open={profile}
        userid={message.user.id}
      />
      {
        rank >= 5 ? (
          <Fragment>
            <ContextMenu className={classes.contextMenu} id={message.msgId}>
              <p style={{ marginTop: 0, paddingLeft: "1.5rem", color: "#4F79FD" }}>
                CONTROLS:
              </p>
              <MenuItem
                className={classes.contextMenuItem}
                onClick={e =>
                  onContextClick(e, "remove-message", {
                    msgId: message.msgId,
                  })
                }
              >
                <i className="fas fa-trash-alt" /> DELETE MESSAGE
              </MenuItem>
              <MenuItem
                className={classes.contextMenuItem}
                onClick={e => onContextClick(e, "mute", { userId: message.user.id })}
              >
                <i className="fas fa-microphone-slash Blue" /> MUTE USER
              </MenuItem>
              <MenuItem
                className={classes.contextMenuItem}
                onClick={e =>
                  onContextClick(e, "ban", {
                    userId: message.user.id,
                  })
                }
              >
                <i className="fas fa-gavel Red" /> BAN USER
              </MenuItem>
            </ContextMenu>
          </Fragment>
        ) : (
          <Fragment>
          </Fragment>
        )
      }
      <ContextMenuTrigger id={message.msgId}>
        <Box 
          className={classes.chatbox} 
          // style={{ background: message.content.toLowerCase().includes("@" + user?.username) ? "#2871FF" : "101123" }} 
        >
          <div className="message">
           <Avatar
              src={message.user.avatar}
              className={classes.avatar}
              onClick={() => setProfile(!profile)}
            />
            <div className={classes.content}>
              <span
                className="username"
                style={{
                  color: message.user.rank === 5 ? "#FF2121" : message.user.rank === 4 ? "#00A0FF" : message.user.rank === 3 ? "#FCBF2D" : "#fff",
                  display: 'flex',
                  alignItems: 'center'
                }}
                onClick={() => setProfile(!profile)}
              >
                {message.user.username}:
              </span>
              {match ? (
                <span onClick={() => history.push(`/battles/${match[1]}`)} style={{ color: "#2871FF", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7.99186 13.5825C7.82009 13.5806 7.65572 13.5123 7.53302 13.392L2.59829 8.44578C2.49 8.32756 2.42993 8.17302 2.42993 8.01266C2.42993 7.8523 2.49 7.69776 2.59829 7.57955L9.86187 0.190571C9.98352 0.0686989 10.1486 0.000151636 10.3207 0H15.2987C15.4686 0 15.6316 0.0675352 15.7517 0.187748C15.8719 0.307962 15.9394 0.471006 15.9394 0.641013L16 5.56122C16.0002 5.7361 15.9318 5.90408 15.8095 6.02899L8.44205 13.4006C8.31927 13.5143 8.15911 13.579 7.99186 13.5825ZM3.96617 7.98668L7.99186 12.006L14.7014 5.29269L14.6581 1.29069H10.5977L3.96617 7.98668Z" fill="currentColor"></path><path d="M10.416 15.9993C10.3305 16.0013 10.2455 15.9853 10.1665 15.9525C10.0875 15.9197 10.0162 15.8707 9.95715 15.8088L0.174267 6.02898C0.0595732 5.90582 -0.00286679 5.74293 0.000101159 5.57462C0.00306911 5.40631 0.0712134 5.24572 0.190178 5.12669C0.309142 5.00766 0.469637 4.93947 0.637852 4.9365C0.806066 4.93353 0.968866 4.99601 1.09195 5.11077L10.8748 14.9165C10.9964 15.0383 11.0647 15.2035 11.0647 15.3756C11.0647 15.5478 10.9964 15.7129 10.8748 15.8347C10.7495 15.948 10.5846 16.0071 10.416 15.9993Z" fill="currentColor"></path><path d="M3.61998 15.9473C3.46095 15.9445 3.30788 15.8863 3.18711 15.7828L0.200297 12.7943C0.138686 12.7314 0.0901349 12.6569 0.0574447 12.5751C0.0247546 12.4933 0.00857299 12.4059 0.00983405 12.3178C0.00983405 11.9627 0.00983415 11.954 3.57669 8.48907C3.69843 8.36741 3.86347 8.29907 4.03553 8.29907C4.2076 8.29907 4.37263 8.36741 4.49438 8.48907C4.61597 8.61089 4.68427 8.77601 4.68427 8.94818C4.68427 9.12034 4.61597 9.28547 4.49438 9.40728C3.37757 10.5074 2.16553 11.7028 1.55951 12.3178L3.61998 14.3795L6.52887 11.4516C6.58856 11.3903 6.65991 11.3416 6.73871 11.3083C6.81752 11.2751 6.90218 11.2579 6.98771 11.2579C7.07324 11.2579 7.1579 11.2751 7.23671 11.3083C7.31551 11.3416 7.38687 11.3903 7.44655 11.4516C7.56815 11.5734 7.63645 11.7385 7.63645 11.9107C7.63645 12.0829 7.56815 12.248 7.44655 12.3698L4.05285 15.7828C3.93285 15.8876 3.77929 15.946 3.61998 15.9473Z" fill="currentColor"></path></svg>
                  Case Battle
                </span>
              ) : (
                <span>{message.content}</span>
              )}
            </div>
          </div>
        </Box>
      </ContextMenuTrigger>
    </Fragment>
  );
};

Message.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  user: state.auth.user,
});

export default connect(mapStateToProps, {})(Message);
