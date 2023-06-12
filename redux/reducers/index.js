// reducers/index.js
import { combineReducers } from 'redux';
import offlineReducer from '../features/offlineSlice';
import userReducer from '../features/userSlice';
import requestReducer from '../features/requestSlice';

const rootReducer = combineReducers({
  offline: offlineReducer,
  user: userReducer,
  request: requestReducer
  // Add other reducers here
});

export default rootReducer;