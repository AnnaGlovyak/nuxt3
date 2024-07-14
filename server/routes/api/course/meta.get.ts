import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const LessonSelect = Prisma.validator<Prisma.LessonDefaultArgs>()({
  select: {
    title: true,
    number: true,
    slug: true,
  },
});

type LessonOutLine = Prisma.LessonGetPayload<typeof LessonSelect>;

const ChapterSelect = Prisma.validator<Prisma.ChapterDefaultArgs>()({
  select: {
    title: true,
    number: true,
    slug: true,
    lessons: LessonSelect,
  },
});

export type ChapterOutline = Prisma.ChapterGetPayload<typeof ChapterSelect>;

const CourseSelect = Prisma.validator<Prisma.CourseDefaultArgs>()({
  select: {
    title: true,
    chapters: ChapterSelect,
  },
});

export type CourseOutline = Prisma.CourseGetPayload<typeof CourseSelect>;

export default defineEventHandler(async (event) => {
  return prisma.course.findFirst(CourseSelect);
});
