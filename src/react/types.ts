import { IStore } from "../store/types";

export interface IBaseProps {
  store: IStore;
}

export interface IDialogContentText {
  kind: "text";
  text: string;
}

export interface IDialogContentButton {
  kind: "button";
  text: string;
  onClick: () => void;
  closeOnClick?: boolean;
}

export interface IDialog {
  position: { x: number; y: number };
  title: string;
  content: Array<IDialogContentButton | IDialogContentText>;
}
