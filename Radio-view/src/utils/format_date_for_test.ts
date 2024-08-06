export default function formatDate(date: number) {
  let d = new Date(date);
  let year = d.getFullYear();
  let month = (d.getMonth() + 1).toString().padStart(2, "0"); // Months start from 0
  let day = d.getDate().toString().padStart(2, "0");

  let hour = d.getHours();
  let meridian = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  hour = hour ? hour : 12; // Convert hour '0' to '12'

  let formattedMinutes = d.getMinutes().toString().padStart(2, "0");
  let formattedSeconds = d.getSeconds().toString().padStart(2, "0");
  let formattedHour = hour.toString().padStart(2, "0");

  return `${year}-${month}-${day} ${formattedHour}:${formattedMinutes}:${formattedSeconds} ${meridian}`;
}
