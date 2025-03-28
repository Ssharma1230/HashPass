resource "aws_lambda_function" "login_lambda" {
  filename         = "${path.cwd}/login.zip"
  function_name    = "login"
  role             = aws_iam_role.iam_role.arn
  handler          = "login/index.handler"
  runtime          = "nodejs22.x"
  source_code_hash = filebase64sha256("${path.cwd}/login.zip")
}