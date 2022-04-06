require('dotenv').config()
const S3 = require('aws-sdk/clients/s3')

const bucketname = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_BUCKET_ACCESSID
const secretAccessKey = process.env.AWS_BUCKET_ACESSKEY
const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})


function uploadFile(buffer, EMPLID){
    const uploadParams = {
        Bucket: bucketname,
        Body: buffer,
        Key: EMPLID
    }
    return s3.upload(uploadParams).promise()
}
exports.uploadFile = uploadFile