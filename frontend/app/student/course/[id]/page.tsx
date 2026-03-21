"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Play,
  FileText,
  HelpCircle,
  Code,
  CheckCircle,
  Clock,
  BarChart,
} from "lucide-react";
import styles from "@/styles/CourseDetail.module.css";
import { dashboardService } from "@/services/dashboard.services";
import toast from "react-hot-toast";

interface Lecture {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  completed: boolean;
}

interface Module {
  id: string;
  title: string;
  lectures: Lecture[];
}

export default function CourseDetail() {
  const { id } = useParams();
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseTitle, setCourseTitle] = useState("");
  const [instructor, setInstructor] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // In real app: const data = await dashboardService.getCourseDetails(id as string);
        // Mock data
        const mockCourse = {
          title: "Advanced React Development",
          instructor: "Dr. Sarah Johnson",
          modules: [
            {
              id: "m1",
              title: "React Hooks Deep Dive",
              lectures: [
                { id: "l1", title: "useState and useEffect", difficulty: "Intermediate", duration: "15:30", completed: false },
                { id: "l2", title: "Custom Hooks", difficulty: "Advanced", duration: "20:15", completed: false },
              ],
            },
            {
              id: "m2",
              title: "Performance Optimization",
              lectures: [
                { id: "l3", title: "React.memo and useMemo", difficulty: "Advanced", duration: "22:10", completed: false },
              ],
            },
          ],
        };
        setCourseTitle(mockCourse.title);
        setInstructor(mockCourse.instructor);
        setModules(mockCourse.modules);
      } catch (error) {
        console.error("Failed to load course details:", error);
        toast.error("Could not load course");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const markLessonComplete = async (moduleId: string, lectureId: string) => {
    // Update local state
    setModules(prev =>
      prev.map(module =>
        module.id === moduleId
          ? {
              ...module,
              lectures: module.lectures.map(lecture =>
                lecture.id === lectureId ? { ...lecture, completed: true } : lecture
              ),
            }
          : module
      )
    );

    // In real app: await dashboardService.updateProgress(courseId, lectureId);
    // Also update dashboard stats (could call a global update or context)
    toast.success("Lesson marked complete! +10 XP", { icon: "🎓" });
  };

  const getModuleProgress = (lectures: Lecture[]) => {
    const completed = lectures.filter(l => l.completed).length;
    return lectures.length > 0 ? Math.round((completed / lectures.length) * 100) : 0;
  };

  const allLectures = modules.flatMap(m => m.lectures);
  const totalLectures = allLectures.length;
  const completedLectures = allLectures.filter(l => l.completed).length;
  const courseProgress = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;

  if (loading) return <div className={styles.loading}>Loading course...</div>;

  return (
    <div className={styles.detailContainer}>
      {/* Course Header */}
      <div className={styles.courseHeader}>
        <h1 className={styles.courseTitle}>{courseTitle}</h1>
        <p className={styles.instructor}>Instructor: {instructor}</p>
        <div className={styles.progressOverview}>
          <div className={styles.progressInfo}>
            <BarChart size={18} />
            <span>Course Progress: {courseProgress}%</span>
          </div>
          <div className={styles.progressBarLarge}>
            <div className={styles.progressFillLarge} style={{ width: `${courseProgress}%` }} />
          </div>
        </div>
      </div>

      {/* Modules List */}
      <div className={styles.modulesContainer}>
        {modules.map((module) => {
          const moduleProgress = getModuleProgress(module.lectures);
          const isExpanded = expandedModules.includes(module.id);
          return (
            <div key={module.id} className={styles.moduleCard}>
              <button
                className={styles.moduleHeader}
                onClick={() => toggleModule(module.id)}
              >
                <div className={styles.moduleTitle}>
                  {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  <span>{module.title}</span>
                </div>
                <div className={styles.moduleMeta}>
                  <span className={styles.lectureCount}>
                    {module.lectures.length} lectures
                  </span>
                  <div className={styles.moduleProgressBadge}>
                    <div className={styles.moduleProgressBar}>
                      <div
                        className={styles.moduleProgressFill}
                        style={{ width: `${moduleProgress}%` }}
                      />
                    </div>
                    <span>{moduleProgress}%</span>
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={styles.lectureList}
                  >
                    {module.lectures.map((lecture) => (
                      <div key={lecture.id} className={styles.lectureItem}>
                        <div className={styles.lectureInfo}>
                          <div className={styles.lectureIcon}>
                            {lecture.completed ? (
                              <CheckCircle size={18} color="#10B981" />
                            ) : (
                              <Play size={18} />
                            )}
                          </div>
                          <div className={styles.lectureDetails}>
                            <h4 className={styles.lectureTitle}>{lecture.title}</h4>
                            <div className={styles.lectureMeta}>
                              <span
                                className={`${styles.difficulty} ${
                                  styles[lecture.difficulty.toLowerCase()]
                                }`}
                              >
                                {lecture.difficulty}
                              </span>
                              <span className={styles.duration}>
                                <Clock size={14} /> {lecture.duration}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className={styles.lectureActions}>
                          <button className={styles.resourceBtn} title="Video">
                            <Play size={16} />
                          </button>
                          <button className={styles.resourceBtn} title="Notes">
                            <FileText size={16} />
                          </button>
                          <button className={styles.resourceBtn} title="Quiz">
                            <HelpCircle size={16} />
                          </button>
                          <button className={styles.resourceBtn} title="CodeLab">
                            <Code size={16} />
                          </button>
                          <button
                            className={`${styles.completeLessonBtn} ${
                              lecture.completed ? styles.completed : ""
                            }`}
                            onClick={() => markLessonComplete(module.id, lecture.id)}
                            disabled={lecture.completed}
                          >
                            {lecture.completed ? (
                              <>
                                <CheckCircle size={14} /> Done
                              </>
                            ) : (
                              "Mark Complete"
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}