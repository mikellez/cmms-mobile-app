// reducers/index.js
import { combineReducers } from 'redux';
import offlineReducer from '../features/offlineSlice';

const rootReducer = combineReducers({
  offline: offlineReducer,
  // Add other reducers here
});

export default rootReducer;