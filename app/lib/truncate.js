export default function truncate(str, len) {
  if (!str) return ''
  if (!len || str.length < len) return str
  let result = str.substr(0, len)
  let lastSpace = result.lastIndexOf(' ')

  if (lastSpace !== -1) {
    if (result.charAt(lastSpace - 1) === '.' ||
        result.charAt(lastSpace - 1) === ',') {
      lastSpace -= 1
    }
    result = result.substr(0, lastSpace)
  }

  return result + '...'
}
