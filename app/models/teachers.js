exports.findMany = (params) => {
  let teachers = require('../data/teachers/teachers.json')

  if (params.query?.length) {
    const query = params.query.toLowerCase()
    return teachers.filter(teacher =>
      teacher.trn?.toString().includes(query)
      || teacher.nationalInsuranceNumber?.toUpperCase().includes(query)
     )
  }

  return teachers
}

exports.findOne = (params) => {
  let teachers = require('../data/teachers/teachers.json')

  if (params.query?.length) {
    const query = params.query.toLowerCase()
    return teachers.find(teacher =>
      teacher.trn?.toString().includes(query)
      || teacher.nationalInsuranceNumber?.toUpperCase().includes(query)
     )
  } else {
    return null
  }
}
