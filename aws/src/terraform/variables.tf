variable "AWS_REGION" {
  default   = "us-east-1"
  type      = string
  sensitive = true
}

variable "AWS_ACCOUNT_ID" {
  default   = "343218205322"
  type      = string
  sensitive = true
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
}