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
         :to="lesson.sourceUrl"
       >
         Download Source Code
       </NuxtLink>
       <NuxtLink
         v-if="lesson.downloadUrl"
         class="font-normal text-md text-gray-500"
         :to="lesson.downloadUrl"
       >
         Download Video
       </NuxtLink>
     </div>
     <VideoPlayer :videoId="lesson.videoId"/>
     <p>{{ lesson.text }}</p>
      <LessonCompleteButton 
      :model-value="isLessonComplete"
      @update:modelValue="toggleComplete"
     />
   </div>
</template>
<script setup>
const course = useCourse();
const route = useRoute();
const chapter = computed(() => {
  return course.chapters.find(c => c.slug === route.params.chapterSlug);
})
if (!chapter.value) {
  throw createError({
    message: "Chapter not found",
    statusCode: 404,
  })
}
const lesson = computed(() => {
  return chapter.value.lessons.find(l => l.slug === route.params.lessonSlug)
})
if (!lesson.value) {
  throw createError({
    message: "Lesson not found",
    statusCode: 404,
  })
}
const title = computed(() => {
  return `${lesson.value.title} - ${course.title}`
})
useHead({
  title,
})
const progress = useLocalStorage("progress", [])
const isLessonComplete = computed(() => {
  if (!progress.value[chapter.value.number - 1]) {
    return false;
  }
  if (!progress.value[chapter.value.number - 1][lesson.value.number - 1]) {
    return false;
  }
  return progress.value[chapter.value.number - 1][lesson.value.number - 1];
})
const toggleComplete = async () => {
  throw createError("Have some lesson error");
  if (!progress.value[chapter.value.number - 1]) {
    progress.value[chapter.value.number - 1] = [];
  }

  progress.value[chapter.value.number - 1][lesson.value.number - 1] = !isLessonComplete.value;
}
</script>