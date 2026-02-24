"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import styles from "@/styles/Teacher.module.css";

export default function TeacherDummyPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ध्यान दें: बैकएंड में असाइनमेंट क्रिएट करने का जो भी एंडपॉइंट हो
      const response = await api.post("/assignments", {
        title: title,
        description: description,
        dueDate: new Date(Date.now() + 86400000).toISOString(), // कल की डेट
      });

      console.log("✅ Assignment Created:", response.data);
      setCreatedId(response.data.id); // यहाँ से हमें असली ID मिल जाएगी
      alert("असाइनमेंट बन गया! ID है: " + response.data.id);
    } catch (error: any) {
      console.error(error);
      alert("क्रिएशन फेल: " + (error.response?.data?.message || "Check Console"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>👨‍🏫 Teacher Side (Dummy Create)</h2>
        <p>यहाँ से असाइनमेंट बनाओ ताकि डेटाबेस में ID जनरेट हो सके</p>
        
        <form onSubmit={handleCreate} className={styles.form}>
          <input 
            type="text" 
            placeholder="Assignment Title (e.g. React Basics)" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea 
            placeholder="Assignment Description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Assignment & Get ID"}
          </button>
        </form>

        {createdId && (
          <div className={styles.successBox}>
            <p>नई ID जनरेट हुई: <strong>{createdId}</strong></p>
            <p>अब स्टूडेंट पेज पर जाकर इसी असाइनमेंट को सबमिट करो।</p>
          </div>
        )}
      </div>
    </div>
  );
}