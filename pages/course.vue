<template>
  <div
    class="p-12 bg-gray-100 w-full h-full min-h-screen flex flex-col items-center"
  >
    <div class="prose mb-12">
      <h1>
        <span class="font-medium">Course:</span>
        {{ name }}
      </h1>
    </div>

    <div class="flex flex-row justify-center flex-grow">
      <div
        class="prose mr-4 p-8 bg-white rounded-md min-w-[20ch] flex flex-col"
      >
        <h3>Chapters</h3>
        <div
          class="space-y-1 mb-4 flex flex-col"
          v-for="chapter in chapters"
        >
          <h4>{{ chapter.title }}</h4>
          <NuxtLink
            v-for="(lesson, index) in chapter.lessons"
            class="no-underline prose-sm font-normal py-1 px-4 -mx-4 border border-white rounded-md even:bg-gray-100 hover:bg-blue-50 hover:cursor-pointer transition-colors"
            :key="lesson.path"
            :to="lesson.path"
            :class="{
              'text-blue-500': lesson.path === $route.path,
              'text-gray-500': lesson.path !== $route.path,
            }"
          >
            {{ index + 1 }}. {{ lesson.title }}
          </NuxtLink>
        </div>
      </div>

      <div class="prose p-12 bg-white rounded-md w-[65ch]">
        <NuxtPage :key="$route.fullPath" />
      </div>
    </div>
  </div>
</template>

<script setup>
const { name, chapters } = useCourse();
console.log(chapters);
</script>