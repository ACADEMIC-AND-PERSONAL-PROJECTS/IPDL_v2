# --- Definition des variables ---

variable "postgres_db" {
  description = "Nom de la base de donnees"
  type = string
  default = "sensante_pro"
}

variable "postgres_user" {
  description = "Utilisateur PostgreSQL"
  type = string
  default = "sensante_user"
}

variable "postgres_password" {
  description = "Mot de passe PostgreSQL"
  type = string
  sensitive = true
}

variable "postgres_port" {
  description = "Port PostgreSQL d'ecoute expose sur l'hote"
  type = number
  default = 5433
}

variable "backend_port" {
  description = "Port d'ecoute du backend expose sur l'hote"
  type = number
  default = 8081
}

variable "jwt_secret" {
  description = "Cle secrete JWT"
  type = string
  sensitive = true
}

variable "anthropic_auth_token" {
  description = "Cle API DeepSeek"
  type = string
  sensitive = true
}