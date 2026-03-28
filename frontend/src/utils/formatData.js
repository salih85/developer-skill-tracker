export const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US').format(value)
}

export const formatDate = (value) => {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}
