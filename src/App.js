import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './topcomponents/Home';
import About from './topcomponents/About';
import Contact from './topcomponents/Contact';
import ProfileDetails from './topcomponents/Profile';
import SignUp from './pages/SignUp';
import Login from './pages/LogIn';
import Dashboard from './components/Dashboard';
import Explore from './homepagecomponents/Exploretools';
import RecentSales from './transactionalcomponents/RecentSales';
import RecentPurchases from './transactionalcomponents/RecentPurchase';
import Sales from './transactionalcomponents/Sales';
import Purchase from './transactionalcomponents/Purchase';
import Stock from './transactionalcomponents/Stock';
import History from './transactionalcomponents/History';
import PurchaseHistory from './transactionalcomponents/PurchaseHistory';
import SalesHistory from './transactionalcomponents/SaleHistory';
import StockSummary from './dasboardcomponents/StockSummary';
import StockAnalysis from './dasboardcomponents/StockAnalysis';
import StockCharts from './dasboardcomponents/StockCharts';
import RevenueSummary from './dasboardcomponents/RevenueSummary';
import PurchaseAnalysis from './dasboardcomponents/PuchasesAnalysis';
import SalesAnalysis from './dasboardcomponents/SalesAnalysis';



function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const themeClass = darkMode ? 'dark-theme' : 'light-theme';

  return (
    <div className={`app ${themeClass}`}>
      <Routes>
        <Route path="/" element={<Home darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/explore" element={<Explore darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/about" element={<About darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path='/contact' element={<Contact darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/login" element={<Login setUser={setUser} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/signup" element={<SignUp darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/dashboard" element={<Dashboard setUser={setUser} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}>
          <Route path="recent-sales" element={<RecentSales setUser={setUser} darkMode={darkMode} />} />
          <Route path="recent-purchases" element={<RecentPurchases setUser={setUser} darkMode={darkMode} />} />
          <Route path="sales" element={<Sales setUser={setUser} darkMode={darkMode} />} />
          <Route path="purchases" element={<Purchase setUser={setUser} darkMode={darkMode} />} />
          <Route path="stock" element={<Stock setUser={setUser} darkMode={darkMode} />} />
          <Route path="history" element={<History setUser={setUser} darkMode={darkMode} />} />
          <Route path="purchase-history" element={<PurchaseHistory setUser={setUser} darkMode={darkMode} />} />
          <Route path="sales-history" element={<SalesHistory setUser={setUser} darkMode={darkMode} />} />
          <Route path="stock-summary" element={<StockSummary setUser={setUser} darkMode={darkMode} />} />
          <Route path="stock-analysis" element={<StockAnalysis setUser={setUser} darkMode={darkMode} />} />
          <Route path="stock-charts" element={<StockCharts setUser={setUser} darkMode={darkMode} />} />
          <Route path= "profile"  element = {<ProfileDetails setUser= {setUser} darkMode ={darkMode} />} />
          <Route path="revenue-summary" element = {<RevenueSummary setUser ={setUser} darkMode = {darkMode} />} />
          <Route path= "purchase-analysis" element = {<PurchaseAnalysis setUser = {setUser} darkMode = {darkMode} />} />
          <Route path= "sales-analysis" element = {<SalesAnalysis setUser = {setUser} darkMode ={darkMode} />} />
         </Route>
      </Routes>
    </div>
  );
}

export default App;