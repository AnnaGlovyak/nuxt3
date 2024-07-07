<template>
  <NuxtLink class="underline font-medium" :href="firstLesson.path">
    Go to first lesson
  </NuxtLink>
</template>
<script setup lang="ts">
  const firstLesson = await useFirstLesson();
  console.log("HAVE first lesson", firstLesson);
</script>
