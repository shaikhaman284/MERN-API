// src/App.js
import React from 'react';

import './App.css';

import { BarChart, PieChart, Statistics, Transactions } from './components/CombineApi';

function App() {
  return (
    <div className="App">
      <header className="App-header">

      </header>
      <main>
      <div class="barchart">
            <Transactions />
          </div>
        <div class="container">
        
          <div>
            <Statistics />
          </div>
          <div>
            <PieChart />
          </div>
      
        </div>
        <div class="barchart">
            <BarChart />
          </div>
      </main>
    </div>
  );
}

export default App;
