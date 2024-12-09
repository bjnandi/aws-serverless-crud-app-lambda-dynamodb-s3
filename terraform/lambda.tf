resource "aws_lambda_function" "curd-app-lambda" {

  function_name = var.lambda_function_name # Use the variable for Lambda function name
  runtime       = var.lambda_runtime       # Use the variable for Lambda runtime
  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/${var.crud_app_lambda_exec_role_name}"
  handler       = var.lambda_handler # Use the variable for Lambda handler

  s3_bucket = aws_s3_bucket.lambda_bucket.bucket
  s3_key    = aws_s3_object.lambda_zip.key

  environment {
    variables = {
      ENV = var.environment # Use the variable for the environment
    }
  }

  tags = {
    Name        = "Example Lambda Function from S3"
    Environment = var.environment
  }
}
