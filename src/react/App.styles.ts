import { createUseStyles } from "react-jss";

export const useStyles = createUseStyles({
  root: {
    top: 0,
    left: 0,
    width: "100%",
    position: "absolute",
    zIndex: 10,
    backgroundColor: "transparent",
    fontFamily: "Segoe UI",
    scrollbarColor: "rgb(200,200,200) transparent",
    scrollbarWidth: "thin",
  },
  leftWindows: {
    position: "absolute",
    top: "70px",
    left: 0,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: "10px",
    padding: 10,
  },
});
