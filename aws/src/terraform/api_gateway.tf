resource "aws_apigatewayv2_api" "http_api" {
  name             = "HashPassAPI"
  protocol_type    = "HTTP"
  description      = "HTTP API Gateway for HashPass endpoints"
  fail_on_warnings = true
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

resource "aws_apigatewayv2_route" "signup" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /user/signup"
  target    = "integrations/${aws_apigatewayv2_integration.signup_integration.id}"
}

resource "aws_apigatewayv2_route" "getQuestions" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /user/getQuestions"
  target    = "integrations/${aws_apigatewayv2_integration.getSecurityQues_integration.id}"
}

resource "aws_apigatewayv2_route" "insertQuestions" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /user/insertQuestions"
  target    = "integrations/${aws_apigatewayv2_integration.insertSecurityQues_integration.id}"
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
  principal = "apigateway.amazonaws.com"
  source_arn = "arn:aws:execute-api:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:${aws_apigatewayv2_api.http_api.id}/*"
}

resource "aws_apigatewayv2_route" "user_logout" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /user/logout"
}

resource "aws_apigatewayv2_route" "user_update" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /user/update"
}

resource "aws_apigatewayv2_route" "user_delete" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /user/delete"
}

resource "aws_apigatewayv2_route" "hash_addpass" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /hash/addpass"
}

resource "aws_apigatewayv2_route" "hash_getpass" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /hash/getpass"
}

resource "aws_apigatewayv2_route" "hash_updatepass" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /hash/updatepass"
}

resource "aws_apigatewayv2_route" "hash_deletepass" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /hash/deletepass"
}

resource "aws_apigatewayv2_route" "calculate_hash" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /hash/calc_hash"
  target    = "integrations/${aws_apigatewayv2_integration.calchash_integration.id}"
}

resource "aws_apigatewayv2_integration" "calchash_integration" {
  api_id             = aws_apigatewayv2_api.http_api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.calc_hash_lambda.invoke_arn
  integration_method = "POST"
}


resource "aws_lambda_permission" "apigw-lambda_hash" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.calc_hash_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:${aws_apigatewayv2_api.http_api.id}/*"
}