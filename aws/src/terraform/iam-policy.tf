resource "aws_iam_role_policy" "iam-policy" {
  name   = "cloudwatch-policy"
  role   = aws_iam_role.iam_role2.id
  policy = file("${path.module}/iam-policy.json")

  depends_on = [aws_iam_role.iam_role]
}

resource "aws_iam_role_policy" "iam-policy2" {
  name   = "LambdaVPCAccess"
  role   = aws_iam_role.iam_role.id
  policy = file("${path.module}/iam-policy2.json")

  depends_on = [aws_iam_role.iam_role]
}