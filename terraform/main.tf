terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.0"
    }
  }
  required_version = ">= 1.3.0"
}

provider "aws" {
  region = var.aws_region
}

# # Include other files
# module "s3" {
#   source = "./s3.tf"
# }
data "aws_caller_identity" "current" {}


module "api_gateway" {
  source  = "terraform-aws-modules/apigateway-v2/aws"
  version = "5.2.1"

  name               = var.api_name
  protocol_type      = var.protocol_type_name
  create_domain_name = false

  cors_configuration = {
    allow_headers = ["content-type", "x-amz-date", "authorization", "x-api-key", "x-amz-security-token", "x-amz-user-agent"]
    allow_methods = ["*"]
    allow_origins = ["*"]
  }

  # Routes & Integration(s)
  routes = {
    "GET /" = {
      integration = {
        type = "AWS_PROXY"
        uri  = aws_lambda_function.curd-app-lambda.arn
      }
    }

    "GET /name" = {
      integration = {
        type = "AWS_PROXY"
        uri  = aws_lambda_function.curd-app-lambda.arn
      }
    }

    "GET /user/{id}" = {
      integration = {
        type = "AWS_PROXY"
        uri  = aws_lambda_function.curd-app-lambda.arn
      }
    }

    "POST /user" = {
      integration = {
        type = "AWS_PROXY"
        uri  = aws_lambda_function.curd-app-lambda.arn
      }
    }

    "PUT /user/{id}" = {
      integration = {
        type = "AWS_PROXY"
        uri  = aws_lambda_function.curd-app-lambda.arn
      }
    }

    "DELETE /user/{id}" = {
      integration = {
        type = "AWS_PROXY"
        uri  = aws_lambda_function.curd-app-lambda.arn
      }
    }


  }


}
resource "aws_lambda_permission" "allow_api_gateway" {
  statement_id  = "AllowApiGatewayInvoke"
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  function_name = "crud-app-lambda"
  source_arn    = "arn:aws:execute-api:us-east-1:${data.aws_caller_identity.current.account_id}:${module.api_gateway.api_id}/*/*/*"
}
