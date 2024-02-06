// src/YogaForm.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import "./App.css";
import { jsPDF } from "jspdf";
const excludeWords = /\b(|\*)+\b/g;

const YogaForm = ({ onGenerate }) => {

  const [topic, setTopic] = useState('');
  const [questionType, setQuestionType] = useState('mcq');
  const [numberOfQuestions, setNumberOfQuestions] = useState(10); // Default number of questions
  const [board, setBoard] = useState('CBSE');
  const [classLevel, setClassLevel] = useState('6');
  const [difficultyLevel, setDifficultyLevel] = useState('medium');
  const [generatedRoutines, setGeneratedRoutines] = useState([]);



  const handleGenerate = async () => {
    try {


      const response = await axios.post('https://question-generator-do61.onrender.com/generate-questions', {
        topic: topic,
        questionType: questionType,
        numberOfQuestions: numberOfQuestions,
        board: board,
        classLevel: classLevel,
        difficultyLevel: difficultyLevel,
      });
      
      console.log(topic,"topic",questionType,"questionType");


      onGenerate(response.data.questions);
      setGeneratedRoutines(response.data.questions);
    } catch (error) {
      console.error('Error generating routine:', error);
    }
  };

 
  return (
    <div className="yoga-form" >
      <h2>Question Generator</h2>
      <div className="form-group">
        <label className="label">Topic</label>
        <input
          type="text"
          className="input-field"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>
      <div className="form-group" style={{marginBottom:40}}>
        <label className="label">QuestionType</label>
        <select
          className="select-field"
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
        >
          <option value="mcq">MCQ</option>
          <option value="truefalse">True or False</option>
          <option value="fillintheblanks">Fill in the Blanks</option>
          <option value="subjective">Subjective</option>

        </select>
      </div>
      <div className="form-group" style={{marginBottom:40}}>
        <label className="label">Number of Questions</label>
        <Form.Range
          value={numberOfQuestions}
          onChange={(e) => setNumberOfQuestions(e.target.value)}
        />
        <div className="current-value">
          <strong>Questions: </strong> {numberOfQuestions}
        </div>


      </div>
      <div className="form-group">
        <label className="label">Board</label>
        <input
          type="text"
          className="input-field"
          value={board}
          onChange={(e) => setBoard(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="label">Class Level</label>
        <input
          type="text"
          className="input-field"
          value={classLevel}
          onChange={(e) => setClassLevel(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="label">Difficulty Level</label>
        <select
          className="select-field"
          value={difficultyLevel}
          onChange={(e) => setDifficultyLevel(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="difficult">Difficult</option>
        </select>
      </div>

      <div className="button-group">
        <button className="generate-button" onClick={handleGenerate}>
          Generate Questions
        </button>
        
     </div>
    </div>

  );
};

export default YogaForm;
