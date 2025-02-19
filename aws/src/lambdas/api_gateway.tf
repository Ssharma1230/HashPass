import {
  to = aws_apigatewayv2_api.example
  id = "aabbccddee"
}

data "aws_apigatewayv2_apis" "example" {
  protocol_type = "HTTP"
}