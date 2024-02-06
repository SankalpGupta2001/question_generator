// src/YogaList.js
import React, { useState } from 'react';
import "./App.css";

import LoopIcon from '@mui/icons-material/Loop';
const excludeWords = /\*\*|\*{1,2}/g;

const Loader = () => (
  <div className="loader-container">
    <div className="loader"><LoopIcon style={{ fontSize: 60 }} /></div>
    <p>One minute please wait...</p>
  </div>

);


const RoutineList = ({ routines }) => {
  const [showAnswer, setShowAnswer] = useState(Array(routines.length).fill(false));

  const [selectedOptions, setSelectedOptions] = useState(Array(routines.length).fill('')); // Track selected options for each question
  const [score, setScore] = useState(0); // Track user's score

  const handleOptionChange = (questionIndex, optionIndex) => {
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[questionIndex] = optionIndex;
    setSelectedOptions(updatedSelectedOptions);
  };

  const calculateScore = () => {
    let newScore = 0;
    routines.forEach((question, index) => {
      const userAnswer = question['options'][selectedOptions[index]]; // Get the actual user answer
      const correctAnswer = question['answer'].replace(/\*\*/g, '').replace(/\n/g, '').trim();
      console.log(userAnswer,"question",correctAnswer);
      // You can implement your scoring logic here
      if (userAnswer === correctAnswer || userAnswer.startsWith(correctAnswer[0])) {
        newScore += 1;
      }
    });

    setScore(newScore);
  };

  const toggleAnswer = (index) => {
    const newShowAnswer = [...showAnswer];
    newShowAnswer[index] = !newShowAnswer[index];
    setShowAnswer(newShowAnswer);
  };

  return (
    <div className="container mt-4">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh', marginBottom: routines.length === 0 && 100 }}>
        <h4
          style={{
            backgroundColor: '#eaeaea',
            width: 450,
            textAlign: 'center',
            padding: 10,
            color: 'green',
            borderRadius: 40,
            // Apply margin-bottom if routines.length is 0
          }}
        >
          Enter Inputs and Get's Your Free AI Generated Questions
        </h4>

      </div>
      {routines.length === 0 ? (
        // Render loader when no routines
        <Loader />
      ) : (

        <ul className="list-group" style={{ listStyleType: 'none' }}>
          {routines.map((question, index) => (
            <li
              key={index}
              className={`list-group-item custom-list-item ${index % 2 === 0 ? 'bg-grey' : 'bg-white'}`}
              style={{ marginBottom: 30, padding: 20, borderRadius: 20 }}
            >


              <div className="question" style={{ marginBottom: 10 }}>

                <div>
                  <strong >Question {index + 1}:</strong>

                  <span style={{
                    padding: '4px 8px',
                    background: '#3498db',
                    color: '#ffffff',
                    borderRadius: '4px', marginLeft: 960,
                    fontSize: '14px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}>
                    {question['difficulty']}
                  </span>

                </div>


                <br />
                {<pre>{question['question'] && question['question'].replace(excludeWords, '').trim()}</pre>}

              </div>




              <hr style={{ border: '0', height: '2px', background: '#e0e0e0', margin: '0 0 20px' }} />

              {question['options'] && question['options'].length > 0 && (
                <div className="options" style={{ marginBottom: 10 }}>
                  <strong>Options:</strong>
                  <br />
                  {question['options'].map((option, optionIndex) => (
                    option && !excludeWords.test(option) && ( // Check if option is not empty and doesn't contain excluded words
                      <div key={optionIndex}>
                        <input
                          type="radio"
                          name={`question_${index}`} // Use a unique name for each question
                          value={option}
                          checked={selectedOptions[index] === optionIndex}
                          onChange={() => handleOptionChange(index, optionIndex)} // Pass question and option index
                        />
                        <span>{option.trim()}</span>
                      </div>
                    )
                  ))}

                </div>
              )}

              {question['answer'] && (
                <div style={{ marginTop: 10 }}>
                  <button onClick={() => toggleAnswer(index)}>
                    {showAnswer[index] ? 'Hide Answer' : 'Check Answer'}
                  </button>
                </div>
              )}

              {showAnswer[index] && (
                <div className="answer" style={{ marginTop: 10 }}>
                  <strong>Answer:</strong>
                  <br />
                  {<pre>{question['answer'].replace(excludeWords, '').trim()}</pre>}
                </div>
              )}
            </li>
          ))}
        </ul>




      )}


      {
        routines.length > 0 && (routines[0].type === 'mcq' || routines[0].type === 'truefalse') && (
          <div>
            <button onClick={calculateScore}>
              Calculate Score
            </button>

            <div>
              <strong>Score:</strong> {score}
            </div>
          </div>
        )
      }




    </div>
  );
};

export default RoutineList;

