import {createSlice} from '@reduxjs/toolkit';

const reducerSlice = createSlice({
  name: 'quiz',
  initialState: {
    quizData: [],
    total: 0,
    randomWords: [],
  },
  reducers: {
    setWordData(state, action) {
      return {
        ...state,
        wordData: action.payload?.data,
        total: action.payload?.total,
      };
    },
    addNewWord(state, action) {
      return {
        ...state,
        wordData: [...state.wordData, action.payload],
        total: state?.total + 1,
      };
    },
    addRandomWord(state, action) {
      return {
        ...state,
        randomWords: action.payload,
      };
    },
  },
});

const {actions, reducer} = reducerSlice;
export const {setWordData, addNewWord, addRandomWord} = actions;
const userReducer = reducer;
export default userReducer;
