resource "aws_db_instance" "RDS" {
  allocated_storage       = 8
  db_name                 = "UserInfo"
  engine                  = "mysql"
  engine_version          = "8.4"
  instance_class          = "db.t3.micro"
  storage_type            = "gp2"
  publicly_accessible     = false
  backup_retention_period = 7
  username                = "admin"
  password = var.db_password
}