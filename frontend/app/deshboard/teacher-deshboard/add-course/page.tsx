"use client";
import { useState } from "react";
import styles from "@/styles/Teacher.module.css";
import { useRouter } from "next/navigation";

export default function AddCoursePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for Redux Dispatch will go here
    console.log("New Course Data:", formData);
    router.push("/deshboard/teacher-deshboard");
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h2>Publish a New Course</h2>
        <p>Fill in the details to reach thousands of students.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.courseForm}>
        <div className={styles.inputGroup}>
          <label>Course Title</label>
          <input 
            type="text" 
            placeholder="e.g. Master TypeScript 2026" 
            required 
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>Category</label>
            <select onChange={(e) => setFormData({...formData, category: e.target.value})}>
              <option value="web">Web Development</option>
              <option value="design">UI/UX Design</option>
              <option value="business">Business</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Price ($)</label>
            <input 
              type="number" 
              placeholder="99.99" 
              required
              onChange={(e) => setFormData({...formData, price: e.target.value})}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Course Description</label>
          <textarea 
            rows={5} 
            placeholder="What will students learn?"
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          ></textarea>
        </div>

        <div className={styles.formActions}>
          <button type="button" onClick={() => router.back()} className={styles.cancelBtn}>Cancel</button>
          <button type="submit" className={styles.submitBtn}>Publish Course</button>
        </div>
      </form>
    </div>
  );
}