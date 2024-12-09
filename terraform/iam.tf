# iam.tf

resource "aws_iam_role" "lambda_exec" {
  name = var.crud_app_lambda_exec_role_name # Use variable for role name
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "Lambda Execution Role"
    Environment = var.environment # Use variable for environment
  }
}

resource "aws_iam_role_policy_attachment" "lambda_policies" {
  for_each = toset(var.lambda_policies) # Use variable for list of policies

  role       = aws_iam_role.lambda_exec.name
  policy_arn = each.value
}
