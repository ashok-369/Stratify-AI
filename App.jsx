
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage.jsx';
import { CareerPage } from './pages/CareerPage.jsx';
import { BusinessPage } from './pages/BusinessPage.jsx';
import { ProductivityPage } from './pages/ProductivityPage.jsx';
import { EducationPage } from './pages/EducationPage.jsx';
import { CreativityPage } from './pages/CreativityPage.jsx';
import { FinancePage } from './pages/FinancePage.jsx';
import { CodingPage } from './pages/CodingPage.jsx';
import { LifestylePage } from './pages/LifestylePage.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/career" element={<CareerPage />} />
        <Route path="/business" element={<BusinessPage />} />
        <Route path="/productivity" element={<ProductivityPage />} />
        <Route path="/education" element={<EducationPage />} />
        <Route path="/creativity" element={<CreativityPage />} />
        <Route path="/finance" element={<FinancePage />} />
        <Route path="/coding" element={<CodingPage />} />
        <Route path="/lifestyle" element={<LifestylePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
