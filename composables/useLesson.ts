import { StorageSerializers } from "@vueuse/core";
import type { LessonWithPath } from "~/types/course";

export default async (chapterSlug: string, lessonSlug: string) => {
  // use sessionStorage to cash the lesson
  const url = `/api/course/chapter/${chapterSlug}/lesson/${lessonSlug}`;
  const lesson = useSessionStorage<LessonWithPath>(url, null, {
    // when provide null as the default value, useSessionStorage doesn't know which serializer to use
    serializer: StorageSerializers.object,
  });

  if (!lesson.value) {
    const { data, error } = await useFetch<LessonWithPath>(
      url
      // use pick to grab only some fields of data
      // {
      // pick: ["title", "number", "slug"],
      // }
    );
    // another way to fetch data ( useFetch = useAsyncData + $fetch)
    // const { data, error } = await useAsyncData(() =>
    //   // $fetch - When we call it on server side, it can fetch data from our server route without http request (calls server api defineEventHandler directly)
    //   $fetch(`/api/course/chapter/${chapterSlug}/lesson/${lessonSlug}`)
    // );

    if (error.value) {
      throw createError({
        ...error.value,
        statusMessage: `Couldn't resolve lesson ${lessonSlug} in chapter ${chapterSlug}`,
      });
    }

    lesson.value = data.value;
  } else {
    console.log(`Get from cash lesson ${lessonSlug} in chapter ${chapterSlug}`);
  }

  return lesson;
};
