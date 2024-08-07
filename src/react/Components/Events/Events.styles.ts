import { createUseStyles } from "react-jss";

export const useStyles = createUseStyles({
  container: {
    position: "absolute",
    top: "60px", // height of navbar
    right: "0",
    display: "flex",
    flexDirection: "column",
    width: "400px",
    height: "600px",
    padding: "20px",
    overflowY: "auto",
  },
});
