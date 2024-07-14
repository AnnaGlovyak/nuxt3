import { StorageSerializers } from "@vueuse/core";

export default async <T>(url: string) => {
  const cached = useSessionStorage<T>(url, null, {
    // when provide null as the default value, useSessionStorage doesn't know which serializer to use
    serializer: StorageSerializers.object,
  });

  if (!cached.value) {
    const { data, error } = await useFetch<T>(url, {
      headers: useRequestHeaders(["cookie"]),
    });

    if (error.value) {
      throw createError({
        ...error.value,
        statusMessage: `Couldn't resolve ${url}`,
      });
    }

    cached.value = data.value as T;
  } else {
    console.log(`Get cache for ${url}`);
  }

  return cached;
};
