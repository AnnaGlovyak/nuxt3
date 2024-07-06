export default async (chapterSlug: string, lessonSlug: string) => {
  const { data, error } = await useFetch(
    `/api/course/chapter/${chapterSlug}/lesson/${lessonSlug}`
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
  return data;
};
