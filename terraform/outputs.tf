# --- Valeur exposees apres apply ---

output "postgres_container_id" {
  description = "ID du conteneur PostgreSQL"
  value = docker_container.id
}

output "backend_url" {
  description = "URL du backend SenSante Pro"
  value = "http://localhost:${var.backend_port}"
}

output "infrastructure_info" {
  description = "Resume de l'infrastructure"
  value = {
    reseau =  docker_network.sensante_network.name
    postgres = docker_container.postgres.name
    backend = docker_container.backend.name
  }
}