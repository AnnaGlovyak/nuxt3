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
          v-for="chapter in course.chapters"
          :key="chapter.slug">
          <h4>{{ chapter.title }}</h4>
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
