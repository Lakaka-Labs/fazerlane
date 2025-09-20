export type MainStoreState = {
  count: number;
};

export type MainStoreActions = {
  decrementCount: () => void;
  incrementCount: () => void;
};
