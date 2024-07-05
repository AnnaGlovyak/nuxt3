import courseData from "~/server/routes/api/courseData";
import type { Lesson, LessonWithPath, Chapter, Course } from "~/types/course";

courseData as Course;

export default defineEventHandler((event) => {
  const { chapterSlug, lessonSlug } = event.context.params;
  const chapter: Maybe<Chapter> = courseData.chapters.find(
    (c) => c.slug === chapterSlug
  );
  if (!chapter) {
    throw createError({
      message: "Chapter not found",
      statusCode: 404,
    });
  }
  const lesson: Maybe<Lesson> = chapter.lessons.find(
    (l) => l.slug === lessonSlug
  );
  if (!lesson) {
    throw createError({
      message: "Lesson not found",
      statusCode: 404,
    });
  }
  return {
    ...lesson,
    path: `/course/chapter/${chapterSlug}/lesson/${lessonSlug}`,
  };
});
