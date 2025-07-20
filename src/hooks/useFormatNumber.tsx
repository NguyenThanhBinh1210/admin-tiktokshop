export const FormatNumber = (amount: number) => {
  return (
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })
      .format(amount)
      .replace(/\$/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '$'
  )
}

export const FormatNumberK = (number: number) => {
  const newNumber = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 2 })
    .format(number)
    .replace('.', ',')
  return newNumber
}

export const removeSpecialCharacter = (str: string) =>
  // eslint-disable-next-line no-useless-escape
  str?.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '')

export const slugVietnamese = function (str: string) {
  str = str.replace(/^\s+|\s+$/g, '')
  str = str.toLowerCase()

  const from = 'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ·/_,:;'
  const to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd------'
  for (let i = 0; i < from.length; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  str = str
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  return str
}
export const generateNameId = ({ name, id }: { name: string; id: string }) => {
  return slugVietnamese(name)?.replace(/\s/g, '-') + `-i,${id}`
}

export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split('-i,')
  return arr[arr.length - 1]
}
