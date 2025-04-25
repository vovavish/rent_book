import { createContext, useContext } from "react";

import { AuthStore } from "../../store/AuthStore/AuthStore";
import { RentBookStore } from "../../store/RentBookStore/RentBookStore";
import { UserProfileStore } from "../../store/UserStore/UserStore";

interface Store {
  authStore: AuthStore,
  rentBookStore: RentBookStore,
  userProfileStore: UserProfileStore
}

export const store: Store = {
  authStore: new AuthStore(),
  rentBookStore: new RentBookStore(),
  userProfileStore: new UserProfileStore()
}

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext)
}