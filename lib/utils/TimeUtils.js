function formatLocalTime(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return 'unknown';
  }

  const pad = value => String(value).padStart(2, '0');
  const offsetMinutes = -date.getTimezoneOffset();
  const offsetSign = offsetMinutes >= 0 ? '+' : '-';
  const absOffsetMinutes = Math.abs(offsetMinutes);
  const offsetHours = pad(Math.floor(absOffsetMinutes / 60));
  const offsetRemainderMinutes = pad(absOffsetMinutes % 60);

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} GMT${offsetSign}${offsetHours}:${offsetRemainderMinutes}`;
}

function getSessionLoginTime(tokenJson) {
  if (!tokenJson) {
    return 'unknown';
  }

  if (typeof tokenJson.timestamp === 'number') {
    return formatLocalTime(tokenJson.timestamp);
  }

  return tokenJson.loggedInAt || 'unknown';
}

module.exports = {
  formatLocalTime,
  getSessionLoginTime
};
