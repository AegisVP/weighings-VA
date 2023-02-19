import { createSlice } from '@reduxjs/toolkit';
import { handleAddEntry, handleModifyEntry, handleRemoveEntry } from 'redux/entries/entriesHandlers';

export const initialEntryState = {
  items: [],
  error: null,
  isLoading: false,
};

const entriesSlice = createSlice({
  name: 'entries',
  initialState: initialEntryState,
  reducers: {
    addNewEntry: handleAddEntry,
    modifyEntry: handleModifyEntry,
    removeEntry: handleRemoveEntry,
  },
});

export default entriesSlice.reducer;
export const { addNewEntry, modifyEntry, removeEntry } = entriesSlice.actions;
