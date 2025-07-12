import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Practice = () => {
  const [question, setQuestion] = useState('What is useState in React?');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [userTyped, setUserTyped] = useState(false);

  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  // Sync transcript to answer if user hasn't typed manually
  useEffect(() => {
    if (!userTyped) {
      setAnswer(transcript);
    }
  }, [transcript, userTyped]);

  const handleSubmit = async () => {
    setLoading(true);

    const prompt = `You are an interviewer. The question is: "${question}". My answer is: "${answer}". Give feedback.`;

    try {
      const response = await fetch('http://localhost:8080/ai/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setFeedback(data.message);
    } catch (err) {
      setFeedback('⚠️ Error getting feedback.');
    }

    setLoading(false);
  };

  const handleTyping = (e) => {
    setUserTyped(true);
    setAnswer(e.target.value);
  };

  return (
    <div className="min-h-screen px-6 py-12 bg-gradient-to-b from-black via-green-900 to-black text-white flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-lime-300">AI Interview Practice</h1>

      <div className="w-full max-w-3xl bg-gray-900 rounded-xl p-6 space-y-6 shadow-lg">
        {/* Question */}
        <div className="text-lg sm:text-xl font-semibold text-lime-400">
          Question: <span className="text-white">{question}</span>
        </div>

        {/* Answer Input */}
        <textarea
          value={answer}
          onChange={handleTyping}
          placeholder="Type or speak your answer..."
          rows={5}
          className="w-full bg-black/50 border border-lime-400 rounded-md p-4 text-base sm:text-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400"
        />

        {/* Voice & Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <button
            onClick={() => {
              setUserTyped(false); // enable speech overwrite
              SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
            }}
            className="bg-lime-400 text-black px-5 py-2 rounded hover:bg-lime-300 font-semibold"
          >
            🎙️ Start Speaking
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

        {/* Feedback */}
        {feedback && (
          <div className="mt-4 p-4 bg-green-950 border border-lime-400 rounded-md text-sm sm:text-base text-lime-200 whitespace-pre-line">
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
};

export default Practice;
