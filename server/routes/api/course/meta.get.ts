import courseData from "~/server/routes/api/courseData";
import type { Lesson, Chapter, Course } from "~/types/course";

courseData as Course;

type OutlineBase = {
  title: string;
  slug: string;
  number: number;
};
type OutlineChapter = OutlineBase & {
  lessons: OutlineLesson[];
};
type OutlineLesson = OutlineBase & {
  path: string;
};
type CourseMeta = {
  title: string;
  chapters: OutlineChapter[];
};

export default defineEventHandler((event): CourseMeta => {
  const outline: OutlineChapter[] = courseData.chapters.reduce(
    (acc: OutlineChapter[], cur: Chapter) => {
      const lessons: OutlineLesson[] = cur.lessons.map((l: Lesson) => {
        return {
          title: l.title,
          slug: l.slug,
          number: l.number,
          path: `/course/chapter/${cur.slug}/lesson/${l.slug}`,
        };
      });
      const chapter: OutlineChapter = {
        title: cur.title,
        slug: cur.slug,
        number: cur.number,
        lessons,
      };
      acc.push(chapter);
      return acc;
    },
    []
  );

  return {
    title: courseData.title,
    chapters: outline,
  };
});
