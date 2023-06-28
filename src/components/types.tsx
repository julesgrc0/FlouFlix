import { ItemVideo, ItemVideoContent, Item } from "../api/storage";

export type SelectedVideoItem = {
  title?: string;
  url?: string;
  index: number;
};

export type VideoModalProps = {
  isMovie: boolean;
  isOpen: boolean;
  onClose: () => void;
  addVideo: (title: string, videoContent: ItemVideoContent) => void;

  itemVideo?: SelectedVideoItem;
};

export type CardDrawerProps = {
  setSelectedCard: (item?: Item) => void;
  selectedCard?: Item;
  isCardOpen: boolean;
  setCardOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCreateOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export type TopBarIcon = {
  click: React.MouseEventHandler<HTMLButtonElement>;
  icon: React.ReactElement<any>;
};

export type TopBarProps = {
  title: string;
  showBorder: boolean;
  icons: TopBarIcon[];
};

export type ConfirmCloseProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export type CInputProps = {
  placeholder: string;
  text: string;
  setText: (text: string) => void;
};

export type CButtonProps = {
  text: string;
  loading: boolean;
  fill: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export type ScrollCardsProps = {
  setShowBorder: (show: boolean) => void;
  setCardOpen: (open: boolean) => void;
  setCreateOpen: (open: boolean) => void;
  setSelectedCard: (item?: Item) => void;

  showBorder: boolean;
  isCardOpen: boolean;
  isCreateOpen: boolean;
};

export type EditDrawerProps = {
  isCreateOpen: boolean;
  setCreateOpen: (open: boolean) => void;
  item?: Item;
};

export type CreateDrawerProps = {
  isCreateOpen: boolean;
  selectedCard?: Item;
  setCreateOpen: (open: boolean) => void;
  setSelectedCard: (item?: Item) => void;
};

export type CardItemProps = {
  item: Item;
  delay: number;
  onCardClick: (item: Item) => void;
};
