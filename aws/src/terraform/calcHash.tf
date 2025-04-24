resource "aws_lambda_function" "calcHash_lambda" {
  filename         = "${path.cwd}/calcHash.zip"
  function_name    = "calcHash"
  role             = aws_iam_role.iam_role.arn
  handler          = "calcHash/index.handler"
  runtime          = "nodejs22.x"
  source_code_hash = filebase64sha256("${path.cwd}/calcHash.zip")
}