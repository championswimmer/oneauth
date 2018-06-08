const AWS = require ('aws-sdk');
const config = require('../../config')
const Raven = require('raven')

const minioClient = new AWS.S3 ({
    accessKeyId: config.SECRETS.MINIO.ACCESS_KEY_ID ,
    secretAccessKey: config.SECRETS.MINIO.SECRET_ACCESS_KEY,
    endpoint: config.SECRETS.MINIO.ENDPOINT ,
    s3ForcePathStyle: true,
    signatureVersion: 'v4'
})

function deleteObject(bucket, key) {
    if (typeof bucket !== 'string') {
        throw new Error('bucket not a string')
    } else if (typeof bucket !== 'string') {
        throw new Error('key not a string')
    }
    minioClient.deleteObject({Bucket: bucket, Key: key},function (err, data) {
      if (err) {
        Raven.captureException(err)
        throw err;
      }
    })
}



module.exports = {
    minioClient,
    deleteObject
}
