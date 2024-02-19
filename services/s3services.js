const { S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
const { fromIni } = require('@aws-sdk/credential-provider-ini');


exports.uploadToS3 = async (bucketName, file, key) => {
    // Specify your AWS region
    const region = 'eu-north-1'; // Replace with your actual AWS region

    const credentials = {
        accessKeyId: process.env.IAM_USER_KEY,
        secretAccessKey: process.env.IAM_USER_SECRET, 
    };

    // Create an S3 client
    const s3Client = new S3Client({
        region: region,
        credentials: credentials,
    });

    try {

        

        // Create a PutObjectCommand
        const params = {
            Bucket: bucketName,
            Key: key,
            Body: file,
            ACL: 'public-read'
        };
        const command = new PutObjectCommand(params);


        // Execute the command
        const result = await s3Client.send(command);
        
        // const objectUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key.replace(/ /g, '+')}`;
        // const encodedKey = encodeURIComponent(key);
        // const objectUrl = `https://${bucketName}.s3.${region}.amazonaws.com/Expense1/${encodedKey}`;
        const objectUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
        return objectUrl
    } catch (err) {
        console.error('Error uploading file to S3:', err);
    }
}