"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/LearningSupport.module.css";
import { MessageSquare, Video, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { learningSupportService } from "@/services/learning-support.services";
import { courseService } from "@/services/course.services";
import type {
  DoubtDetail,
  BackupRequestDetail,
} from "@/models/learning-support.model";
import type { CourseResponse } from "@/models/course.model";
import { fileUploadService } from "@/services/fileupload.services";

export default function LearningSupport() {
  const [activeTab, setActiveTab] = useState<"doubt" | "backup">("doubt");

  const [doubts, setDoubts] = useState<DoubtDetail[]>([]);
  const [backupRequests, setBackupRequests] = useState<BackupRequestDetail[]>([]);
  const [courses, setCourses] = useState<CourseResponse[]>([]);

  const [selectedCourse, setSelectedCourse] = useState<number>();
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState<string | undefined>();

  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // ===============================
  // Initial Load
  // ===============================
  useEffect(() => {
    fetchCourses();
    fetchDoubts();
    fetchBackupRequests();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await courseService.getMyCourses();
      setCourses(data);
    } catch {
      toast.error("Failed to load courses");
    }
  };

  const fetchDoubts = async () => {
    try {
      const data = await learningSupportService.getMyDoubts();
      setDoubts(data);
    } catch {
      toast.error("Failed to load doubts");
    }
  };

  const fetchBackupRequests = async () => {
    try {
      const data = await learningSupportService.getMyBackupRequests();
      setBackupRequests(data);
    } catch {
      toast.error("Failed to load backup requests");
    }
  };

  // ===============================
  // File Upload
  // ===============================
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fileUploadService.uploadFile(file);
      setFileUrl(response?.url || response?.fileUrl);
      toast.success("File uploaded");
    } catch {
      toast.error("File upload failed");
    }
  };

  // ===============================
  // Submit Handler
  // ===============================
  const handleSubmit = async () => {
    if (!selectedCourse || !topic || !description) {
      toast.error("All fields required");
      return;
    }

    try {
      setLoading(true);

      if (activeTab === "doubt") {
        await learningSupportService.createDoubt({
          courseId: selectedCourse,
          topic,
          description,
          fileUrl,
        });

        toast.success("Doubt submitted successfully");
        fetchDoubts();
      } else {
        await learningSupportService.createBackupRequest({
          courseId: selectedCourse,
          topic,
          description,
        });

        toast.success("Backup request submitted");
        fetchBackupRequests();
      }

      resetForm();
      setOpenDialog(false);
    } catch {
      toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTopic("");
    setDescription("");
    setSelectedCourse(undefined);
    setFileUrl(undefined);
  };

  // ===============================
  // Render List Based On Tab
  // ===============================
  const renderList = () => {
    if (activeTab === "doubt") {
      return doubts.map((item) => (
        <div key={item.id} className={styles.card}>
          <h3>{item.topic}</h3>
          <p>{item.description}</p>
          <span className={styles.status}>{item.status}</span>
        </div>
      ));
    }

    return backupRequests.map((item) => (
      <div key={item.id} className={styles.card}>
        <h3>{item.topic}</h3>
        <p>{item.description}</p>
        <span className={styles.status}>{item.status}</span>
      </div>
    ));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Learning Support</h1>

        <button
          className={styles.newBtn}
          onClick={() => setOpenDialog(true)}
        >
          <Plus size={16} /> New
        </button>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={activeTab === "doubt" ? styles.activeTab : ""}
          onClick={() => setActiveTab("doubt")}
        >
          <MessageSquare size={16} /> Doubts
        </button>

        <button
          className={activeTab === "backup" ? styles.activeTab : ""}
          onClick={() => setActiveTab("backup")}
        >
          <Video size={16} /> Backup
        </button>
      </div>

      {/* List */}
      <div className={styles.listSection}>{renderList()}</div>

      {/* Dialog */}
      {openDialog && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialog}>
            <h3>
              {activeTab === "doubt"
                ? "Submit Doubt"
                : "Submit Backup Request"}
            </h3>

            <select
              value={selectedCourse ?? ""}
              onChange={(e) =>
                setSelectedCourse(Number(e.target.value))
              }
              className={styles.input}
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className={styles.input}
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
            />

            {activeTab === "doubt" && (
              <input type="file" onChange={handleFileUpload} />
            )}

            <div className={styles.dialogActions}>
              <button onClick={() => setOpenDialog(false)}>
                Cancel
              </button>

              <button onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}