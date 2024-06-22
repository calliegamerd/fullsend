import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import logo from "../assets/navbar/logo2.png";

// Custom styles
const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
    width: "100%",
    display: "flex",
    color: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  box: {
    padding: "2rem",
    backgroundColor: "#0A0B1C",
    borderRadius: "0.25rem"
  },
  socialMediaContainer: {
    display: "flex",
    marginTop: "2rem",
    gap: "0.5rem",
  },
  socialMedia: {
    backgroundColor: "#131426",
    borderRadius: "0.25rem",
    padding: "0.5rem",
    color: "#4D527C",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    width: "50px",
    height: "50px",
    transitionDuration: "300ms",
    "&:hover": {
      filter: "brightness(125%)"
    }
  },
}));

const Maintenance = () => {
  // Declare State
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.box}>
        <img src={logo} style={{marginBottom: "2rem", width: 200}} />
        <div>We are currently undergoing maintenance. You can find more information on our socials.</div>
        <div>— Fullsend.gg Team</div>
        <div className={classes.socialMediaContainer}>
          <a href="https://discord.gg/j82fApKDRb" target="_blank" rel="noreferrer"><div className={classes.socialMedia}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20.317 4.37579C18.7873 3.67391 17.147 3.15679 15.4319 2.86062C15.4007 2.8549 15.3695 2.86919 15.3534 2.89776C15.1424 3.27297 14.9087 3.76247 14.7451 4.14721C12.9004 3.87104 11.0652 3.87104 9.25832 4.14721C9.09465 3.75392 8.85248 3.27297 8.64057 2.89776C8.62449 2.87014 8.59328 2.85585 8.56205 2.86062C6.84791 3.15584 5.20756 3.67296 3.67693 4.37579C3.66368 4.3815 3.65233 4.39103 3.64479 4.40341C0.533392 9.05177 -0.31895 13.5859 0.0991801 18.0638C0.101072 18.0857 0.11337 18.1066 0.130398 18.1199C2.18321 19.6275 4.17171 20.5427 6.12328 21.1493C6.15451 21.1589 6.18761 21.1474 6.20748 21.1217C6.66913 20.4913 7.08064 19.8265 7.43348 19.1275C7.4543 19.0866 7.43442 19.038 7.39186 19.0218C6.73913 18.7742 6.1176 18.4723 5.51973 18.1295C5.47244 18.1019 5.46865 18.0342 5.51216 18.0018C5.63797 17.9076 5.76382 17.8095 5.88396 17.7104C5.90569 17.6923 5.93598 17.6885 5.96153 17.6999C9.88928 19.4932 14.1415 19.4932 18.023 17.6999C18.0485 17.6876 18.0788 17.6914 18.1015 17.7095C18.2216 17.8085 18.3475 17.9076 18.4742 18.0018C18.5177 18.0342 18.5149 18.1019 18.4676 18.1295C17.8697 18.479 17.2482 18.7742 16.5945 19.0209C16.552 19.0371 16.533 19.0866 16.5538 19.1275C16.9143 19.8256 17.3258 20.4903 17.7789 21.1208C17.7978 21.1474 17.8319 21.1589 17.8631 21.1493C19.8241 20.5427 21.8126 19.6275 23.8654 18.1199C23.8834 18.1066 23.8948 18.0866 23.8967 18.0647C24.3971 12.8878 23.0585 8.39085 20.3482 4.40435C20.3416 4.39103 20.3303 4.3815 20.317 4.37579ZM8.02002 15.3372C6.8375 15.3372 5.86313 14.2516 5.86313 12.9183C5.86313 11.585 6.8186 10.4993 8.02002 10.4993C9.23087 10.4993 10.1958 11.5945 10.1769 12.9183C10.1769 14.2516 9.22141 15.3372 8.02002 15.3372ZM15.9947 15.3372C14.8123 15.3372 13.8379 14.2516 13.8379 12.9183C13.8379 11.585 14.7933 10.4993 15.9947 10.4993C17.2056 10.4993 18.1705 11.5945 18.1516 12.9183C18.1516 14.2516 17.2056 15.3372 15.9947 15.3372Z" fill="#4D527C"/></svg>
          </div></a>
          <a href="https://twitter.com/FullsenddotGG" target="_blank" rel="noreferrer"><div className={classes.socialMedia}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none"><path d="M20 0.00896646C19.1294 0.611275 18.1656 1.07195 17.1455 1.37324C16.5979 0.755757 15.8703 0.318104 15.0609 0.119469C14.2516 -0.0791667 13.3995 -0.0292013 12.6201 0.262607C11.8406 0.554416 11.1713 1.07399 10.7027 1.75105C10.2341 2.42812 9.98882 3.23001 10 4.04827V4.93995C8.40239 4.98058 6.81934 4.63305 5.39183 3.92829C3.96431 3.22354 2.73665 2.18345 1.81818 0.900645C1.81818 0.900645 -1.81818 8.92575 6.36364 12.4925C4.49139 13.739 2.26105 14.364 0 14.2758C8.18182 18.7342 18.1818 14.2758 18.1818 4.02152C18.181 3.77315 18.1566 3.52539 18.1091 3.28143C19.0369 2.38395 19.6917 1.25082 20 0.00896646Z" fill="#4D527C"/></svg>
          </div></a>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
