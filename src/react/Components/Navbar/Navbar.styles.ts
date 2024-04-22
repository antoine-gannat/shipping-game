import { createUseStyles } from "react-jss";

export const useStyles = createUseStyles({
  navbar: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    height: "60px",
    backgroundColor: "#333",
    color: "#fff",
    boxSizing: "border-box",
  },
});
