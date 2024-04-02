<template>
    <div class="date-picker-container">
        <input
            type="text"
            readonly
            class="date-input"
            @click="toggleDatePicker"
            :value="formattedDate"
        />
        <div v-if="showDatePicker" class="date-picker-popup">
            <div class="date-picker-header">
                <button @click="changeMonth(-1)">&lt;</button>
                <span>{{ currentMonthYear }}</span>
                <button @click="changeMonth(1)">&gt;</button>
            </div>
            <div class="date-picker-grid">
                <div
                    class="date-picker-day"
                    v-for="day in daysOfMonth"
                    :key="day.dateString"
                    @click="selectDate(day.date)"
                    :class="{ 'selected': isSelected(day.date) }"
                >
                    {{ day.dayOfMonth }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
    name: 'DatePicker',
    props: {
        modelValue: {
            type: Date,
            default: () => new Date()
        }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const showDatePicker = ref(false);
        const selectedDate = ref(props.modelValue);

        const currentMonth = ref(new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth()));

        const currentMonthYear = computed(() => {
            return currentMonth.value.toLocaleString('default', { month: 'long', year: 'numeric' });
        });

        const daysOfMonth = computed(() => {
            const year = currentMonth.value.getFullYear();
            const month = currentMonth.value.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            let daysArray = [];
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                daysArray.push({ dayOfMonth: day, dateString: date.toDateString(), date });
            }
            return daysArray;
        });

        const formattedDate = computed(() => {
            return selectedDate.value.toLocaleDateString();
        });

        function toggleDatePicker() {
            showDatePicker.value = !showDatePicker.value;
        }

        function selectDate(date) {
            selectedDate.value = date;
            emit('update:modelValue', date);
            showDatePicker.value = false;
        }

        function changeMonth(monthIncrement) {
            const newMonth = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + monthIncrement, 1);
            currentMonth.value = newMonth;
        }

        function isSelected(date) {
            return selectedDate.value.toDateString() === date.toDateString();
        }

        return {
            showDatePicker,
            currentMonthYear,
            daysOfMonth,
            formattedDate,
            toggleDatePicker,
            selectDate,
            changeMonth,
            isSelected
        };
    }
});
</script>

<style scoped>
.date-picker-container {
    position: relative;
}

.date-input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
}

.date-picker-popup {
    position: absolute;
    background-color: #000000;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    z-index: 100;
}

.date-picker-header {
    text-align: center;
    margin-bottom: 10px;
}

.date-picker-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
}

.date-picker-day {
    padding: 5px;
    text-align: center;
    background-color: #000000;
    border-radius: 4px;
    cursor: pointer;
}

.date-picker-day:hover, .date-picker-day.selected {
    background-color: #408000;
}

/* Additional styling */
</style>

