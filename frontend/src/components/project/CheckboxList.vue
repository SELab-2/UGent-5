<template>
    <v-card class="checkbox-list">
        <v-card-title>{{ title }}</v-card-title>
        <v-card-text class="description">{{ description }}</v-card-text>
        <v-list>
            <v-list-item v-for="item in items" :key="item.id">
                <v-checkbox
                    class="d-flex align-center"
                    :model-value="item.checked"
                    :label="item.label"
                    @change="handleCheckboxChange(item)"
                ></v-checkbox>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script setup lang="ts">
import { toRefs } from "vue";

export interface CheckBoxItem {
    id: string;
    label: string;
    checked: boolean;
}

const selectedItems = defineModel<CheckBoxItem[]>({
    required: true,
});

const props = defineProps<{
    items: CheckBoxItem[];
    title: string;
    description: string;
}>();

const { items } = toRefs(props);

function handleCheckboxChange(item: CheckBoxItem) {
    item.checked = !item.checked;
    const index = selectedItems.value.findIndex((i) => i.id === item.id);
    if (item.checked && index === -1) {
        selectedItems.value.push(item);
    } else if (!item.checked && index !== -1) {
        selectedItems.value.splice(index, 1);
    }
}
</script>
