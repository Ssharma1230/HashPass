resource "aws_lambda_function" "signup_lambda" {
  filename      = "${path.cwd}/lambda1.zip"
  function_name = "signup_lambda"
  role          = aws_iam_role.iam_role2.arn
  handler       = "lambda1/index.handler"
  runtime       = "nodejs22.x"
}