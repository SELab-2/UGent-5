<template>
    <v-card class="radio-button-list">
        <v-switch v-model="isToggled" :label="title" class="header"></v-switch>
        <v-container v-if="isToggled">
            <v-radio-group v-model="selectedOption" column>
                <v-radio
                    v-for="option in options"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                ></v-radio>
            </v-radio-group>
            <DatePicker
                v-if="selectedOption === 'student'"
                v-model="radio_date"
                label="Group Selection Deadline"
            ></DatePicker>
            <!-- Numeric input for Capacity -->
            <v-text-field
                v-if="selectedOption === 'student' || selectedOption === 'random'"
                v-model="capacity"
                label="Capacity"
                type="number"
                min="1"
            ></v-text-field>
        </v-container>
    </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from "vue";
import DatePicker from "./DatePicker.vue"; // Import your custom DatePicker component

interface RadioButtonOption {
    label: string;
    value: string;
}

export default defineComponent({
    name: "RadioButtonList",
    components: {
        DatePicker, // Register your custom DatePicker component
    },
    props: {
        title: {
            type: String,
            required: true,
        },
        options: {
            type: Array as PropType<RadioButtonOption[]>,
            required: true,
        },
        modelValue: {
            type: String,
            default: "",
        },
    },
    emits: ["update:modelValue", "update:radio_date", "update:capacity"],
    setup(props, { emit }) {
        const isToggled = ref(true);
        const selectedOption = ref(props.modelValue);
        const radio_date = ref(new Date());
        const capacity = ref(1); // Default capacity

        watch(selectedOption, (newValue) => {
            emit("update:modelValue", newValue);
            if (newValue !== "student") {
                capacity.value = 1; // Reset capacity when 'student' is not selected
                emit("update:capacity", capacity.value);
            }
        });

        return {
            isToggled,
            selectedOption,
            radio_date,
            capacity,
        };
    },
});
</script>
