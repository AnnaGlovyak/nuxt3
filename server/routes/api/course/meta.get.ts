import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const LessonSelect = Prisma.validator<Prisma.LessonDefaultArgs>()({
  select: {
    title: true,
    number: true,
    slug: true,
  },
});

export type LessonOutLine = Prisma.LessonGetPayload<typeof LessonSelect> & {
  path: string;
};

const ChapterSelect = Prisma.validator<Prisma.ChapterDefaultArgs>()({
  select: {
    title: true,
    number: true,
    slug: true,
    lessons: LessonSelect,
  },
});

export type ChapterOutline = Omit<
  Prisma.ChapterGetPayload<typeof ChapterSelect>,
  "lessons"
> & {
  lessons: LessonOutLine[];
};

const CourseSelect = Prisma.validator<Prisma.CourseDefaultArgs>()({
  select: {
    title: true,
    chapters: ChapterSelect,
  },
});

export type CourseOutline = Omit<
  Prisma.CourseGetPayload<typeof CourseSelect>,
  "chapters"
> & {
  chapters: ChapterOutline[];
};

export default defineEventHandler(async (event) => {
  const outline = await prisma.course.findFirst(CourseSelect);

  if (!outline) {
    throw createError({
      statusCode: 404,
      message: "Course not found",
    });
  }

  const chapters = outline.chapters.map((chapter) => ({
    ...chapter,
    lessons: chapter.lessons.map((lesson) => ({
      ...lesson,
      path: `/course/chapter/${chapter.slug}/lesson/${lesson.slug}`,
    })),
  }));

  return {
    ...outline,
    chapters,
  };
});
