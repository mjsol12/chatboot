import React, { useState } from "react";
import { Modal, Box, Button, TextField, Typography } from "@mui/material";
import { useDispatch } from "react-redux";

import { connect } from "react-redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  display: "flex",
  gap: "10px",
  flexDirection: "column",
};

const UserPrompt = () => {
  const dispatch = useDispatch();
  const [open, handleOpen] = useState(true);
  const [user, setUser] = useState("");

  const handleUser = (value) => {
    setUser(value);
  };
  const handleSubmitUser = () => {
    dispatch({ type: "SET_USERNAME", payload: user });
    handleOpen(false);
  };

  return (
    <Modal
      open={open}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box sx={{ ...style, width: 200 }}>
        <Typography>Please enter your name</Typography>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="message"
          name="message"
          value={user}
          onChange={(e) => handleUser(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSubmitUser}>
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

const mapStateToProps = (state) => ({
  username: state.user.username,
});

export default connect(mapStateToProps)(UserPrompt);
