import { combineReducers } from 'redux';
import authReducer from './auth';

export const rootReducer = combineReducers({
  auth: authReducer
});

const reducers = (state, action) => rootReducer(state, action);

export default reducers;