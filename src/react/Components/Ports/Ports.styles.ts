import { createUseStyles } from "react-jss";

export const useStyles = createUseStyles({
  container: {
    padding: "5px 10px 10px 10px",
    width: "200px",
    minHeight: "100px",
    maxHeight: "400px",
    overflow: "hidden auto",
  },
  listElement: {
    textAlign: "center",
    listStyleType: "none",
    cursor: "pointer",
    "&:hover td:first-child": {
      textDecoration: "underline",
    },
  },
});
