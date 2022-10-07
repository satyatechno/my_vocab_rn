import {createSlice} from '@reduxjs/toolkit';

const reducerSlice = createSlice({
  name: 'notes',
  initialState: {
    notesData: [],
  },
  reducers: {
    setNotesData(state, action) {
      return {
        ...state,
        notesData: action.payload,
      };
    },
    addNewNote(state, action) {
      return {
        ...state,
        notesData: [action.payload, ...state.notesData],
      };
    },
    updateNote(state, action) {
      return {
        ...state,
        notesData: [...state.notesData].map(item => {
          if (item?.id === action?.payload?.id) {
            return action?.payload;
          } else {
            return item;
          }
        }),
      };
    },
  },
});

const {actions, reducer} = reducerSlice;
export const {setNotesData, addNewNote, updateNote} = actions;
const notesReducer = reducer;
export default notesReducer;
