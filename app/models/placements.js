const path = require('path')
const fs = require('fs')
const { v4: uuid } = require('uuid')

const directoryPath = path.join(__dirname, '../data/dist/placements/')

exports.findMany = (params) => {
  // to prevent errors, check if directoryPath exists and if not, create
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath)
  }

  let placements = []

  let documents = fs.readdirSync(directoryPath, 'utf8')

  // Only get JSON documents
  documents = documents.filter(doc => doc.match(/.*\.(json)/ig))

  documents.forEach((filename) => {
    const raw = fs.readFileSync(directoryPath + '/' + filename)
    const data = JSON.parse(raw)
    placements.push(data)
  })

  if (params.organisationId) {
    placements = placements.filter(placement => placement.organisationId === params.organisationId)
  }

  if (params.subjectLevel) {
    placements = placements.filter(placement => placement.subjectLevel === params.subjectLevel)
  }

  if (params.subjects) {
    placements = placements.filter(placement => {
      return placement.subjects.some(subject => params.subjects.includes(subject))
    })
  }

  return placements
}

exports.findOne = (params) => {
  let placement = {}

  if (params.placementId) {
    const raw = fs.readFileSync(directoryPath + '/' + params.placementId + '.json')
    placement = JSON.parse(raw)
  }

  return placement
}

exports.insertOne = (params) => {
  const placement = {}

  if (params.organisationId) {
    placement.id = uuid()

    placement.organisationId = params.organisationId

    if (params.placement.subjectLevel) {
      placement.subjectLevel = params.placement.subjectLevel
    }

    if (params.placement.subjects) {
      placement.subjects = params.placement.subjects
    }

    if (params.placement.mentors) {
      placement.mentors = params.placement.mentors
    }

    if (params.placement.status) {
      placement.status = params.placement.status
    }

    placement.createdAt = new Date()

    const filePath = directoryPath + '/' + placement.id + '.json'

    // create a JSON sting for the submitted data
    const fileData = JSON.stringify(placement)

    // write the JSON data
    fs.writeFileSync(filePath, fileData)
  }

  return placement
}

exports.updateOne = (params) => {
  let placement = {}

  if (params.organisationId && params.placementId) {
    placement = this.findOne({
      organisationId: params.organisationId,
      placementId: params.placementId
    })

    if (params.placement.subjectLevel) {
      placement.subjectLevel = params.placement.subjectLevel
    }

    if (params.placement.subjects) {
      placement.subjects = params.placement.subjects
    }

    if (params.placement.mentors) {
      placement.mentors = params.placement.mentors
    }

    placement.updatedAt = new Date()

    const filePath = directoryPath + '/' + placement.id + '.json'

    // create a JSON sting for the submitted data
    const fileData = JSON.stringify(placement)

    // write the JSON data
    fs.writeFileSync(filePath, fileData)
  }

  return placement
}

exports.deleteOne = (params) => {
  if (params.organisationId && params.placementId) {
    const filePath = directoryPath + '/' + params.placementId + '.json'
    fs.unlinkSync(filePath)
  }
}
