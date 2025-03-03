import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Login from './pages/login';
// import ProtectedRoute from './components/protected-route';
import Signup from './pages/signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />

        {/* <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route> */}

        {/* Default Route */}
        <Route path='*' element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
