<template>
    <v-card class="checkbox-list">
        <v-card-title>{{ title }}</v-card-title>
        <v-list>
            <v-list-item v-for="item in items" :key="item.id">
                <v-checkbox
                    class="d-flex align-center"
                    :model-value="item.checked"
                    @change="handleCheckboxChange(item)"
                    :label="item.label"
                ></v-checkbox>
            </v-list-item>
        </v-list>
        <v-card-text class="description">{{ description }}</v-card-text>
    </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType, nextTick } from "vue";

interface CheckBoxItem {
    id: number;
    label: string;
    checked: boolean;
}

export default defineComponent({
    name: "CheckBox",
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
            default: "",
        },
    },
    methods: {
        handleCheckboxChange(item: CheckBoxItem) {
            item.checked = !item.checked;
            this.$nextTick().then(() => {
                this.$emit("update:items", this.items);
            });
        },
    },
});
</script>
