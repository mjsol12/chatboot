import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
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

const ChatBox = ({ username }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [displayedMessages, setDisplayedMessages] = useState(25);

  const handleSendMessage = () => {
    handleAddUser();

    // Reset the input field
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
        setMessages(fetchedMessages.reverse());
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchData();

    // Fetch messages every 1000 ms
    const intervalId = setInterval(fetchData, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const loadMoreMessages = () => {
    setDisplayedMessages((prev) => prev + 25); // Increment the number of messages to display
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h5" gutterBottom>
          Welcome {capitalize(username && username)}
        </Typography>
        <div
          style={{
            height: "300px",
            overflowY: "auto",
            display: "flex",
            gap: "12px",
            flexDirection: "column",
          }}
        >
          {messages.length > 0 &&
            messages.slice(0, displayedMessages).map((message, index) => (
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

          <Button
            variant="text"
            color="secondary"
            onClick={loadMoreMessages}
            style={{ marginTop: "15px" }}
          >
            Load More
          </Button>
        </div>

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

export default connect(mapStateToProps)(ChatBox);
