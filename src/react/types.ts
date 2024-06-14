import { IStore } from "../store/types";
import { ID } from "../types";

export interface IBaseProps {
  store: IStore;
}

interface IBaseContent<K> {
  kind: K;
  text: string;
  onClick?: (value?: string) => void;
}

export interface IContentText extends IBaseContent<"text"> {}

export interface IContentButton extends IBaseContent<"button"> {
  onClick: () => void;
}

export interface IContentDropdownWithButton
  extends IBaseContent<"dropdown-with-button"> {
  onClick: (dropdownValue: string) => void;
  dropdownContent: string[];
}

export interface IDialog {
  id: ID;
  position: { x: number; y: number };
  title: string;
  content: Array<IContentButton | IContentText | IContentDropdownWithButton>;
}
