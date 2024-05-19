export default function useAcademicYear(): number {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    // If the current date is before September 15, the default selected academic year is the current year.
    // Otherwise, the academic year is the next year.
    if (currentMonth < 8 || (currentMonth === 8 && currentDay < 15)) {
        return currentYear - 1 - 2000;
    } else {
        return currentYear - 2000;
    }
}
