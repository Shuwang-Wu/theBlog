var iteration = Math.ceil(values.length / 8)
var startAt = values.length % 8
var i = 0

do {
  switch (startAt) {
    case 0:
      process(values[i++])
    case 7:
      process(values[i++])
    case 6:
      process(values[i++])
    case 5:
      process(values[i++])
    case 4:
      process(values[i++])
    case 3:
      process(values[i++])
    case 2:
      process(values[i++])
    case 1:
      process(values[i++])
  }
} while (--iteration > 0)
