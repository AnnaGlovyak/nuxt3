<template>
  <div>
    <p class="mt-0 uppercase font-bold text-slate-400 mb-1">
      Lesson {{ chapter.number }} - {{ lesson.number }}
    </p>
    <h2 class="my-0">{{ lesson.title }}</h2>
    <div class="flex space-x-4 mt-2 mb-8">
      <NuxtLink
        v-if="lesson.sourceUrl"
        class="font-normal text-md text-gray-500"
        :to="lesson.sourceUrl">
        Download Source Code
      </NuxtLink>
      <NuxtLink
        v-if="lesson.downloadUrl"
        class="font-normal text-md text-gray-500"
        :to="lesson.downloadUrl">
        Download Video
      </NuxtLink>
    </div>
    <VideoPlayer :videoId="lesson.videoId" />
    <p>{{ lesson.text }}</p>
    <LessonCompleteButton
      :model-value="isLessonComplete"
      @update:modelValue="toggleComplete" />
  </div>
</template>
<script setup>
  const course = await useCourse();
  const route = useRoute();
  const { chapterSlug, lessonSlug } = route.params;
  const lesson = await useLesson(chapterSlug, lessonSlug);
  const chapter = computed(() => {
    return course.value.chapters.find(
      (c) => c.slug === route.params.chapterSlug
    );
  });
  definePageMeta({
    middleware: ["auth"],
  });
  const title = computed(() => {
    return `${lesson.value.title} - ${course.value.title}`;
  });
  useHead({
    title,
  });
  const progress = useLocalStorage("progress", []);
  const isLessonComplete = computed(() => {
    if (!progress.value[chapter.value.number - 1]) {
      return false;
    }
    if (!progress.value[chapter.value.number - 1][lesson.value.number - 1]) {
      return false;
    }
    return progress.value[chapter.value.number - 1][lesson.value.number - 1];
  });
  const toggleComplete = async () => {
    throw createError("Have some lesson error");
    if (!progress.value[chapter.value.number - 1]) {
      progress.value[chapter.value.number - 1] = [];
    }

    progress.value[chapter.value.number - 1][lesson.value.number - 1] =
      !isLessonComplete.value;
  };
</script>
