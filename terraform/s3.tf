provider "aws" {
  region = "us-east-1" # Specify the region
}

resource "aws_s3_bucket" "my_bucket" {
  bucket = "my-unique-bucket-name" # Replace with a unique bucket name

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD", "PUT", "POST", "DELETE"]
    allowed_origins = ["*"] # Adjust as necessary
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }

  versioning {
    enabled = true
  }

  tags = {
    Name = "My bucket"
  }
}
