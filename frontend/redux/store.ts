import { configureStore, combineReducers } from "@reduxjs/toolkit";
import campgroundSlice from "./features/bookSlice";
import { useSelector, TypedUseSelectorHook } from "react-redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { persistStore } from "redux-persist";

// Persist configuration
const persistConfig = {
  key: "rootPersist",
  storage,
  // Optionally blacklist reducers or paths that shouldn't be persisted
  blacklist: [], // Add reducers that you don't want persisted here
  transforms: [],
};

// Combine reducers
const rootReducer = combineReducers({ campgroundSlice });

// Wrap rootReducer with persistReducer to persist state
const reduxPersistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: reduxPersistedReducer,
  // Add serializableCheck middleware configuration to allow non-serializable values like functions or errors
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/REGISTER",
        ], // Ignore specific redux-persist actions that can contain non-serializable values
        ignoredPaths: ["campgroundSlice"], // Ignore specific paths in state (optional)
      },
    }),
});

export const persistor = persistStore(store);

// Custom typed useSelector hook
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
