"use client";

import styles from "@/styles/addCourse.module.css";
import { useState, ChangeEvent, FormEvent } from "react";

export default function AddCoursePage() {
  const [course, setCourse] = useState({
    title: "",
    category: "",
    price: "",
    duration: "",
    description: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const oldCourses = JSON.parse(localStorage.getItem("courses") || "[]");

    localStorage.setItem(
      "courses",
      JSON.stringify([...oldCourses, course])
    );

    alert("Course Added Successfully!");

    setCourse({
      title: "",
      category: "",
      price: "",
      duration: "",
      description: "",
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>Add Course</h1>
          <p>Welcome Teacher</p>
        </div>

        <div className={styles.card}>
          <form className={styles.formGrid} onSubmit={handleSubmit}>
            
            {/* Title */}
            <div>
              <label className={styles.label}>Title</label>
              <input
                className={styles.input}
                name="title"
                value={course.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className={styles.label}>Category</label>
              <select
                className={styles.select}
                name="category"
                value={course.category}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Web Development">Web Development</option>
                <option value="App Development">App Development</option>
                <option value="AI/ML">AI/ML</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className={styles.label}>Price</label>
              <input
                className={styles.input}
                name="price"
                value={course.price}
                onChange={handleChange}
              />
            </div>

            {/* Duration */}
            <div>
              <label className={styles.label}>Duration</label>
              <input
                className={styles.input}
                name="duration"
                value={course.duration}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div className={styles.fullWidth}>
              <label className={styles.label}>Description</label>
              <textarea
                className={styles.textarea}
                name="description"
                value={course.description}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Button */}
            <div className={`${styles.fullWidth} ${styles.buttonContainer}`}>
              <button className={styles.button} type="submit">
                Add Course
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}



