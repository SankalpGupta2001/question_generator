import React, { useState } from 'react';
import YogaForm from './YogaForm';
import YogaList from './YogaList';




function App() {
  const [generatedRoutines, setGeneratedRoutines] = useState([]);

  const handleGenerate = (routines) => {
    setGeneratedRoutines(routines);
  };

  


  return (
    <div className="App">
      <YogaForm onGenerate={handleGenerate} />
      <YogaList routines={generatedRoutines} />
    </div>
  );
}


export default App;
