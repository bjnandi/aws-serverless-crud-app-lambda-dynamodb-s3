resource "aws_dynamodb_table" "example" {
  name         = var.dynamodb_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = var.dynamodb_hash_key

  attribute {
    name = var.dynamodb_hash_key
    type = "S"
  }

  tags = {
    Name        = "Example DynamoDB"
    Environment = var.environment
  }

}