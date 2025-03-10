output "api_gaateway_url" {
  value = aws_apigatewayv2_api.http_api.api_endpoint
}