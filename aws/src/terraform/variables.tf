variable "release_version" {
    default = "0.1.0"
    type    = string
}

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

variable "db_host" {
  type = string
}

variable "db_user" {
  type = string
}

variable "db_pass" {
  type      = string
  sensitive = true
}

variable "db_name" {
  type = string
}