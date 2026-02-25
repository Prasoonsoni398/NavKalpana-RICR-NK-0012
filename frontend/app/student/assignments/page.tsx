"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  FileText,
  CheckCircle,
  Clock,
  Search,
} from "lucide-react";
import { assignmentService } from "@/services/assignment.services";
import styles from "@/styles/Assignment.module.css";
import { useRouter } from "next/navigation";

export default function AssignmentsPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await assignmentService.getAll();
        setAssignments(data || []);
      } catch (error) {
        console.error("Failed to fetch assignments", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

 const handleCardClick = (assignment: any) => {
  if (assignment.submission) {
    router.push(`/student/assignments/${assignment.id}/view`);
  } else {
    router.push(`/student/assignments/${assignment.id}/submit`);
  }
};

  //  Filtering + Search Logic
  const filteredAssignments = useMemo(() => {
    return assignments
      .filter((a) =>
        a.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((a) => {
        if (filter === "completed") return !!a.submission;
        if (filter === "pending") return !a.submission;
        return true;
      });
  }, [assignments, search, filter]);

  const completedCount = assignments.filter(a => a.submission).length;
  const pendingCount = assignments.length - completedCount;

  if (loading) {
    return <p className={styles.loading}>Loading assignments...</p>;
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>My Assignments</h1>
          <p>Track your assignment status</p>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.statBox}>
            <span className={styles.statVal}>{assignments.length}</span>
            <span className={styles.statLab}>Total</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statVal}>{completedCount}</span>
            <span className={styles.statLab}>Completed</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statVal}>{pendingCount}</span>
            <span className={styles.statLab}>Pending</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search assignments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Cards */}
      <div className={styles.grid}>
        {filteredAssignments.length === 0 ? (
          <p>No assignments found.</p>
        ) : (
          filteredAssignments.map((assignment) => (
            <div key={assignment.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={`${styles.iconBg} ${styles.bgYellow}`}>
                  <FileText size={20} />
                </div>

                <span
                  className={`${styles.statusBadge} ${
                    assignment.submission
                      ? styles.completed
                      : styles.pending
                  }`}
                >
                  {assignment.submission ? "COMPLETED" : "PENDING"}
                </span>
              </div>

              <div className={styles.cardBody}>
                <h3>{assignment.title}</h3>
                <p className={styles.courseName}>
                  {assignment.description}
                </p>

                {assignment.submission && (
                  <div className={styles.metaInfo}>
                    <div className={styles.metaItem}>
                      <CheckCircle size={16} />
                      Marks:{" "}
                      {assignment.submission.marks ?? "Not Evaluated"}
                    </div>
                    <div className={styles.metaItem}>
                      <Clock size={16} />
                      Feedback:{" "}
                      {assignment.submission.feedback ??
                        "No feedback yet"}
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.cardFooter}>
                <button className={styles.submitBtn} onClick={() => handleCardClick(assignment)}>
                  {assignment.submission
                    ? "View Submission"
                    : "Submit Assignment"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}