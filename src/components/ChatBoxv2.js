import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  CircularProgress, // Import CircularProgress for loading indicator
} from "@mui/material";
import { connect } from "react-redux";
import { initDB, addUser, getMessages } from "../db";
import { capitalize } from "@mui/material/utils";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      fontSize: "12px",
      width: "24px",
      height: "24px",
    },
    children:
      name.split(" ").length > 1
        ? `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`
        : `${name[0]}`,
  };
}

const ChatBoxV2 = ({ username }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state

  const handleSendMessage = () => {
    handleAddUser();
    setNewMessage("");
  };

  const handleAddUser = async () => {
    try {
      await addUser({ username, text: newMessage, timestamp: new Date() });
      console.log("User added successfully!");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await initDB();
        const fetchedMessages = await getMessages();
        setMessages(fetchedMessages);
        setLoading(false); // Update loading state
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchData();

    // Fetch messages every 1000 ms
    const intervalId = setInterval(fetchData, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  // Display only the first 25 messages
  const displayedMessages = messages.slice(0, 25);

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h5" gutterBottom>
          Welcome {capitalize(username && username)}
        </Typography>

        {loading ? ( // Display loading indicator
          <CircularProgress style={{ margin: "20px" }} />
        ) : (
          <div
            style={{
              height: "300px",
              overflowY: "auto",
              display: "flex",
              gap: "12px",
              flexDirection: "column",
            }}
          >
            {displayedMessages.length > 0 &&
              displayedMessages.map((message, index) => (
                <div
                  key={message.id}
                  style={{
                    textAlign: message.sender === "bot" ? "left" : "right",
                  }}
                >
                  <Typography
                    sx={{
                      display: "flex",
                      gap: "15px",
                      alignItems: "center",
                      direction: index % 2 === 0 ? "rtl" : "ltr",
                    }}
                  >
                    <Avatar {...stringAvatar(message.username)} />
                    {message.text}
                  </Typography>
                </div>
              ))}
          </div>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="message"
            label="Type your message here"
            name="message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  username: state.user.username,
});

export default connect(mapStateToProps)(ChatBoxV2);
