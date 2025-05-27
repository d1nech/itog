import store, { rootReducer } from '../services/store';

describe('Store Configuration Tests', () => {
  it('should initialize with default state', () => {
    const initialState = rootReducer(undefined, { type: 'INIT' });
    const storeState = store.getState();
    
    expect(initialState).toEqual(storeState);
  });

  it('should handle unknown actions without state changes', () => {
    const initialState = store.getState();
    const nextState = rootReducer(initialState, { type: 'UNKNOWN_ACTION' });
    
    expect(nextState).toEqual(initialState);
  });
});
