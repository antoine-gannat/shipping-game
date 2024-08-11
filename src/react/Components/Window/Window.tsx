import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useStyles } from "./Window.styles";

interface IWindowProps extends React.HTMLAttributes<HTMLDivElement> {
  // Title of the window
  title: string;
  // Callback to clear the window
  onClear?: () => void;
}

export function Window({
  onClear,
  children,
  title,
  ...rest
}: React.PropsWithChildren<IWindowProps>): React.ReactElement {
  const styles = useStyles();
  return (
    <div {...rest} className={[styles.root, rest.className].join(" ")}>
      <div className={styles.heading}>
        <span>{title}</span>

        {onClear && (
          <FontAwesomeIcon
            icon={faXmark}
            className={styles.button}
            onClick={onClear}
          />
        )}
        <hr />
      </div>
      <div>{children}</div>
    </div>
  );
}
