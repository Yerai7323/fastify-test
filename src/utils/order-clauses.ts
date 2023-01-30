
export const orderByAndType = (orderBy: string, orderType: string): any => {
  const orderLevels = orderBy.split('.')
  console.log(orderLevels)

  let resp = '{ '
  let toAdd = ''
  // eslint-disable-next-line array-callback-return
  orderLevels.map((level, index) => {
    if (index === orderLevels.length - 1) {
      resp += `"${level}": "${orderType}"`
    } else {
      resp += `"${level}": { `
    }
    toAdd += ' }'
    console.log(resp)
  })

  const objectReturned = `${resp} ${toAdd}`

  console.log('-------------------')
  console.log(JSON.parse(objectReturned))
  console.log('-------------------')
  return JSON.parse(objectReturned)

  /* let resp = '{ '
  for (let i = 0; i < orderLevels.length; i++) {
    if (i === orderLevels.length - 1) {
      resp += `"${orderLevels[i]}": "${orderType}"`
    } else {
      resp += `"${orderLevels[i]}": { `
    }
    console.log(resp)
  }

  for (let i = 0; i < orderLevels.length; i++) {
    resp += ' }'
  }

  console.log('------------------')
  console.log(JSON.parse(resp))
  console.log('------------------')
 */

  // return JSON.parse(resp)
}
