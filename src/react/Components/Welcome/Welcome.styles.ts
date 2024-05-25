import { createUseStyles } from "react-jss";

export const useStyles = createUseStyles({
  welcome: {
    position: "absolute",
    display: "flex",
    left: 0,
    top: 0,
    height: "100vh",
    width: "100%",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "#fff",
    boxSizing: "border-box",
    userSelect: "none",
  },
});
