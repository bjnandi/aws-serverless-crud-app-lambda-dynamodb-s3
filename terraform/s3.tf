# S3 Bucket Resource
resource "aws_s3_bucket" "crud_app_s3" {
  bucket = var.s3_bucket_name

  tags = {
    Name        = "My App S3"
    Environment = var.environment
  }
  force_destroy = true
}

resource "aws_s3_bucket_website_configuration" "crud_app_website" {
  bucket = aws_s3_bucket.crud_app_s3.bucket

  index_document {
    suffix = "index.html"
  }

  # Optional: error document
  error_document {
    key = "error.html"
  }
}

# Optional: Disable Public Access Block settings
resource "aws_s3_bucket_public_access_block" "crud-app-s3-public-access" {
  bucket = aws_s3_bucket.crud_app_s3.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false

   depends_on = [aws_s3_bucket.crud_app_s3]
}

# S3 Bucket Policy Resource
resource "aws_s3_bucket_policy" "crud_app_bucket_policy" {
  bucket = aws_s3_bucket.crud_app_s3.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.crud_app_s3.arn}/*"
      }
    ]
  })
  depends_on = [aws_s3_bucket_public_access_block.crud-app-s3-public-access] # Explicit dependency
}

# Upload all files from the folder to S3
resource "aws_s3_object" "Static-Website-Upload" {

  bucket = aws_s3_bucket.crud_app_s3.bucket
  key    = "index.html"            # The key for the object in the S3 bucket
  source = "website/index.html" # Path to the file in the build folder
  content_type = "text/html"
}

# resource "aws_s3_object" "Static-Website-Upload" {
#   for_each = fileset("build", "**/*") # This will iterate over all files in the build folder
#   bucket = aws_s3_bucket.crud_app_s3.bucket
#   key    = each.value            # The key for the object in the S3 bucket
#   source = "./../frontend/build/${each.value}" # Path to the file in the build folder
#   # acl    = "public-read"  # Make the file publicly accessible
#   content_type = "text/html"
# }

resource "aws_s3_bucket" "lambda_bucket" {
  bucket = var.lambda_bucket_name

  tags = {
    Name        = "Lambda Function Bucket"
    Environment = var.environment
  }
}

resource "aws_s3_object" "lambda_zip" {
  bucket = aws_s3_bucket.lambda_bucket.id
  key    = "lambda.zip"
  source = var.lambda_zip_path # Use the variable for the local ZIP file path
}


resource "aws_s3_bucket" "crud_app_image" {
  bucket = var.crud_app_image_bucket

  tags = {
    Name        = "App Image Bucket"
    Environment = var.environment
  }
force_destroy = true
}
# Optional: Disable Public Access Block settings
resource "aws_s3_bucket_public_access_block" "crud_app_image_bucket_public_access" {
  bucket = aws_s3_bucket.crud_app_image.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false

   depends_on = [aws_s3_bucket.crud_app_image]
}

# Set the Bucket Policy to allow public access
resource "aws_s3_bucket_policy" "crud_app_image_bucket_policy" {
  bucket = aws_s3_bucket.crud_app_image.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid = "PublicReadGetObject"
        Effect = "Allow",
        Principal = "*",
        Action = "s3:GetObject",
        Resource = "${aws_s3_bucket.crud_app_image.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.crud_app_image_bucket_public_access]
}




