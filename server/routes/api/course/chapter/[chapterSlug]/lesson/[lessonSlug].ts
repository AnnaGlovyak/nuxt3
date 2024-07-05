export default defineEventHandler((event) => {
  const { chapterSlug, lessonSlug } = event.context.params;
  return `Chapter - ${chapterSlug}, Lesson - ${lessonSlug}`;
});
