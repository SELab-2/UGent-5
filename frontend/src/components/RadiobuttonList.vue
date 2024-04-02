<template>
    <div class="radio-button-list">
        <div class="header">
            <input
                type="checkbox"
                id="toggle"
                v-model="isToggled"
                class="toggle-checkbox"
            >
            <label for="toggle" class="toggle-label">{{ title }}</label>
        </div>
        <div class="options" v-if="isToggled">
            <div v-for="option in options" :key="option.value" class="option">
                <input
                    type="radio"
                    :id="option.value"
                    :value="option.value"
                    v-model="selectedOption"
                    class="radio-button"
                    :disabled="!isToggled"
                >
                <label :for="option.value" class="radio-label">{{ option.label }}</label>
            </div>
            <DatePicker
                v-model="deadline"
                v-if="isToggled"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from 'vue';
import DatePicker from './DatePicker.vue';

interface RadioButtonOption {
    label: string;
    value: string;
}

export default defineComponent({
    name: 'RadioButtonList',
    components: {
        DatePicker
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
    emits: ['update:modelValue', 'update:deadline'],
    setup(props, { emit }) {
        const isToggled = ref(true);
        const selectedOption = ref(props.modelValue);
        const deadline = ref(new Date());

        watch(selectedOption, (newValue) => {
            emit('update:modelValue', newValue);
        });

        watch(deadline, (newValue) => {
            emit('update:deadline', newValue);
        });

        return {
            isToggled,
            selectedOption,
            deadline,
        };
    }
});
</script>


<style scoped>
.radio-button-list {
    font-family: 'Arial', sans-serif;
    color: #3e3e3e;
}

.header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
}

.toggle-checkbox {
    appearance: none;
    margin-right: 10px;
    cursor: pointer;
    width: 40px;
    height: 20px;
    background-color: #ccc;
    border-radius: 20px;
    position: relative;
    transition: background-color 0.3s;
}

.toggle-checkbox:checked {
    background-color: #3e3e3e;
}

.toggle-checkbox:checked::before {
    transform: translateX(20px);
}

.toggle-checkbox:before {
    content: "";
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 18px;
    top: 1px;
    left: 1px;
    background-color: white;
    transition: transform 0.3s;
}

.toggle-label {
    user-select: none;
    font-weight: bold;
}

.options {
    display: flex;
    flex-direction: column;
}

.option {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.radio-button {
    margin-right: 8px;
    accent-color: #000000; /* Change the color of the radio button */
}

.radio-label {
    font-size: 14px;
    user-select: none;
}

@media (max-width: 600px) {
    .radio-button-list {
        padding: 10px;
    }

    .option {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
