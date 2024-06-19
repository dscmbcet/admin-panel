export default function getDateString (timestampStart: string, timestampEnd: string) {
    const startDate = new Date(Number(timestampStart));
    const endDate = new Date(Number(timestampEnd));

    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const startDay = startDate.getDate();
    const startHours = startDate.getHours();
    const startMinutes = startDate.getMinutes();

    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();
    const endDay = endDate.getDate();
    const endHours = endDate.getHours();
    const endMinutes = endDate.getMinutes();

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const formatTime = (
      hours: number,
      minutes: number,
      omitPeriod: boolean = false
    ) => {
      const period = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${formattedHours}:${formattedMinutes}${
        omitPeriod ? "" : ` ${period}`
      }`;
    };

    if (
      startYear === endYear &&
      startMonth === endMonth &&
      startDay === endDay &&
      startHours === endHours &&
      startMinutes === endMinutes
    ) {
      // Same day and time
      return `${
        monthNames[startMonth]
      } ${startDay}, ${startYear} at ${formatTime(startHours, startMinutes)}`;
    } else if (
      startYear === endYear &&
      startMonth === endMonth &&
      startDay === endDay
    ) {
      // Same day, different times

      //Same Period
      if (
        (startHours >= 12 && endHours >= 12) ||
        (startHours < 12 && endHours < 12)
      )
        return `${
          monthNames[startMonth]
        } ${startDay}, ${startYear} at ${formatTime(
          startHours,
          startMinutes,
          true
        )} - ${formatTime(endHours, endMinutes)}`;
      // Different Periods
      else
        return `${
          monthNames[startMonth]
        } ${startDay}, ${startYear} from ${formatTime(
          startHours,
          startMinutes
        )} - ${formatTime(endHours, endMinutes)}`;
    } else if (startYear === endYear && startMonth === endMonth) {
      // Same month, different days
      return `${monthNames[startMonth]} ${startDay} at ${formatTime(
        startHours,
        startMinutes
      )} - ${endDay} at ${formatTime(endHours, endMinutes)}, ${startYear}`;
    } else if (startYear === endYear) {
      // Same year, different months
      return `${monthNames[startMonth]} ${startDay} at ${formatTime(
        startHours,
        startMinutes
      )}, ${startYear} - ${monthNames[endMonth]} ${endDay} at ${formatTime(
        endHours,
        endMinutes
      )}, ${endYear}`;
    } else {
      // Different years
      return `${monthNames[startMonth]} ${startDay} at ${formatTime(
        startHours,
        startMinutes
      )}, ${startYear} - ${monthNames[endMonth]} ${endDay} at ${formatTime(
        endHours,
        endMinutes
      )}, ${endYear}`;
    }
  };