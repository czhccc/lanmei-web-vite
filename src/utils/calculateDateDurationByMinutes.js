import dayjs from 'dayjs';

export default function calculateDateDurationByMinutes(startTime, endTime) {
    const totalMinutes = dayjs(endTime).diff(dayjs(startTime), 'minute');

    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    let result = '';
    if (days > 0) {
        result += `${days}天 `;
    }
    if (hours > 0 || days > 0) {
        result += `${hours}小时 `;
    }
    result += `${minutes}分钟`;

    return result.trim();
}
