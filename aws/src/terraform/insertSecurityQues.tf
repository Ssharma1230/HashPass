resource "aws_lambda_function" "insertSecurityQues_lambda" {
  filename         = "${path.cwd}/insertSecurityQues.zip"
  function_name    = "insertSecurityQues"
  role             = aws_iam_role.iam_role.arn
  handler          = "insertSecurityQues/index.handler"
  runtime          = "nodejs22.x"
  source_code_hash = filebase64sha256("${path.cwd}/insertSecurityQues.zip")
}