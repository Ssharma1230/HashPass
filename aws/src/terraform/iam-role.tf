data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = [
      "sts:AssumeRole"
    ]
  }
}

resource "aws_iam_role" "iam_role" {
  name               = "iam_role_for_lambda"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}