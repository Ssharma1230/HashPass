resource "aws_lambda_function" "getSecurityQues_lambda" {
  filename         = "${path.cwd}/getSecurityQues.zip"
  function_name    = "getSecurityQues"
  role             = aws_iam_role.iam_role.arn
  handler          = "getSecurityQues/index.handler"
  runtime          = "nodejs22.x"
  source_code_hash = filebase64sha256("${path.cwd}/getSecurityQues.zip")
}