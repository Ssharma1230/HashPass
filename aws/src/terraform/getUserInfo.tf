resource "aws_lambda_function" "getUserInfo_lambda" {
  filename         = "${path.cwd}/getUserInfo.zip"
  function_name    = "getUserInfo"
  role             = aws_iam_role.iam_role.arn
  handler          = "getUserInfo/index.handler"
  runtime          = "nodejs22.x"
  source_code_hash = filebase64sha256("${path.cwd}/getUserInfo.zip")

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