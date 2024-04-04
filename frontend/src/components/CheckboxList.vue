<template>
    <div class="checkbox-list">
        <h2>{{ title }}</h2>
        <ul>
            <li v-for="item in items" :key="item.id" class="checkbox-item">
                <span class="checkbox">
                    <input type="checkbox" :id="`checkbox-${item.id}`" v-model="item.checked" />
                    <label :for="`checkbox-${item.id}`" class="teacher-name">{{ item.label }}</label>
                </span>
            </li>
        </ul>
        <p class="description">{{ description }}</p>
    </div>
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

<style scoped>
.checkbox-list {
    /* Adjusted styles for better layout without the status indicators */
    display: block;
}

.checkbox-item {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem; /* Adjust spacing between items */
}

.checkbox input[type="checkbox"] {
    margin-right: 0.5rem;
}

</style>
