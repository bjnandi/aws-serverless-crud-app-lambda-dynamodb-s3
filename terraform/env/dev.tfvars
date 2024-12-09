aws_region               = "us-east-1"
environment              = "dev"
s3_bucket_name           = "my-react-app-12345"
crud_app_image_bucket    = "crud-app-image-12345"
dynamodb_table_name      = "crud-dynamodb-table"
dynamodb_hash_key        = "id"

crud_app_lambda_exec_role_name = "curd_app_lambda_exec_role"
lambda_policies = [
  "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
  "arn:aws:iam::aws:policy/AmazonS3FullAccess",
  "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
]

lambda_bucket_name    = "lambda-artifact-12345"
lambda_zip_path       = "../backend/lambda.zip"  # Path to your local zip file
lambda_function_name  = "crud-app-lambda"
lambda_runtime        = "nodejs22.x"
lambda_handler        = "lambda.handler"

api_name              = "MyHTTPApi"
protocol_type_name    = "HTTP"


