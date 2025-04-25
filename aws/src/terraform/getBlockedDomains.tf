resource "aws_lambda_function" "getBlockedDomains_lambda" {
  filename         = "${path.cwd}/getBlockedDomains.zip"
  function_name    = "getBlockedDomains"
  role             = aws_iam_role.iam_role.arn
  handler          = "getBlockedDomains/index.handler"
  runtime          = "nodejs22.x"
  timeout          = 29
  source_code_hash = filebase64sha256("${path.cwd}/getBlockedDomains.zip")

  vpc_config {
    subnet_ids         = ["subnet-08f7876b20ec2648d"]
    security_group_ids = ["sg-097af9b3d4b9cc7a3"]
  }

  environment {
    variables = {
      DB_HOST = var.db_host
      DB_USER = var.db_user
      DB_PASS = var.db_pass
      DB_NAME = var.db_name
    }
  }
}