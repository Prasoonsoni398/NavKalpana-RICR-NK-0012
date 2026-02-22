'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { courseDetailsService } from '@/services/course-detail.services';
import styles from '@/styles/CourseDetail.module.css';
import { CourseDetail, Module, Lesson, Resource } from "@/models/course-detail.model"
interface ActiveLesson {
  lesson: Lesson;
  moduleTitle: string;
  moduleIndex: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const DIFFICULTY = {
  beginner:     { label: 'Beginner',     bg: '#064e3b', color: '#6ee7b7' },
  intermediate: { label: 'Intermediate', bg: '#78350f', color: '#fde68a' },
  advanced:     { label: 'Advanced',     bg: '#7f1d1d', color: '#fca5a5' },
};
const RESOURCE_ICON: Record<string, string> = {
  video: '▶', notes: '📄', quiz: '⚡', codelab: '⌨️',
};
const RESOURCE_LABEL: Record<string, string> = {
  video: 'Video', notes: 'Notes', quiz: 'Quiz', codelab: 'CodeLab',
};

function calcProgress(lessons: Array<{ completed: boolean }>) {
  if (!lessons.length) return 0;
  return Math.round((lessons.filter(l => l.completed).length / lessons.length) * 100);
}
function isImage(url: string) { return /\.(png|jpe?g|gif|webp|svg|bmp)(\?.*)?$/i.test(url); }
function isPdf(url: string)   { return /\.pdf(\?.*)?$/i.test(url); }

// ─── Progress Ring ────────────────────────────────────────────────────────────
function ProgressRing({ pct, size = 72, stroke = 6 }: { pct: number; size?: number; stroke?: number }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(96,152,241,0.12)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#6098f1" strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.7s cubic-bezier(.4,0,.2,1)' }} />
    </svg>
  );
}

// ─── Video Player ─────────────────────────────────────────────────────────────
function VideoPlayer({ resource }: { resource: Resource }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current && resource.url) {
      ref.current.load();
      ref.current.play().catch(() => {});
    }
  }, [resource.url]);

  if (!resource.url) return (
    <div className={styles.videoPlaceholder}>
      <span className={styles.videoPlaceholderIcon}>🎬</span>
      <span className={styles.videoPlaceholderText}>Video not yet available</span>
    </div>
  );
  return (
    <div className={styles.videoWrap}>
      <video ref={ref} controls autoPlay preload="metadata"
        poster={resource.metadata?.thumbnailUrl ?? undefined}>
        <source src={resource.url} type="video/mp4" />
      </video>
    </div>
  );
}

// ─── Notes Viewer ─────────────────────────────────────────────────────────────
function NotesViewer({ resource }: { resource: Resource }) {
  if (!resource.url) return (
    <div className={styles.notesBox}>
      <div className={styles.notesBoxHeader}>
        <span className={styles.notesBoxTitle}><span>📄</span>{resource.title}</span>
      </div>
      <p className={styles.notesNA}>Notes not yet available.</p>
    </div>
  );
  const img = isImage(resource.url);
  const pdf = isPdf(resource.url);
  return (
    <div className={styles.notesBox}>
      <div className={styles.notesBoxHeader}>
        <span className={styles.notesBoxTitle}>
          <span>{img ? '🖼️' : '📄'}</span>{resource.title}
        </span>
        <a href={resource.url} target="_blank" rel="noreferrer" className={styles.notesBoxLink}>
          Open ↗
        </a>
      </div>
      {img && <img src={resource.url} alt={resource.title} className={styles.notesImage} />}
      {pdf && <iframe src={resource.url} className={styles.notesEmbed} title={resource.title} />}
      {!img && !pdf && (
        <p className={styles.notesNA}>
          <a href={resource.url} target="_blank" rel="noreferrer" style={{ color: '#6098f1' }}>Open file ↗</a>
        </p>
      )}
    </div>
  );
}

