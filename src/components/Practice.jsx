import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Practice = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [userTyped, setUserTyped] = useState(false);
  const [qaHistory, setQaHistory] = useState([]);

  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!userTyped) {
      setAnswer(transcript);
    }
  }, [transcript, userTyped]);

  const startInterview = async (topic) => {
    setSelectedTopic(topic);
    setFeedback('');
    setQuestion('');
    setQaHistory([]);

    try {
      const res = await fetch('http://localhost:8080/ai/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();
      setQuestion(data.question);
    } catch (err) {
      setQuestion('⚠️ Error loading first question.');
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim()) return;

    setLoading(true);

    // Add current Q&A to history
    setQaHistory(prev => [...prev, { question, answer }]);

    try {
      const res = await fetch('http://localhost:8080/ai/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selectedTopic,
          previousQuestion: question,
          answer: answer,
        }),
      });

      const data = await res.json();
      setFeedback(data.feedback);
      setQuestion(data.question);
      setAnswer('');
      resetTranscript();
      setUserTyped(false);
    } catch (err) {
      setFeedback('⚠️ Error getting feedback.');
    }

    setLoading(false);
  };

  const handleTyping = (e) => {
    setUserTyped(true);
    setAnswer(e.target.value);
  };

  const startMic = () => {
    if (!browserSupportsSpeechRecognition) {
      alert('❌ Your browser does not support speech recognition. Use Google Chrome.');
      return;
    }
    setUserTyped(false);
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
  };

  const stopMic = () => {
    SpeechRecognition.stopListening();
  };

  const handleEndInterview = () => {
    setSelectedTopic(null);
    setQuestion('');
    setFeedback('');
    setAnswer('');
    resetTranscript();
    setUserTyped(false);
    setQaHistory([]);
    stopMic();
  };

  const topics = ['MERN', 'Java', 'C/C++'];

  if (!selectedTopic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <h2 className="text-2xl font-bold mb-6 text-lime-300">Select Interview Topic</h2>
        <div className="space-x-4">
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => startInterview(topic)}
              className="bg-lime-500 px-6 py-3 text-black font-semibold rounded hover:bg-lime-400"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-12 bg-gradient-to-b from-black via-green-900 to-black text-white flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-lime-300">
        AI Interview Practice - {selectedTopic}
      </h1>

      <div className="w-full max-w-3xl bg-gray-900 rounded-xl p-6 space-y-6 shadow-lg">
        <div className="text-lg sm:text-xl font-semibold text-lime-400">
          Question: <span className="text-white">{question}</span>
        </div>

        <textarea
          value={answer}
          onChange={handleTyping}
          placeholder="Type or speak your answer..."
          rows={5}
          className="w-full bg-black/50 border border-lime-400 rounded-md p-4 text-base sm:text-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400"
        />

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <button
            onClick={startMic}
            className="bg-lime-400 text-black px-5 py-2 rounded hover:bg-lime-300 font-semibold"
          >
            🎙️ Start Speaking
          </button>

          <button
            onClick={stopMic}
            className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-400 font-semibold"
          >
            🛑 Stop
          </button>

          <button
            onClick={() => {
              resetTranscript();
              setAnswer('');
              setUserTyped(false);
            }}
            className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
          >
            🔁 Reset
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-lime-500 text-black px-6 py-2 rounded hover:bg-lime-400 font-semibold"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>

        <div className="text-sm text-lime-200">
          🎧 Mic Status: {listening ? 'Listening...' : 'Not listening'}
        </div>

        {feedback && (
          <div className="mt-4 p-4 bg-green-950 border border-lime-400 rounded-md text-sm sm:text-base text-lime-200 whitespace-pre-line">
            {feedback}
          </div>
        )}

        {/* Interview History */}
        {qaHistory.length > 0 && (
          <div className="mt-6 bg-gray-800 p-4 rounded-lg border border-lime-500">
            <h3 className="text-lime-300 font-bold mb-2">📝 Interview History</h3>
            {qaHistory.map((entry, index) => (
              <div key={index} className="mb-3">
                <p className="text-lime-400 font-semibold">Q{index + 1}: {entry.question}</p>
                <p className="text-white ml-2">🗣️ {entry.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleEndInterview}
        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 mt-4"
      >
        ❌ End Interview
      </button>
    </div>
  );
};

export default Practice;
