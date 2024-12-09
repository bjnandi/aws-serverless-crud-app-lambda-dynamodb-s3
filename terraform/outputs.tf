# Static website output
output "s3_website_endpoint" {
  value = aws_s3_bucket_website_configuration.crud_app_website.website_endpoint
}

# Output the API Gateway endpoint
output "api_gateway_endpoint" {
  value = module.api_gateway.api_endpoint
}
