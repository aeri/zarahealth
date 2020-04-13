import { combineReducers } from "redux";

import alertReducer from "./alertReducer";
import authReducer from "./authReducer";
import registerReducer from "./registerReducer";

const rootReducer = combineReducers({
  alertReducer,
  authReducer,
  registerReducer,
});

export default rootReducer