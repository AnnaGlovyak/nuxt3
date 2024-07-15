import { PrismaClient } from "@prisma/client";
import protectRoute from "~/server/utils/protectRoute";
import type { CourseProgress, ChapterProgress } from "~/types/course";
import type {
  ChapterOutline,
  LessonOutLine,
} from "~/server/routes/api/course/meta.get";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  protectRoute(event);
  const {
    user: { email: userEmail },
  } = event.context;
  const userProgress = await prisma.progress.findMany({
    where: {
      userEmail,
      // want get progress only for course 1
      Lesson: {
        Chapter: {
          Course: {
            id: 1,
          },
        },
      },
    },
    select: {
      completed: true,
      Lesson: {
        select: {
          slug: true,
          Chapter: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
  });

  const courseOutline = await $fetch("/api/course/meta");

  if (!courseOutline) {
    throw createError({
      statusCode: 404,
      message: "Course not found",
    });
  }

  const progress = courseOutline.chapters.reduce(
    (courseProgress: CourseProgress, chapter: ChapterOutline) => {
      courseProgress[chapter.slug] = chapter.lessons.reduce(
        (chapterProgress: ChapterProgress, lesson: LessonOutLine) => {
          // Collect the progress for each lesson in the chapter
          chapterProgress[lesson.slug] =
            userProgress.find(
              (progress) =>
                progress.Lesson.slug === lesson.slug &&
                progress.Lesson.Chapter.slug === chapter.slug
            )?.completed || false;

          return chapterProgress;
        },
        {}
      );

      return courseProgress;
    },
    {}
  );
  return progress;
});
