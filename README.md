# aws-serverless-crud-app-lambda-dynamodb-s3
AWS Serverless CRUD App Lambda DynamoDB S3

# Clone Git Repository
```
git clone https://github.com/bjnandi/aws-serverless-crud-app-lambda-dynamodb-s3.git
```

# Frontend
1. Install Package

```
npm install
```
2. Build Package
```
npm run build
```
3. Upload Build Directory to S3 Bucket
```
aws s3 cp frontend/build/ s3://my-react-app-123/ --recursive
```
