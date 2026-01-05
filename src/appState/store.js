import { configureStore } from "@reduxjs/toolkit";
import drawerSlice from "./slices/drawerSlice";
import modalSlice from "./slices/modalSlice";
import { smartObjectiveApiSlice } from "./apis/smartObjectiveApiSlice";
import { systemApiSlice } from "./apis/systemApiSlice";
import { managerApprovalsSoApiSlice } from "./apis/managerApprovalsSoApiSlice";
import { hrSoApiSlice } from "./apis/hrSoApiSlice";
import { userApiSlice } from "./apis/userApiSlice";

const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [smartObjectiveApiSlice.reducerPath]: smartObjectiveApiSlice.reducer,
    [systemApiSlice.reducerPath]: systemApiSlice.reducer,
    [managerApprovalsSoApiSlice.reducerPath]:
      managerApprovalsSoApiSlice.reducer,
    [hrSoApiSlice.reducerPath]: hrSoApiSlice.reducer,
    drawer: drawerSlice,
    modal: modalSlice,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApiSlice.middleware,
      smartObjectiveApiSlice.middleware,
      systemApiSlice.middleware,
      managerApprovalsSoApiSlice.middleware,
      hrSoApiSlice.middleware
    ),
});

export default store;
