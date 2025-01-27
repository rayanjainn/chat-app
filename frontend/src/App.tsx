import { useEffect, useRef, useState } from "react";

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const msgRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: { roomId: "1" },
        })
      );
    };

    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    return () => {
      ws.close();
    };
  });

  const handleSendMessage = () => {
    const message = msgRef.current?.value;
    if (message) {
      wsRef.current?.send(
        JSON.stringify({
          type: "chat",
          payload: {
            message: message,
          },
        })
      );
      msgRef.current.value = "";
    }
  };

  return (
    <div className="h-screen bg-black flex flex-col items-center justify-center">
      <div className="h-[600px] w-[400px] border-2 border-white rounded-lg ">
        <div className="h-[500px] p-10 m-2 rounded-lg">
          {messages.map((message, index) => (
            <p key={index} className="bg-white text-black rounded p-2 m-2 ">
              {message}
            </p>
          ))}
        </div>
        <div className="flex p-3 gap-2">
          <input
            ref={msgRef}
            type="text"
            className="w-full h-10 border-2 text-white border-white rounded-lg"
          />
          <button
            className="w-20 h-10 bg-white text-black rounded-lg cursor-pointer"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
