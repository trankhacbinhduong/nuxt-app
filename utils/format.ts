export function formatDate(dateString: string) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const dayOfWeek = date.getDay()
  const dayOfWeekNames = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']
  return `${dayOfWeekNames[dayOfWeek]}, ${day} thg ${month}`
}
