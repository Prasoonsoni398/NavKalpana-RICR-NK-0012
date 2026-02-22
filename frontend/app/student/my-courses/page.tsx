


"use client";
import CourseCard from "@/components/features/myCourseCards";
import type{ CourseResponse } from "@/models/course.model";
import { courseService } from "@/services/user.services";
import { useEffect, useState } from "react";
import { i, u } from "framer-motion/client";

const MyCourses = () => { 
  // const courses = [
  //   {
  //     id: 1,
  //     title: "Full Stack Web Development",
  //     instructor: "John Doe",
  //     progress: 10,
  //     image: "/course1.jpg",
  //     description:"Build complete websites using frontend and backend technologies"
  //   },
  //   {
  //     id: 2,
  //     title: "Data Structures & Algorithms",
  //     instructor: "Jane Smith",
  //     progress: 45,
  //     image: "/course2.jpg",
  //     description:"Organize data efficiently and solve problems logically"
  //   },
  //   {
  //     id: 3,
  //     title: "Machine Learning Basics",
  //     instructor: "Robert Brown",
  //     progress: 85,
  //     image: "/course3.jpg",
  //     description:"Teach computers to learn and predict from data"
  //   },
  //   {
  //     id: 4,
  //     title: "Java",
  //     description:"Object-oriented programming language for apps and software",
  //     instructor: "Robert Brown",
  //     progress: 85,
  //     image: "/course4.jpg",
  //   },
  //   {
  //     id: 5,
  //     title: "Data Science",
  //     instructor: "Robert Brown",
  //     progress: 85,
  //     image: "/course5.jpg",
  //     description:"Analyze data to find insights and support decisions"
  //   }
  // ];

  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const fetchCourses = async () => {
    try {
      const res = await courseService.getMyCourses();
      setCourses(res);
    }
    catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);
  return (
    <div style={{ padding: "40px", background: "#F9FAFB", minHeight: "100vh" }}>
      <h1
        style={{
          fontSize: "35px",
          fontWeight: "600",
          marginBottom: "40px",
          color: "#111827",
          textAlign : "center",
        }}
      >
        My Enrolled Courses
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "25px",
        }}
      >
        {courses.length === 0 ? (
          <p style={{ textAlign: "center", color: "#6B7280" }}>
            You are not enrolled in any courses yet.
          </p>
        ) : (
          courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MyCourses;


