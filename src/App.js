import "./App.css";
import ChatBox from "./components/ChatBox";
import UserPrompt from "./components/UserPrompt";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <UserPrompt />
        <ChatBox />
      </header>
    </div>
  );
}

export default App;
