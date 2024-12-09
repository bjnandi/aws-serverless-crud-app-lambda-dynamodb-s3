variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "environment" {
  description = "Environment (dev, prod, staging)"
  type        = string
}

variable "s3_bucket_name" {
  description = "Name of the S3 bucket"
  type        = string
}

variable "dynamodb_table_name" {
  description = "Name of the DynamoDB table"
  type        = string
}

variable "dynamodb_hash_key" {
  description = "Primary key for the DynamoDB table"
  type        = string
}

variable "crud_app_lambda_exec_role_name" {
  description = "Name of the IAM role for Lambda execution"
  type        = string
}

variable "lambda_policies" {
  description = "List of IAM policies to attach to the Lambda execution role"
  type        = list(string)
}


variable "lambda_bucket_name" {
  description = "The name of the S3 bucket for Lambda artifacts"
  type        = string
}

variable "lambda_zip_path" {
  description = "The path to the local Lambda ZIP file"
  type        = string
}

variable "lambda_function_name" {
  description = "The name of the Lambda function"
  type        = string
}

variable "lambda_runtime" {
  description = "The runtime environment for the Lambda function"
  type        = string
}

variable "lambda_handler" {
  description = "The handler for the Lambda function"
  type        = string
}


variable "api_name" {
  default = "MyHTTPApi"
}

variable "protocol_type_name" {
  description = "Name of the Protocol"
  type        = string
}

variable "crud_app_image_bucket" {
  description = "Name of the App Image Bucket"
  type        = string
}