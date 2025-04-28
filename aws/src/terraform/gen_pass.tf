resource "aws_lambda_function" "gen_pass_lambda" {
  filename         = "${path.cwd}/genPass.zip"
  function_name    = "gen_password"
  role             = aws_iam_role.iam_role.arn
  handler          = "gen_password/index.handler"
  runtime          = "nodejs22.x"
  source_code_hash = filebase64sha256("${path.cwd}/genPass.zip")

  environment {
    variables = {
      DB_HOST = var.db_host
      DB_USER = var.db_user
      DB_PASS = var.db_pass
      DB_NAME = var.db_name
    }
  }
}