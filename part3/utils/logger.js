const info = (...params) => {
  if( process.env.NODE_ENV === 'test') {
    console.log(...params)
  }
}

const warn = (...params) => {
  if( process.env.NODE_ENV === 'test') {
    console.log(...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV === 'test') {
    console.error(...params)
  }
}

// const info = (...params) => {
//   if( process.env.NODE_ENV !== 'test') {
//     console.log(...params)
//   }
// }

// const warn = (...params) => {
//   if( process.env.NODE_ENV !== 'test') {
//     console.log(...params)
//   }
// }

// const error = (...params) => {
//   if (process.env.NODE_ENV !== 'test') {
//     console.error(...params)
//   }
// }

module.exports = { info, warn, error }