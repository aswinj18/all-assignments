import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Landing from './components/Landing';
import Login from './components/Login';
import PurchasedCourses from './components/PurchasedCourses';
import ShowAllCourses from './components/ShowAllCourses';
import CourseDetails from './components/CourseDetails';
import SignUp from './components/SignUp';

function App() {

  return (
      <Router>
          <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/courses" element={<ShowAllCourses />} />
              <Route path="/courses/purchased" element={<PurchasedCourses />} />
              <Route path="/course/:id" element={<CourseDetails />} />
          </Routes>
      </Router>
  );
}

export default App
