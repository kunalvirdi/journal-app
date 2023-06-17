const {S3Client,PutObjectCommand,HeadObjectCommand,DeleteObjectCommand}=require('@aws-sdk/client-s3');
require('dotenv').config()

const s3Client=new S3Client({
    region:process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
    }
})

const uploadFileToS3=async (file,userId)=>{
    const params={
        Bucket:process.env.AWS_BUCKET,
        Key:`${userId+'-'+file.originalname}`,
        Body:file.buffer
    };
    const command= new PutObjectCommand(params);
    return await s3Client.send(command)
}



const deleteFileFromS3=async (key)=>{
    const params={
        Bucket: process.env.AWS_BUCKET,
        Key:key
    }
    const command=new DeleteObjectCommand(params);
    return await s3Client.send(command);

}

module.exports={
    deleteFileFromS3,
    uploadFileToS3
}