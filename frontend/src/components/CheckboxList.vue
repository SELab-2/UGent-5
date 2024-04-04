<template>
    <v-card class="checkbox-list">
        <v-card-title>{{ title }}</v-card-title>
        <v-list>
            <v-list-item v-for="item in items" :key="item.id" class="checkbox-item">
                <v-list-item-action>
                    <v-checkbox :input-value="item.checked" @change="val => item.checked = val"></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>{{ item.label }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        <v-card-text class="description">{{ description }}</v-card-text>
    </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

interface CheckBoxItem {
    id: number;
    label: string;
    available: boolean;
    checked: boolean;
}

export default defineComponent({
    name: 'CheckBox',
    props: {
        title: {
            type: String,
            required: true,
        },
        items: {
            type: Array as PropType<CheckBoxItem[]>,
            required: true,
        },
        description: {
            type: String,
            default: '',
        },
    },
});
</script>


<!--<style scoped>-->
<!--.checkbox-list {-->
<!--    /* Adjusted styles for better layout without the status indicators */-->
<!--    display: block;-->
<!--}-->

<!--.checkbox-item {-->
<!--    display: flex;-->
<!--    align-items: center;-->
<!--    margin-bottom: 0.5rem; /* Adjust spacing between items */-->
<!--}-->

<!--.checkbox input[type="checkbox"] {-->
<!--    margin-right: 0.5rem;-->
<!--}-->

<!--</style>-->
