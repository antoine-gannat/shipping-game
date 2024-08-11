import React from "react";
import { IBaseProps } from "../../types";
import { Window } from "../Window/Window";
import { useStyles } from "./Ports.styles";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../database";
import { dispatch } from "../../../store";

export function Ports({}: IBaseProps): React.ReactElement {
  const ownedPorts = useLiveQuery(() =>
    db.ports.where("owned").equals("true").toArray()
  );
  const styles = useStyles();

  return (
    <Window title="Ports" className={styles.container}>
      <table>
        <thead>
          <tr>
            <th>Country</th>
            <th>Ships</th>
          </tr>
        </thead>
        <tbody>
          {ownedPorts?.map((port) => (
            <tr
              className={styles.listElement}
              key={port.id}
              onClick={() => dispatch("visitPort", { portName: port.name })}
            >
              <td>{port.name}</td>
              <td>{port.ships.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Window>
  );
}