// ─── Tabbed Lesson Content ────────────────────────────────────────────────────
function LessonContent({
  active, lessonStates, onComplete,
}: {
  active: ActiveLesson;
  lessonStates: Record<number, boolean>;
  onComplete: (id: number) => void;
}) {
  const { lesson, moduleTitle, moduleIndex } = active;
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('');
  const done = lessonStates[lesson.id] ?? lesson.completed;
  const diff = DIFFICULTY[lesson.difficulty] ?? DIFFICULTY.beginner;

  const video   = lesson.resources.find(r => r.type === 'video');
  const notes   = lesson.resources.find(r => r.type === 'notes');
  const quiz    = lesson.resources.find(r => r.type === 'quiz');
  const codelab = lesson.resources.find(r => r.type === 'codelab');

  // Build ordered tab list from available resources
  const tabs = [
    video   && { key: 'video',   label: 'Video',   icon: '▶' },
    notes   && { key: 'notes',   label: 'Notes',   icon: '📄' },
    quiz    && { key: 'quiz',    label: 'Quiz',    icon: '⚡' },
    codelab && { key: 'codelab', label: 'CodeLab', icon: '⌨️' },
  ].filter(Boolean) as { key: string; label: string; icon: string }[];

  // Set default tab when lesson changes
  useEffect(() => {
    if (tabs.length > 0) {
      setActiveTab(tabs[0].key);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  // Ensure activeTab is valid for this lesson
  const currentTab = tabs.find(t => t.key === activeTab)?.key ?? tabs[0]?.key ?? '';

  async function handleComplete() {
    setSaving(true);
    try {
      onComplete(lesson.id);
    } finally { setSaving(false); }
  }

  return (
    <>
      {/* Header */}
      <div className={styles.lessonHeader}>
        <div className={styles.lessonHeaderMeta}>
          <span className={styles.lessonModuleBadge}>
            M{String(moduleIndex + 1).padStart(2, '0')} · {moduleTitle}
          </span>
          <span className={styles.difficultyBadge} style={{ background: diff.bg, color: diff.color }}>
            {diff.label}
          </span>
        </div>
        <h2 className={styles.lessonTitle}>{lesson.title}</h2>
      </div>

      {/* Tabs — only shown when there are multiple resources */}
      {tabs.length > 1 && (
        <div className={styles.tabBar}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`${styles.tabBtn} ${currentTab === tab.key ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className={styles.tabBtnIcon}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Tab Content Panel */}
      {lesson.resources.length > 0 ? (
        <div className={styles.tabContent} key={currentTab}>
          {currentTab === 'video'   && video   && <VideoPlayer resource={video} />}
          {currentTab === 'notes'  && notes   && <NotesViewer resource={notes} />}
          {currentTab === 'quiz'   && quiz    && (
            <div className={styles.quizCard}>
              <div className={styles.quizCardLeft}>
                <span className={styles.quizCardIcon}>⚡</span>
                <div>
                  <p className={styles.quizCardTitle}>{quiz.title}</p>
                  <p className={styles.quizCardMeta}>
                    {quiz.metadata?.questionCount ? `${quiz.metadata.questionCount} questions` : 'Practice quiz'}
                    {quiz.metadata?.timeLimit ? ` · ${Math.floor(quiz.metadata.timeLimit / 60)} min` : ''}
                  </p>
                </div>
              </div>
              <button className={styles.quizBtn}>Start Quiz →</button>
            </div>
          )}
          {currentTab === 'codelab' && codelab && (
            <div className={styles.codelabCard}>
              <div className={styles.codelabCardLeft}>
                <span className={styles.codelabCardIcon}>⌨️</span>
                <div>
                  <p className={styles.codelabCardTitle}>{codelab.title}</p>
                  {codelab.metadata?.language && (
                    <p className={styles.codelabCardLang}>{codelab.metadata.language}</p>
                  )}
                </div>
              </div>
              {codelab.metadata?.starterRepoUrl
                ? <a href={codelab.metadata.starterRepoUrl} target="_blank" rel="noreferrer" className={styles.codelabBtn}>Open Lab →</a>
                : <button className={styles.codelabBtn}>Launch CodeLab →</button>
              }
            </div>
          )}
        </div>
      ) : (
        <div className={styles.noResources}>No resources attached to this lesson yet.</div>
      )}

      {/* Complete */}
      {!done ? (
        <button onClick={handleComplete} disabled={saving}
          className={`${styles.completeBtn} ${saving ? styles.completeBtnSaving : ''}`}>
          {saving ? <><span className={styles.spinner} />Saving…</> : '✓ Mark Lesson as Complete'}
        </button>
      ) : (
        <div className={styles.completedBadge}>✓ Lesson Completed</div>
      )}
    </>
  );
}

// ─── Middle: course welcome ───────────────────────────────────────────────────
function CourseWelcome({ course, totalLessons, doneLessons }: {
  course: CourseDetail; totalLessons: number; doneLessons: number;
}) {
  return (
    <div className={styles.welcomeHero}>
      <div className={styles.welcomeThumb}>
        {course.thumbnailUrl
          ? <img src={course.thumbnailUrl} alt={course.title} className={styles.welcomeThumbImg} />
          : (
            <div className={styles.welcomeThumbPlaceholder}>
              <span className={styles.welcomeThumbIcon}>📖</span>
              <span className={styles.welcomeThumbText}>Select a lesson from the left to start</span>
            </div>
          )
        }
      </div>
      <div className={styles.welcomeBody}>
        <h1 className={styles.welcomeTitle}>{course.title}</h1>
        <p className={styles.welcomeDesc}>{course.description}</p>
        <div className={styles.welcomeMeta}>
          {[
            { icon: '👨‍🏫', label: course.instructorName },
            { icon: '📚',  label: `${course.modules.length} modules` },
            { icon: '🎯',  label: `${totalLessons} lessons` },
            { icon: '✅',  label: `${doneLessons} completed` },
          ].map(({ icon, label }) => (
            <div key={label} className={styles.welcomeMetaChip}>
              <span>{icon}</span>{label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Left: module + lesson tree ───────────────────────────────────────────────
function ModuleTree({
  modules, activeLessonId, lessonStates, onSelect,
}: {
  modules: Module[];
  activeLessonId: number | null;
  lessonStates: Record<number, boolean>;
  onSelect: (lesson: Lesson, moduleTitle: string, moduleIndex: number) => void;
}) {
  const [openModules, setOpenModules] = useState<Record<string, boolean>>(
    () => Object.fromEntries(modules.map((m, i) => [m.id, i === 0]))
  );
  function toggleModule(id: string) {
    setOpenModules(prev => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <>
      {modules.map((mod, mi) => {
        const open     = !!openModules[mod.id];
        const lessons  = mod.lessons.map(l => ({ ...l, completed: lessonStates[l.id] ?? l.completed }));
        const progress = calcProgress(lessons);
        const doneCnt  = lessons.filter(l => l.completed).length;

        return (
          <div key={mod.id} className={styles.moduleGroup}>
            <div
              className={`${styles.moduleGroupHeader} ${open ? styles.moduleGroupOpen : ''}`}
              onClick={() => toggleModule(mod.id)}
            >
              <span className={styles.moduleGroupBadge}>M{String(mi + 1).padStart(2, '0')}</span>
              <span className={styles.moduleGroupTitle}>{mod.title}</span>
              <span className={`${styles.moduleGroupPct} ${progress === 100 ? styles.moduleGroupPctDone : ''}`}>
                {doneCnt}/{mod.lessons.length}
              </span>
              <span className={`${styles.moduleChevron} ${open ? styles.moduleChevronOpen : ''}`}>›</span>
            </div>

            {open && (
              <div className={styles.lessonItems}>
                {mod.lessons.map(lesson => {
                  const done     = lessonStates[lesson.id] ?? lesson.completed;
                  const isActive = lesson.id === activeLessonId;
                  return (
                    <div
                      key={lesson.id}
                      className={[
                        styles.lessonTreeItem,
                        isActive ? styles.lessonTreeItemActive : '',
                        done && !isActive ? styles.lessonTreeItemDone : '',
                      ].join(' ')}
                      onClick={() => onSelect(lesson, mod.title, mi)}
                    >
                      <div className={[
                        styles.lessonTreeCheck,
                        done ? styles.lessonTreeCheckDone : '',
                        isActive && !done ? styles.lessonTreeCheckActive : '',
                      ].join(' ')}>
                        {done && '✓'}
                      </div>
                      <span className={[
                        styles.lessonTreeTitle,
                        isActive ? styles.lessonTreeTitleActive : '',
                        done ? styles.lessonTreeTitleDone : '',
                      ].join(' ')}>
                        {lesson.title}
                      </span>
                      <div className={styles.lessonTreeIcons}>
                        {lesson.resources.map(r => (
                          <span key={r.id} className={styles.lessonResourceIcon}>
                            {RESOURCE_ICON[r.type] ?? '📎'}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

// ─── Right: progress + detail panel ──────────────────────────────────────────
function RightPanel({
  course, active, lessonStates, totalLessons, doneLessons, liveProgress,
}: {
  course: CourseDetail;
  active: ActiveLesson | null;
  lessonStates: Record<number, boolean>;
  totalLessons: number;
  doneLessons: number;
  liveProgress: number;
}) {
  return (
    <div className={styles.rightScroll}>
      <div className={styles.panelLabel}>Progress</div>
      <div className={styles.progressCard}>
        <div className={styles.progressCardTitle}>📈 Course Progress</div>
        <div className={styles.progressRingRow}>
          <div className={styles.progressRingWrap}>
            <ProgressRing pct={liveProgress} size={68} stroke={6} />
            <span className={styles.progressRingLabel}>{liveProgress}%</span>
          </div>
          <div>
            <div className={styles.progressInfoNum}>{liveProgress}%</div>
            <div className={styles.progressInfoSub}>{doneLessons} of {totalLessons} lessons</div>
          </div>
        </div>
        <div className={styles.progressBarTrack}>
          <div className={styles.progressBarFill} style={{ width: `${liveProgress}%` }} />
        </div>
      </div>

      <div className={styles.statsGrid}>
        {[
          { num: course.modules.length, label: 'Modules'  },
          { num: totalLessons,           label: 'Lessons'  },
          { num: doneLessons,            label: 'Done'     },
          { num: `${liveProgress}%`,     label: 'Progress' },
        ].map(({ num, label }) => (
          <div key={label} className={styles.statBox}>
            <div className={styles.statNum}>{num}</div>
            <div className={styles.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      {active ? (
        <>
          <div className={styles.panelLabel}>Lesson Details</div>
          <div className={styles.lessonDetailCard}>
            <div className={styles.lessonDetailTitle}>{active.lesson.title}</div>
            <div className={styles.lessonDetailRow}>
              <span className={styles.lessonDetailIcon}>📚</span>
              Module {active.moduleIndex + 1}: {active.moduleTitle}
            </div>
            {(() => {
              const diff = DIFFICULTY[active.lesson.difficulty] ?? DIFFICULTY.beginner;
              return (
                <div className={styles.lessonDetailRow}>
                  <span className={styles.lessonDetailIcon}>🎯</span>
                  <span style={{ background: diff.bg, color: diff.color, padding: '1px 6px', borderRadius: 3, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {diff.label}
                  </span>
                </div>
              );
            })()}
            <div className={styles.lessonDetailRow}>
              <span className={styles.lessonDetailIcon}>✅</span>
              {(lessonStates[active.lesson.id] ?? active.lesson.completed) ? 'Completed' : 'Not completed'}
            </div>
          </div>

          {active.lesson.resources.length > 0 && (
            <>
              <div className={styles.panelLabel}>Resources</div>
              <div className={styles.resourceList}>
                {active.lesson.resources.map(r => (
                  <div key={r.id} className={styles.resourceRow}>
                    <span className={styles.resourceRowIcon}>{RESOURCE_ICON[r.type] ?? '📎'}</span>
                    <span className={styles.resourceRowLabel}>{r.title}</span>
                    <span className={styles.resourceRowType}>{r.type}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className={styles.panelLabel}>Course Info</div>
          <div className={styles.courseDetailCard}>
            <div className={styles.courseDetailTitle}>{course.title}</div>
            <div className={styles.courseDetailRow}>
              <span className={styles.courseDetailRowIcon}>👨‍🏫</span>
              {course.instructorName}
            </div>
            <div className={styles.courseDetailRow}>
              <span className={styles.courseDetailRowIcon}>📚</span>
              {course.modules.length} modules · {totalLessons} lessons
            </div>
            <div className={styles.courseDetailDesc}>{course.description}</div>
          </div>

          <div className={styles.panelLabel}>Includes</div>
          <div className={styles.courseDetailCard}>
            <ul className={styles.featuresList}>
              {['Full lifetime access', 'Video lessons', 'PDF notes & images', 'Quizzes & CodeLabs', 'Progress tracking', 'Certificate on completion'].map(f => (
                <li key={f} className={styles.featureItem}>
                  <span className={styles.featureCheck}>✓</span>{f}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonTopbar} />
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonPanel}>
          {[80, 40, 40, 40, 60, 40, 40].map((w, i) => (
            <div key={i} className={styles.skeletonBar} style={{ height: 28, width: `${w}%` }} />
          ))}
        </div>
        <div className={styles.skeletonPanel}>
          <div className={styles.skeletonBar} style={{ height: 300, borderRadius: 8 }} />
          <div className={styles.skeletonBar} style={{ height: 100, borderRadius: 8 }} />
          <div className={styles.skeletonBar} style={{ height: 60,  borderRadius: 8 }} />
        </div>
        <div className={styles.skeletonPanel}>
          <div className={styles.skeletonBar} style={{ height: 140, borderRadius: 8 }} />
          <div className={styles.skeletonBar} style={{ height: 100, borderRadius: 8 }} />
          <div className={styles.skeletonBar} style={{ height: 120, borderRadius: 8 }} />
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CoursePage() {
  const params   = useParams();
  const courseId = params?.id as string;

  const [course,       setCourse]       = useState<CourseDetail | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<ActiveLesson | null>(null);
  const [lessonStates, setLessonStates] = useState<Record<number, boolean>>({});
  const [theme,        setTheme]        = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('course-theme') as 'dark' | 'light' | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('course-theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  }
useEffect(() => {
  if (!courseId) return;

  (async () => {
    try {
      setLoading(true);

      const data = await courseDetailsService.getAll(courseId);
      const course = Array.isArray(data) ? data[0] : data;

      // Map modules -> lessons -> resources to ensure type safety
      const fixedModules = course.modules.map((mod: Module) => ({
        ...mod,
        lessons: mod.lessons.map((lesson: Lesson) => ({
          ...lesson,
          resources: lesson.resources.map((res: any) => ({
            ...res,
            type: ["video", "notes", "quiz", "codelab"].includes(res.type)
              ? (res.type as "video" | "notes" | "quiz" | "codelab")
              : "notes", // fallback default
          })),
        })),
      }));

      // Set course state with fixed modules
      setCourse({
        ...course,
        modules: fixedModules,
        thumbnailUrl: course.thumbnailUrl ?? null,
      });

      // Prepare lesson completion states
      const states: Record<number, boolean> = {};
      fixedModules.forEach((mod: Module) =>
        mod.lessons.forEach((l: Lesson) => {
          states[l.id] = l.completed;
        })
      );
      setLessonStates(states);

    } catch (err: any) {
      setError(err.message ?? "Failed to load course.");
    } finally {
      setLoading(false);
    }
  })();
}, [courseId]);
  const handleSelect = useCallback((lesson: Lesson, moduleTitle: string, moduleIndex: number) => {
    setActiveLesson({ lesson, moduleTitle, moduleIndex });
  }, []);

  const handleComplete = useCallback((lessonId: number) => {
    setLessonStates(prev => ({ ...prev, [lessonId]: true }));
    setCourse(prev => {
      if (!prev) return prev;
      const updatedModules = prev.modules.map(mod => ({
        ...mod,
        lessons: mod.lessons.map(l => l.id === lessonId ? { ...l, completed: true } : l),
      }));
      const all      = updatedModules.flatMap(m => m.lessons);
      const progress = Math.round((all.filter(l => l.completed).length / all.length) * 100);
      return { ...prev, modules: updatedModules, progress };
    });
  }, []);

  if (loading) return <Skeleton />;
  if (error) return (
    <div className={styles.stateCenter}>
      <span className={styles.stateIcon}>⚠️</span>
      <p className={styles.stateError}>{error}</p>
      <button className={styles.retryBtn} onClick={() => window.location.reload()}>Retry</button>
    </div>
  );
  if (!course) return (
    <div className={styles.stateCenter}>
      <p className={styles.stateEmpty}>Course not found.</p>
    </div>
  );

  const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);
  const doneLessons  = Object.values(lessonStates).filter(Boolean).length;
  const liveProgress = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      <div className={styles.shell}>

        {/* ── TOP BAR ─────────────────────────────────────────────────────── */}
        <div className={styles.topbar}>
          <div className={styles.topbarBreadcrumb}>
            <a href="/student/my-courses" className={styles.topbarLink}>My Courses</a>
            <span className={styles.topbarSep}>›</span>
            <span className={styles.topbarCurrent}>{course.title}</span>
          </div>
          <div className={styles.topbarSpacer} />
          <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Toggle theme">
            <span className={styles.themeToggleIcon}>{theme === 'dark' ? '☀️' : '🌙'}</span>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          <div className={styles.topbarPill}>
            <span className={styles.topbarPillDot}>●</span>
            {course.isPublished ? 'Published' : 'Draft'}
          </div>
        </div>

        {/* ── 3-PANEL BODY ────────────────────────────────────────────────── */}
        <div className={styles.body}>

          {/* LEFT — module + lesson tree */}
          <div className={styles.leftPanel}>
            <div className={styles.leftHeader}>
              <div className={styles.leftHeaderTitle}>Course Content</div>
              <div className={styles.leftHeaderMeta}>
                {course.modules.length} modules · {totalLessons} lessons · {liveProgress}% done
              </div>
            </div>
            <div className={styles.leftScroll}>
              <ModuleTree
                modules={course.modules}
                activeLessonId={activeLesson?.lesson.id ?? null}
                lessonStates={lessonStates}
                onSelect={handleSelect}
              />
            </div>
          </div>

          {/* MIDDLE — main content */}
          <div className={styles.midPanel}>
            <div className={styles.midScroll}>
              {activeLesson ? (
                <LessonContent
                  active={activeLesson}
                  lessonStates={lessonStates}
                  onComplete={handleComplete}
                />
              ) : (
                <CourseWelcome
                  course={course}
                  totalLessons={totalLessons}
                  doneLessons={doneLessons}
                />
              )}
            </div>
          </div>

          {/* RIGHT — progress + details */}
          <div className={styles.rightPanel}>
            <RightPanel
              course={course}
              active={activeLesson}
              lessonStates={lessonStates}
              totalLessons={totalLessons}
              doneLessons={doneLessons}
              liveProgress={liveProgress}
            />
          </div>

        </div>
      </div>
    </>
  );
}