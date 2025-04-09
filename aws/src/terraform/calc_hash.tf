resource "aws_lambda_function" "calc_hash_lambda" {
  filename      = "${path.cwd}/calcHash.zip"
  function_name = "calc_hash"
  role          = aws_iam_role.iam_role2.arn
  handler       = "calc_hash/index.handler"
  runtime       = "nodejs22.x"
  source_code_hash = filebase64sha256("${path.cwd}/calcHash.zip")
}