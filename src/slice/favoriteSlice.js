import { createSlice } from "@reduxjs/toolkit"

const favoriteSlice = createSlice({
  name:"favorite",
  initialState:{
    favoriteArticle:[]
  },
  reducers:{
    setFavoriteArticle(state,action){
      state.favoriteArticle = action.payload;
    }
  }
})

export const {setFavoriteArticle} = favoriteSlice.actions;

export default favoriteSlice.reducer;