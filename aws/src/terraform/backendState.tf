terraform {
  backend "s3" {
    bucket         = "terraform-state-bucket-343218205322"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-states-lock"
    encrypt        = true
  }
}