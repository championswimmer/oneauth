const Multer = require ('multer'),
    MulterS3 = require ('multer-s3'),
    Minio = require ('./minio')
;

const upload = Multer ({
    storage: MulterS3 ({
        s3: Minio.minioClient,
        bucket: 'oneauth-assets',
        contentType: MulterS3.AUTO_CONTENT_TYPE,
        key: function (request, file, callback) {

            let srvFileName = 'user' + request.user.id + "_" + Date.now() + '.' + file.originalname.split('.').pop()
            callback (null, srvFileName)
        }
    }),
    limits: {
        fileSize: 2000000
    }
})

function deleteMinio(key) {
    Minio.deleteObject('oneauth-assets', key)
}

module.exports = {
    upload,
    deleteMinio
}
