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
      v-if="user"
      :model-value="isCompleted"
      @update:modelValue="toggleComplete" />
  </div>
</template>
<script setup>
  import { useCourseProgress } from "~/stores/courseProgress";
  const route = useRoute();
  const { chapterSlug, lessonSlug } = route.params;
  const user = useSupabaseUser();

  const name = computed(() => user.value?.user_metadata.full_name);
  const profile = computed(() => user.value?.user_metadata.avatar_url);

  const course = await useCourse();
  const lesson = await useLesson(chapterSlug, lessonSlug);
  const store = useCourseProgress();
  const { toggleComplete, initialize } = store;

  initialize();

  const chapter = computed(() => {
    return course.value.chapters.find(
      (c) => c.slug === route.params.chapterSlug
    );
  });
  definePageMeta({
    middleware: ["auth"],
  });
  const title = computed(() => {
    return `${lesson?.value.title} - ${course?.value.title}`;
  });
  const isCompleted = computed(() => {
    return store.progress?.[chapterSlug]?.[lessonSlug] || false;
  });
  useHead({
    title,
  });
</script>
