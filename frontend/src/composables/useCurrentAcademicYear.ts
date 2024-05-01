import { computed } from "vue";
import { onMounted, ref } from "vue";

export default function useCurrentAcademicYear() {
    const currentAcademicYear = ref<number | null>(null);

    onMounted(() => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentDay = currentDate.getDay();

        // If the current month is September (index 8) or later, the academic year is the current year.
        // Otherwise, the academic year is the previous year.
        currentAcademicYear.value = currentMonth >= 8 ? currentYear + 1 : currentYear;
    });

    const isCurrentAcademicYear = computed(() => currentAcademicYear.value);

    return {isCurrentAcademicYear};
}
