resource "aws_lambda_function" "signup_lambda" {
  filename         = "${path.cwd}/signup.zip"
  function_name    = "signup"
  role             = aws_iam_role.iam_role.arn
  handler          = "signup/index.handler"
  runtime          = "nodejs22.x"
  source_code_hash = filebase64sha256("${path.cwd}/signup.zip")
}