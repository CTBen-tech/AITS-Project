import { useState, useEffect } from 'react';
import axios from 'axios';

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const studentId = 1; // Hardcoded; replace with auth

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const studentResponse = await axios.get(`http://localhost:8000/api/students/${studentId}/`);
        setStudent(studentResponse.data);
        
        const courseResponse = await axios.get('http://localhost:8000/api/courses/', {
          params: { students__id: studentId } // Filter courses by student
        });
        setCourses(courseResponse.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };
    fetchStudent();
  }, [studentId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="mt-4">
      <h1>{student.name}'s Dashboard</h1>
      <p>Grade: {student.grade}</p>
      <p>Enrolled: {student.enrollment_date}</p>
      <h3>Courses</h3>
      <ul>
        {courses.length ? (
          courses.map(course => (
            <li key={course.id}>{course.title} ({course.code})</li>
          ))
        ) : (
          <li>No courses enrolled</li>
        )}
      </ul>
    </div>
  );
}

export default StudentDashboard;