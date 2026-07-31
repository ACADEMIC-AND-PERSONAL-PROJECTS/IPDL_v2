# --- Infrastructure SenSante Pro avec Terraform ---

terraform {
  required_version = ">= 1.5"
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

# === Reseau Docker ===
resource "docker_network" "sensante_network" {
  name = "sensante-tf-network"
  driver = "bridge"
}

# === Volume Postgres ===
resource "docker_volume" "postgres_data" {
  name = "sensante-tf-postgres-data"
}

# === Image PostgreSQL ===
resource "docker_image" "postgres" {
  name = "postgres:15-alpine"
  keep_locally = true
}

# === Conteneur PostgreSQL ===
resource "docker_container" "postgres" {
  name  = "sensante-tf-postgres"
  image = docker_image.postgres.image_id

  env = [
    "POSTGRES_DB=${var.postgres_db}",
    "POSTGRES_USER=${var.postgres_user}",
    "POSTGRES_PASSWORD=${var.postgres_password}",
  ]

  networks_advanced {
    name = docker_network.sensante_network.name
  }

  volumes {
    volume_name = docker_volume.postgres_data.name
    container_path = "/var/lib/postgresql/data"
  }

  ports {
    internal = 5432
    external = var.postgres_port
  }

  healthcheck {
    test = ["CMD -SHELL", "pg_isready -U ${var.postgres_user } -d ${var.postgres_db }"]
    interval = "10s"
    timeout = "5s"
    retries = 5
  }

  restart = "unless-stopped"

}

# === Image Backend ===

resource "docker_image" "backend" {
  name = "sensante-backend-tf:latest"
  build {
    context = "${path.module}/../"
    dockerfile = "Dockerfile"
  }

  triggers = {
    dir_sha1 = sha1(join("" , [
        for f in fileset("${path.module}/../src", "**")
        : filesha1("${path.module}/../src/${f}")
    ]))
  }
}

# === Conteneur Backend ===
resource "docker_container" "backend" {
  name  = "sensante-tf-backend"
  image = docker_image.backend.image_id

  env = [
    "SPRING_DATASOURCE_URL=jdbc:postgresql://sensante-tf-postgres:5432/${var.postgres_db}",
    "SPRING_DATASOURCE_USERNAME=${var.postgres_user}",
    "SPRING_DATASOURCE_PASSWORD=${var.postgres_password}",
    "JWT_SECRET=${var.jwt_secret}",
    "ANTHROPIC_AUTH_TOKEN=${var.anthropic_auth_token}",
    "SPRING_PROFILES_ACTIVE=prod",
  ]

  networks_advanced {
    name = docker_network.sensante_network.name
  }

  ports {
    internal = 8080
    external = var.backend_port
  }

  depends_on = [docker_container.postgres]
  restart = "unless-stopped"

}