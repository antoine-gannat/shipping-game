import { IStore } from "../store/types";

export interface IBaseProps {
  store: IStore;
}

export interface IContentText {
  kind: "text";
  text: string;
}

export interface IContentButton {
  kind: "button";
  text: string;
  onClick: () => void;
  closeOnClick?: boolean;
}

export interface IContentDropdownWithButton {
  kind: "dropdown-with-button";
  text: string;
  onClick: (dropdownValue: string) => void;
  dropdownContent: string[];
  closeOnClick?: boolean;
}

export interface IDialog {
  position: { x: number; y: number };
  title: string;
  content: Array<IContentButton | IContentText | IContentDropdownWithButton>;
}
