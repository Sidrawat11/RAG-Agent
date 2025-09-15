"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Typewriter } from "react-simple-typewriter";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState([]);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const chatHistoryRef = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setHistory([...history, { question, answer: "Typing..." }]);
    setQuestion("");

    try {
      const answer = await axios.post('http://localhost:8000/ask', { question });
      setHistory((prevHistory) => {
        const updatedHistory = [...prevHistory];
        updatedHistory[updatedHistory.length - 1].answer = answer.data.answer;
        return updatedHistory;
      });
      setResponse(answer.data.answer);
    } catch (error) {
      console.log(error);
      setHistory((prevHistory) => {
        const updatedHistory = [...prevHistory];
        updatedHistory[updatedHistory.length - 1].answer = 'Error Fetching Response';
        return updatedHistory;
      });
      setResponse('Error Fetching Response');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <main className="flex flex-col items-center justify-between min-h-screen">
      <header className="flex justify-center bg-white w-full p-4">
        <span className="text-black text-lg">ChatBot for Intel QAT</span>
      </header>
      <div className="flex-1 w-full bg-white text-slate-950 p-2 flex flex-col items-center">
        <div className="chat-history w-3/5 flex-1 overflow-y-auto max-h-[80vh] bg-white p-4 rounded-lg shadow-lg" ref={chatHistoryRef}>
          {history.map((item, index) => (
            <div className="flex flex-col gap-2 p-5" key={index}>
              <div className="self-end p-3 bg-blue-600 text-white rounded-t-full rounded-l-full max-w-full break-words">
                {item.question}
              </div>            
              <div className="self-start p-4 bg-green-400 text-white rounded-b-3xl rounded-r-3xl max-w-full break-words">
                <span className="text-justify">
                    {item.answer === "Typing..." ? "Looking Through the Files..." : <Typewriter
                        words={[item.answer]}
                        cursor
                        cursorStyle='|'
                        typeSpeed={10}
                        deleteSpeed={null}
                        delaySpeed={null}
                        cursorBlinking={false}
                    />}
                </span>                
              </div>
              <hr />
            </div>
          ))}
        </div>
      </div>
      <form className="w-3/5 mx-auto fixed bottom-9 bg-white shadow-lg" onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="search"
            id="search"
            className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            value={question}
            placeholder="Ask me about Intel QAT"
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
          <button
            type="submit"
            className="absolute right-3 top-1.5 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
            disabled={loading}
          >
            <svg className="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 20 20">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </button>
        </div>
      </form>
      <footer className="flex justify-center w-full bg-white text-[10px] p-2">
        <span className="text-black">Made by Parth Rawat &copy;</span>
      </footer>
    </main>
  );

}