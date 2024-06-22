import React from "react";
import { makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";

const useStyles = makeStyles(theme => ({
  root: {
    position: "absolute",
    top: "125%",
    right: -25,
    width: "350px",
    height: "300px",
    backgroundColor: "#050614",
    borderRadius: "0.25rem",
    zIndex: 1000,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    overflow: "hidden",
    cursor: "default",
  },
  topBar: {
    padding: "0.75rem 1rem",
    backgroundColor: "#1a1b33", 
    color: "#fff",
    fontWeight: 500,
  },
  notificationsContainer: {
    height: "100%",
    width: "100%",
    flex: 1,
    padding: "0.75rem",
    overflow: "hidden",
    overflowY: "scroll",
    scrollbarWidth: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    color: "#9E9FBD",
    fontSize: "12px",
    gap: "0.5rem",
    "&::after": {
      content: '""',
      bottom: 0,
      left: 0,
      right: 0,
      height: "3rem",
      background: "linear-gradient(transparent, #0A0B1C)",
    }
  },
  notificationItem: {
    width: "100%",
    display: "flex",
    alignItems: "flex-start", 
    backgroundColor: "#1a1b33",
    padding: "0.5rem",
    borderRadius: "0.25rem",
  },
  icon: {
    height: "2.5rem",
    width: "2.5rem",
    padding: "0.5rem",
    borderRadius: "50%",
    marginRight: "0.5rem",
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationHeader: {
    color: "#fff",
    fontWeight: 500,
    fontSize: "0.85rem",
  },
  notificationDescription: {
    color: "#9E9FBD",
    fontSize: "0.6rem",
  }
}));



const Notifications = ({ isAuthenticated, isLoading, user }) => {
  const classes = useStyles();
  /*const notifications = [
    { type: "deposit", header: "Successful Deposit", description: "Your deposit of $500 has been successfully credited to your account." },
    { type: "withdraw", header: "Withdrawal Completed", description: "You have withdrawn $200 from your account." },
    { type: "tip", header: "You Received a Tip", description: "Alice tipped you $15 for your help!" },
    { type: "rain", header: "Rain Received", description: "You received $5 from today's rain event!" },
  ];*/

  const notifications = [];

  const getIcon = (type) => {
    let svg;
    const iconStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '3rem',
      width: '3rem',
      borderRadius: '50%',
      marginRight: '0.5rem',
    };      

    const returnSvg = (type) => {
      switch(type) {
        case "deposit":
          iconStyle.color = "linear-gradient(135deg, #76ed92 0%, #1cd4af 100%)"; 
          return svg = <svg style={iconStyle} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M5.03466 7.36551L6.26117 6.18628L8.14676 8.0719L8.14676 2.03479L9.85301 2.03479L9.85301 8.0719L11.7386 6.18628L12.9651 7.36551L8.99989 11.3307L5.03466 7.36551ZM2.09743 8.96415L3.8037 8.96415L3.8037 14.259L14.1961 14.259L14.1961 8.96415L15.9023 8.96415L15.9023 15.9653L2.09743 15.9653L2.09743 8.96415Z" fill="currentColor"></path></g></svg>;
        case "tip":
          iconStyle.color = "linear-gradient(135deg, #76ed92 0%, #1cd4af 100%)";
          return svg = <svg style={iconStyle} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" ><g><path d="M4.5 15C3.675 15 2.96875 14.7062 2.38125 14.1187C1.79375 13.5312 1.5 12.825 1.5 12V6C1.5 5.175 1.79375 4.46875 2.38125 3.88125C2.96875 3.29375 3.675 3 4.5 3H13.5C14.325 3 15.0313 3.29375 15.6188 3.88125C16.2063 4.46875 16.5 5.175 16.5 6V12C16.5 12.825 16.2063 13.5312 15.6188 14.1187C15.0313 14.7062 14.325 15 13.5 15H4.5ZM4.5 6H13.5C13.775 6 14.0375 6.03125 14.2875 6.09375C14.5375 6.15625 14.775 6.25625 15 6.39375V6C15 5.5875 14.8531 5.23437 14.5594 4.94062C14.2656 4.64687 13.9125 4.5 13.5 4.5H4.5C4.0875 4.5 3.73438 4.64687 3.44063 4.94062C3.14688 5.23437 3 5.5875 3 6V6.39375C3.225 6.25625 3.4625 6.15625 3.7125 6.09375C3.9625 6.03125 4.225 6 4.5 6ZM3.1125 8.4375L11.4563 10.4625C11.5688 10.4875 11.6813 10.4875 11.7938 10.4625C11.9063 10.4375 12.0125 10.3875 12.1125 10.3125L14.7188 8.1375C14.5813 7.95 14.4063 7.79687 14.1938 7.67812C13.9813 7.55937 13.75 7.5 13.5 7.5H4.5C4.175 7.5 3.89063 7.58437 3.64688 7.75312C3.40313 7.92187 3.225 8.15 3.1125 8.4375Z" fill="currentColor"></path></g></svg>
        case "withdraw":
          iconStyle.color = "linear-gradient(135deg, #f85032 0%, #e73827 100%)"; 
          return svg = <svg style={iconStyle} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M12.9653 5.9955L11.7388 7.1747L9.85324 5.28911L9.85324 11.3307L8.14699 11.3307L8.14699 5.28911L6.26139 7.1747L5.03488 5.9955L9.00011 2.03475L12.9653 5.9955ZM15.9026 15.9652L2.09766 15.9652L2.09766 8.96411L3.80392 8.96411L3.80392 14.2589L14.1963 14.2589L14.1963 8.96411L15.9026 8.96411L15.9026 15.9652Z" fill="currentColor"></path></g></svg>
        case "rain":
          iconStyle.color = "linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)"; 
          return svg = <svg style={iconStyle} width="18" height="18" viewBox="0 0 512 512" fill="none"><path d="M416 128c-.6 0-1.1.2-1.6.2 1.1-5.2 1.6-10.6 1.6-16.2 0-44.2-35.8-80-80-80-24.6 0-46.3 11.3-61 28.8C256.4 24.8 219.3 0 176 0 114.1 0 64 50.1 64 112c0 7.3.8 14.3 2.1 21.2C27.8 145.8 0 181.5 0 224c0 53 43 96 96 96h320c53 0 96-43 96-96s-43-96-96-96zM48 368c-8.8 0-16 7.2-16 16v80c0 8.8 7.2 16 16 16s16-7.2 16-16v-80c0-8.8-7.2-16-16-16zm96 32c-8.8 0-16 7.2-16 16v80c0 8.8 7.2 16 16 16s16-7.2 16-16v-80c0-8.8-7.2-16-16-16zm96-32c-8.8 0-16 7.2-16 16v80c0 8.8 7.2 16 16 16s16-7.2 16-16v-80c0-8.8-7.2-16-16-16zm96 32c-8.8 0-16 7.2-16 16v80c0 8.8 7.2 16 16 16s16-7.2 16-16v-80c0-8.8-7.2-16-16-16zm96-32c-8.8 0-16 7.2-16 16v80c0 8.8 7.2 16 16 16s16-7.2 16-16v-80c0-8.8-7.2-16-16-16z" fill="currentColor"></path></svg>
      }
    }
  
    return returnSvg(type);
  };
  


  return (
    <div className={classes.root}>
      <div className={classes.topBar}>
        {notifications.length} notifications
      </div>
      <div className={classes.notificationsContainer}>
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div key={index} className={classes.notificationItem}>
              {getIcon(notification.type)}
              <div className={classes.notificationTextContainer}>
                <div className={classes.notificationHeader}>{notification.header}</div>
                <div className={classes.notificationDescription}>{notification.description}</div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <svg height="50" width="50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path data-v-184d15a3="" fill="currentColor" d="M638.4 313.9c-2.1-5.9-6.4-11.2-12.9-14.5-21-10.8-58.3-24.9-87.4-105-.8-2.2-14.7-40.5-15.4-42.6C503 97.6 451.8 64 397.4 64c-15.1 0-30.5 2.6-45.6 8.1-3.6 1.3-6.6 3.3-10 4.8-14.2-16-32.1-29-53.5-36.8-15-5.5-30.5-8.1-45.6-8.1-54.5 0-105.6 33.6-125.3 87.8-.8 2.1-14.6 40.4-15.4 42.6-29.2 80.1-66.4 94.3-87.4 105-6.5 3.3-10.8 8.6-12.9 14.5-4.6 12.9 1 28.8 16 34.2l82 29.9c-2.1 7-3.6 14.3-3.6 22 0 44.2 35.8 80 80 80 32.6 0 60.5-19.6 72.9-47.7l42.1 15.3c-2.8 6.5-7.5 14.8-3.4 26 4.9 13.1 19.6 21.3 34.3 15.9l76-27.7c11.8 29.4 40.5 50.1 74.1 50.1 44.2 0 80-35.8 80-80 0-8.7-1.9-16.8-4.6-24.5l75-27.3c14.9-5.4 20.5-21.3 15.9-34.2zM176 416c-26.5 0-48-21.5-48-48 0-3.9.6-7.5 1.5-11.1l88.9 32.4C210.6 405 194.7 416 176 416zm124.7-30.9L40.1 290.3c24.5-12.8 63.2-38.2 91.8-117 8.3-22.9 5.1-14.1 15.4-42.6C161.9 90.8 200.2 64 242.6 64c44.7 0 70.8 29.1 71.6 29.9-43.3 34.8-62.2 94-42.2 149.1.8 2.1 14.8 40.4 15.6 42.6 16.9 46.4 17.4 77.3 13.1 99.5zM472 448c-19.7 0-36.1-12.2-43.4-29.3l89.3-32.5c1.3 4.4 2.1 9 2.1 13.8 0 26.5-21.5 48-48 48zm-149.5-24.8c10.6-25.6 23.8-69.8-4.8-148.7-9.6-26.3-5.5-15-15.6-42.6-19.1-52.5 8.1-110.8 60.6-129.9 53-19.3 110.9 8.5 129.9 60.6 9.7 26.7 5 13.8 15.4 42.6 28.7 78.8 67.3 104.2 91.8 117l-277.3 101z" class=""></path></svg>
            You don't have any new notifications
          </div>
        )}
      </div>
    </div>
  );
};

Notifications.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  user: PropTypes.object,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(Notifications);