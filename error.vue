<template>
    <NuxtLayout>
        <div class="flex flex-col">
            <div v-if="error.statusCode === '404'" class="prose">
                <h1>404</h1>
                <p>I guess that page doesn't exist</p>
            </div>
            <div v-else class="prose">
                <h1>Dang!</h1>
                <p>It's looks like something broke.</p>
                <p>Sorry about that. </p>
            </div>
            <div class="prose mt-5">
                <p>
                    <strong>{{ error.message }}</strong>
                </p>
                <p>
                    Got to 
                    <a class="hover:cursor-pointer" @click="handleError">
                        first leson.
                    </a>
                </p>
            </div>
        </div>
    </NuxtLayout>
</template>
<script setup>
    const error = useError(); // all errors are setted here
    const handleError = () => {
        clearError({ // exist on server
            redirect: "/course/chapter/1-chapter-1/lesson/2-typescript-in-vue-components"
        })
    }
</script>