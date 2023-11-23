import { SET_USERNAME } from "./userActions";

const initialState = {
  username: "",
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USERNAME:
      return {
        ...state,
        username: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
