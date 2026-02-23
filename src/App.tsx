import { Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import CategoryPage from './pages/CategoryPage';
import FlashcardPage from './pages/FlashcardPage';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 px-6 py-4">
        <h1 className="text-xl font-bold tracking-tight">
          AlgorithmGuide 教學互動網
        </h1>
      </header>
      <main className="flex">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/flashcard/:categoryId" element={<FlashcardPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
