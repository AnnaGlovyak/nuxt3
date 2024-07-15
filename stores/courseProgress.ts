import { defineStore } from "pinia";
import type { CourseProgress } from "~/types/course";

export const useCourseProgress = defineStore("courseProgress", () => {
  const progress = ref<CourseProgress>({});
  const initialized = ref(false);
  async function initialize() {
    if (initialized.value) return;
    initialized.value = true;

    const { data: userProgress } = await useFetch<CourseProgress>(
      "/api/user/progress",
      {
        headers: useRequestHeaders(["cookie"]),
      }
    );

    if (userProgress.value) {
      progress.value = userProgress.value;
    }
  }

  const toggleComplete = async (chapter: string, lesson: string) => {
    const user = useSupabaseUser();
    if (!user.value) return;

    if (!chapter || !lesson) {
      const {
        params: { chapterSlug, lessonSlug },
      } = useRoute();
      chapter = chapterSlug as string;
      lesson = lessonSlug as string;
    }

    const currentProgress = progress.value[chapter]?.[lesson];

    progress.value[chapter] = {
      ...progress.value[chapter],
      [lesson]: !currentProgress,
    };

    try {
      await $fetch(`/api/course/chapter/${chapter}/lesson/${lesson}/progress`, {
        method: "POST",
        body: {
          completed: !currentProgress,
        },
      });
    } catch (error) {
      console.log(error);
      progress.value[chapter] = {
        ...progress.value[chapter],
        [lesson]: !currentProgress,
      };
    }
  };

  const percentageCompleted = computed(() => {
    const chapters = Object.values(progress.value).map((chapter) => {
      const lessons = Object.values(chapter);
      const completedLessons = lessons.filter((lesson) => lesson);
      return Number((completedLessons.length / lessons.length) * 100).toFixed(
        0
      );
    }, []);

    const totalLessons = Object.values(progress.value).reduce(
      (number, chapter) => {
        return number + Object.values(chapter).length;
      },
      0
    );

    const totalCompletedLessons = Object.values(progress.value).reduce(
      (number, chapter) => {
        return (
          number + Object.values(chapter).filter((lesson) => lesson).length
        );
      },
      0
    );

    const course = Number((totalCompletedLessons / totalLessons) * 100).toFixed(
      0
    );

    return {
      chapters,
      course,
    };
  });

  return {
    initialize,
    progress,
    toggleComplete,
    percentageCompleted,
  };
});
