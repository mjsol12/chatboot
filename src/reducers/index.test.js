import userReducer from "./userReducer";

describe("User Reducer", () => {
  it("should add new user", () => {
    const newState = userReducer(
      { username: "" },
      {
        type: "SET_USERNAME",
        payload: "user",
      }
    );
    expect(newState.username).toMatch("user");
  });
});
