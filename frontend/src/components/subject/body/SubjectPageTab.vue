<template>
    <v-tabs align-tabs="center" grow slider-color="#003EFF">
        <v-tab
            v-for="(item, index) in items"
            :key="index"
            class="page-tab"

        >{{ $t(`subject.${item}`) }}
        </v-tab>
    </v-tabs>
</template>

<script setup lang="ts">

const items = ["projects", "announcements", "groups"];

</script>

<style scoped>

.page-tab {
    font-size: 20px;
    font-weight: 500;
    font-family: 'Poppins', sans-serif;
    text-transform: capitalize;
    background-color: white;

}


</style>
