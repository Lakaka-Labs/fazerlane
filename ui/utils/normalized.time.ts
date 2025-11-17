export function normalizeTime(str: string) {
  const [mStr, sStr] = str.split(":");
  let totalSeconds = parseInt(mStr, 10) * 60 + parseInt(sStr, 10);

  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
