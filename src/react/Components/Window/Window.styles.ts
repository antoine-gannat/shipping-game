import { createUseStyles } from "react-jss";

export const useStyles = createUseStyles({
  root: {
    color: "white",
    width: "auto",
    position: "absolute",
    zIndex: 11,
    backgroundColor: "grey",
    userSelect: "none",
    borderRadius: "5px",
    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)",
    padding: "10px",
  },
  button: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "3px",
  },
  heading: {
    textAlign: "center",
    height: "25px",
    fontSize: "17px",
    "& hr": {
      width: "80%",
      margin: "0 auto",
    },
  },
});
