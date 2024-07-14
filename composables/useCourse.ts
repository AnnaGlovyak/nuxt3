import type { CourseOutline } from "~/server/routes/api/course/meta.get";

export default async () => useFetchWithCache<CourseOutline>("/api/course/meta");
