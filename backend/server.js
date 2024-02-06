const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;


app.use(cors()); 
app.use(bodyParser.json());


const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

console.log(process.env.API_KEY);
const genAI = new GoogleGenerativeAI(process.env.API_KEY);



async function generateQuestionsDirectly(params) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const questions = [];

  for (let i = 1; i <= params.numberOfQuestions; i++) {
    let difficultyLevel;

    switch (params.difficultyLevel) {
      case "easy":
        difficultyLevel = "easy";
        break;
      case "medium":
        difficultyLevel = "medium";
        break;
      case "difficult":
        difficultyLevel = "difficult";
        break;
      default:
        difficultyLevel = "medium"; 
    }

    let prompt;

    if (params.questionType === "mcq") {
      prompt = `Generate a ${difficultyLevel} level ${params.questionType} question on ${params.topic} of class ${params.classLevel} for Standard ${params.board} in paragraph like first paragraph will be Question: question then next paragraph will be Options: options then last line will be Answer: answer`;

    } else if (params.questionType === 'truefalse') {
      prompt = `Generate a ${difficultyLevel} level ${params.questionType} question on ${params.topic} of class ${params.classLevel} for Standard ${params.board} in paragraph like first paragraph will be Question: question then last line will be Answer: true or false`;
    } else {
      prompt = `Generate a ${difficultyLevel} level ${params.questionType} question on ${params.topic} of class ${params.classLevel} for Standard ${params.board} in paragraph like first paragraph will be Question: question the last next and last pargraph will be Answer: answer`;
    }

    const result = await model.generateContent(prompt);
    let response = await result.response;
    response = response.text();

    let questionText="";
    let answer = "";
    let options = [];
    if (params.questionType === "mcq") {

      const responseString = response.toString(); 
      const questionStartIndex = responseString.indexOf('Question:');
const optionsStartIndex = responseString.indexOf('Options:');
const answerStartIndex = responseString.indexOf('Answer:');

const questionEndIndex = optionsStartIndex !== -1 ? optionsStartIndex : (answerStartIndex !== -1 ? answerStartIndex : responseString.length);
questionText = responseString.substring(questionStartIndex, questionEndIndex).trim();

const optionsEndIndex = answerStartIndex !== -1 ? answerStartIndex : responseString.length;
const optionsText = responseString.substring(optionsStartIndex + 'Options:'.length, optionsEndIndex).trim();
options = optionsText.split('\n').map(option => option.trim());

const answerEndIndex = responseString.length;
const answerText = responseString.substring(answerStartIndex + 'Answer:'.length, answerEndIndex).trim();
answer = answerText.replace(/\*\*|\s+/g, ''); 
answer = answerText;




    } else if (params.questionType === 'truefalse') {

      const responseString = response.toString(); 
      const questionStartIndex = responseString.indexOf('Question:');
      const answerStartIndex = responseString.indexOf('Answer:');
  
      const questionEndIndex = answerStartIndex !== -1 ? answerStartIndex : responseString.length;
      questionText = responseString.substring(questionStartIndex, questionEndIndex).trim();
  
      const answerText = responseString.substring(answerStartIndex + 'Answer:'.length).trim();
      answer = answerText.split('\n')[0].trim();
      options = ["True", "False"];



  
    }
    else{
      const responseString = response.toString(); 
      const questionStartIndex = responseString.indexOf('Question:') + (params.questionType === 'subjective' ? 0 : 'Question:'.length);
      const answerStartIndex = responseString.indexOf('Answer:');
  
      const questionEndIndex = answerStartIndex !== -1 ? answerStartIndex : responseString.length;
      questionText = responseString.substring(questionStartIndex, questionEndIndex).trim();
  
      const answerText = responseString.substring(answerStartIndex + 'Answer:'.length).trim();
      answer=answerText;  


      
    }

    const formattedQuestion = {
      question: questionText,
      type: params.questionType,
      difficulty: difficultyLevel,
      options: options,
      answer: answer,
    };

    questions.push(formattedQuestion);
  }

  return questions;

}


app.post("/generate-questions", async (req, res) => {
  try {
    const params = req.body;
    const questions = await generateQuestionsDirectly(params);
    res.json({ questions: questions });
  } catch (error) {
    console.error("Error generating questions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(5000, () => {
  console.log(`Server is running on port ${PORT}`);
});

