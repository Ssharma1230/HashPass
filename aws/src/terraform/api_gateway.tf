resource "aws_apigatewayv2_api" "http_api" {
  name             = "HashPassAPI"
  protocol_type    = "HTTP"
  description      = "HTTP API Gateway for HashPass endpoints"
  fail_on_warnings = true

  cors_configuration {
    allow_origins     = ["*"]
    allow_methods     = ["OPTIONS", "POST"]
    allow_headers     = ["content-type", "authorization"]
    max_age           = 3600
    allow_credentials = false
  }
}

resource "aws_apigatewayv2_integration" "signup_integration" {
  api_id             = aws_apigatewayv2_api.http_api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.signup_lambda.invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_integration" "getSecurityQues_integration" {
  api_id             = aws_apigatewayv2_api.http_api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.getSecurityQues_lambda.invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_integration" "insertSecurityQues_integration" {
  api_id             = aws_apigatewayv2_api.http_api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.insertSecurityQues_lambda.invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_integration" "insertDomainName_integration" {
  api_id             = aws_apigatewayv2_api.http_api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.insertDomainName_lambda.invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_integration" "getUserInfo_integration" {
  api_id             = aws_apigatewayv2_api.http_api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.getUserInfo_lambda.invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_integration" "calchash_integration" {
  api_id             = aws_apigatewayv2_api.http_api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.calcHash_lambda.invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_integration" "getBlockedDomains_integration" {
  api_id             = aws_apigatewayv2_api.http_api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.getBlockedDomains_lambda.invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_integration" "insertBlockedDomain_integration" {
  api_id             = aws_apigatewayv2_api.http_api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.insertBlockedDomain_lambda.invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "signup" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /signup"
  target    = "integrations/${aws_apigatewayv2_integration.signup_integration.id}"
}

resource "aws_apigatewayv2_route" "getQuestions" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /getQuestions"
  target    = "integrations/${aws_apigatewayv2_integration.getSecurityQues_integration.id}"
}

resource "aws_apigatewayv2_route" "insertQuestions" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /insertQuestions"
  target    = "integrations/${aws_apigatewayv2_integration.insertSecurityQues_integration.id}"
}

resource "aws_apigatewayv2_route" "insertDomainName" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /insertDomainName"
  target    = "integrations/${aws_apigatewayv2_integration.insertDomainName_integration.id}"
}

resource "aws_apigatewayv2_route" "getUserInfo" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /getUserInfo"
  target    = "integrations/${aws_apigatewayv2_integration.getUserInfo_integration.id}"
}

resource "aws_apigatewayv2_route" "calculateHash" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /calcHash"
  target    = "integrations/${aws_apigatewayv2_integration.calchash_integration.id}"
}

resource "aws_apigatewayv2_route" "getBlockedDomains" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /getBlockedDomains"
  target    = "integrations/${aws_apigatewayv2_integration.getBlockedDomains_integration.id}"
}

resource "aws_apigatewayv2_route" "insertBlockedDomain" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /insertBlockedDomain"
  target    = "integrations/${aws_apigatewayv2_integration.insertBlockedDomain_integration.id}"
}

resource "aws_lambda_permission" "apigw-lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.signup_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:${aws_apigatewayv2_api.http_api.id}/*"
}

resource "aws_lambda_permission" "apigw-lambda_getQues" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.getSecurityQues_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:${aws_apigatewayv2_api.http_api.id}/*"
}

resource "aws_lambda_permission" "apigw-lambda_insertQues" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.insertSecurityQues_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:${aws_apigatewayv2_api.http_api.id}/*"
}

resource "aws_lambda_permission" "apigw-lambda_hash" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.calcHash_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:${aws_apigatewayv2_api.http_api.id}/*"
}

resource "aws_lambda_permission" "apigw-lambda_insertDomainName" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.insertDomainName_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:${aws_apigatewayv2_api.http_api.id}/*"
}

resource "aws_lambda_permission" "apigw-lambda_getUserInfo" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.getUserInfo_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:${aws_apigatewayv2_api.http_api.id}/*"
}

resource "aws_lambda_permission" "apigw-lambda_getBlockedDomains" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.getBlockedDomains_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:${aws_apigatewayv2_api.http_api.id}/*"
}

resource "aws_lambda_permission" "apigw-lambda_insertBlockedDomain" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.insertBlockedDomain_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:${aws_apigatewayv2_api.http_api.id}/*"
}

resource "aws_apigatewayv2_route" "generate_password" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /gen_pass"
  target    = "integrations/${aws_apigatewayv2_integration.genpass_integration.id}"
}

resource "aws_apigatewayv2_integration" "genpass_integration" {
  api_id             = aws_apigatewayv2_api.http_api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.gen_pass_lambda.invoke_arn
  integration_method = "POST"
}

resource "aws_lambda_permission" "apigw-lambda_passgen" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.gen_pass_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:${aws_apigatewayv2_api.http_api.id}/*"
}