import { createContext, useContext } from "react";

import { AuthStore } from "../../store/AuthStore/AuthStore";
import { RentBookStore } from "../../store/RentBookStore/RentBookStore";
import { UserProfileStore } from "../../store/UserStore/UserStore";
import { SupportRequestStore } from "../../store/SupportRequestStore/SupportRequestStore";

interface Store {
  authStore: AuthStore,
  rentBookStore: RentBookStore,
  userProfileStore: UserProfileStore,
  supportRequestStore: SupportRequestStore,
}

export const store: Store = {
  authStore: new AuthStore(),
  rentBookStore: new RentBookStore(),
  userProfileStore: new UserProfileStore(),
  supportRequestStore: new SupportRequestStore(),
}

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext)
}