<template>
  <div>
    <div class="mb-4 flex justify-between items-center w-full">
      <h1 class="text-3xl">
        <span class="font-medium">
          Course:
          <span class="font-bold">{{ course.title }}</span>
        </span>
      </h1>
      <UserCard />
    </div>

    <div class="flex flex-row justify-center flex-grow">
      <div
        class="prose mr-4 p-8 bg-white rounded-md min-w-[20ch] max-w-[30ch] flex flex-col">
        <h3>Chapters</h3>
        <div
          class="space-y-1 mb-4 flex flex-col"
          v-for="(chapter, index) in course.chapters"
          :key="chapter.slug">
          <h4 class="flex justify-between items-center">
            {{ chapter.title }}
            <span
              v-if="percentageCompleted && user"
              class="text-emerald-500 text-sm">
              {{ percentageCompleted.chapters[index] }}%
            </span>
          </h4>
          <NuxtLink
            :to="lesson.path"
            class="flex flex-row space-x-1 no-underline prose-sm font-normal"
            :class="{
              'text-blue-500': lesson.path === $route.fullPath,
              'text-gray-600': lesson.path !== $route.fullPath,
            }"
            v-for="(lesson, index) in chapter.lessons"
            :key="index">
            <span class="text-gray-500">{{ index + 1 }}.</span>
            <span>{{ lesson.title }}</span>
          </NuxtLink>
        </div>
        <div
          v-if="percentageCompleted"
          class="mt-8 text-sm font-medium text-gray-500 flex justify-between items-center">
          Course completion:
          <span> {{ percentageCompleted.course }}% </span>
        </div>
      </div>
      <div class="prose p-12 bg-white rounded-md w-[65ch]">
        <NuxtErrorBoundary>
          <NuxtPage />
          <template #error="{ error }">
            <p>
              Oh no, have error
              <code>{{ error }}</code>
            </p>
            <button @click="resetError">Reset</button>
          </template>
        </NuxtErrorBoundary>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { useCourseProgress } from "~/stores/courseProgress";
  import { storeToRefs } from "pinia";
  const { percentageCompleted } = storeToRefs(useCourseProgress());
  const user = useSupabaseUser();
  const course = await useCourse();
  const firstLesson = await useFirstLesson();
  const resetError = async (error) => {
    await navigateTo(firstLesson.path);
    error.value = null;
  };
</script>
<style scoped>
  .router-link-active {
    @apply text-blue-500;
  }
</style>
