<template>
    <v-card class="radio-button-list">
        <v-switch
            v-model="isToggled"
            :label="title"
            class="header"
        ></v-switch>
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

        </v-container>
    </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from 'vue';
import DatePicker from './DatePicker.vue'; // Import your custom DatePicker component

interface RadioButtonOption {
    label: string;
    value: string;
}

export default defineComponent({
    name: 'RadioButtonList',
    components: {
        DatePicker // Register your custom DatePicker component
    },
    props: {
        title: {
            type: String,
            required: true
        },
        options: {
            type: Array as PropType<RadioButtonOption[]>,
            required: true
        },
        modelValue: {
            type: String,
            default: ''
        }
    },
    emits: ['update:modelValue', 'update:radio_date'],
    setup(props, { emit }) {
        const isToggled = ref(true);
        const selectedOption = ref(props.modelValue);
        const radio_date = ref(new Date());

        watch(selectedOption, (newValue) => {
            emit('update:modelValue', newValue);
        });

        // Listen for changes in the deadline from the DatePicker component
        watch(radio_date, (newValue) => {
            emit('update:radio_date', newValue);
        });

        return {
            isToggled,
            selectedOption,
            radio_date,
        };
    }
});
</script>

