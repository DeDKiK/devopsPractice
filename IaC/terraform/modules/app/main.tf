resource "kubernetes_namespace" "app" {
  metadata {
    name = "devops-practice"
  }
}


# ==================== BACKEND ====================
resource "kubernetes_deployment" "backend" {
  metadata {
    name      = "backend"
    namespace = "devops-practice"
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "devopspractice-backend"
      }
    }

    template {
      metadata {
        labels = {
          app = "devopspractice-backend"
        }
      }

      spec {
        container {
          image = "ghcr.io/dedkik/devopspractice-backend:latest"
          name  = "backend"

          port {
            container_port = 3000
          }

          # Probes
          liveness_probe {
            http_get {
              path = "/health"
              port = 3000
            }
            initial_delay_seconds = 45
            period_seconds        = 10
            timeout_seconds       = 5
            failure_threshold     = 3
          }

          readiness_probe {
            http_get {
              path = "/health"
              port = 3000
            }
            initial_delay_seconds = 25
            period_seconds        = 5
            timeout_seconds       = 3
            failure_threshold     = 3
          }

          resources {
            requests = { cpu = "150m", memory = "200Mi" }
            limits   = { cpu = "500m", memory = "600Mi" }
          }

          env {
            name  = "MONGO_URL"
            value = "mongodb://mongo:27017/test"  
          }

          env {
            name  = "NODE_ENV"
            value = "production"
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "backend" {
  metadata {
    name      = "backend"
    namespace = "devops-practice"
  }

  spec {
    selector = {
      app = "devopspractice-backend"
    }
    port {
      port        = 3000
      target_port = 3000
    }
    type = "ClusterIP"
  }
}

# ==================== FRONTEND ====================
resource "kubernetes_deployment" "frontend" {
  metadata {
    name      = "frontend"
    namespace = "devops-practice"
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "devopspractice-frontend"
      }
    }

    template {
      metadata {
        labels = {
          app = "devopspractice-frontend"
        }
      }

      spec {
        container {
          image = "ghcr.io/dedkik/devopspractice-frontend:latest"
          name  = "frontend"

          port {
            container_port = 80
          }

          resources {
            requests = { cpu = "50m", memory = "64Mi" }
            limits   = { cpu = "300m", memory = "256Mi" }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "frontend" {
  metadata {
    name      = "frontend"
    namespace = "devops-practice"
  }

  spec {
    selector = {
      app = "devopspractice-frontend"
    }
    port {
      port        = 80
      target_port = 80
    }
    type = "ClusterIP"
  }
}

# ==================== MONGODB ====================
resource "kubernetes_deployment" "mongo" {
  metadata {
    name      = "mongo"
    namespace = "devops-practice"
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "mongo"
      }
    }

    template {
      metadata {
        labels = {
          app = "mongo"
        }
      }

      spec {
        container {
          image = "mongo:7.0"
          name  = "mongo"

          port {
            container_port = 27017
          }

          resources {
            requests = { cpu = "200m", memory = "256Mi" }
            limits   = { cpu = "500m", memory = "512Mi" }
          }

          # Readiness для MongoDB
          readiness_probe {
            tcp_socket {
              port = 27017
            }
            initial_delay_seconds = 10
            period_seconds        = 5
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "mongo" {
  metadata {
    name      = "mongo"
    namespace = "devops-practice"
  }

  spec {
    selector = {
      app = "mongo"
    }
    port {
      port        = 27017
      target_port = 27017
    }
    type = "ClusterIP"
  }
}

# ==================== INGRESS ====================
resource "kubernetes_ingress_v1" "app" {
  metadata {
    name      = "app-ingress"
    namespace = "devops-practice"
    annotations = {
      # "nginx.ingress.kubernetes.io/rewrite-target" = "/"
      "nginx.ingress.kubernetes.io/use-regex"      = "true"
      "nginx.ingress.kubernetes.io/proxy-body-size" = "10m"
    }
  }

  spec {
    ingress_class_name = "nginx"

    rule {
      http {
        # API routes first (більш конкретний шлях)
        path {
          path      = "/api"
          path_type = "Prefix"
          backend {
            service {
              name = "backend"
              port { number = 3000 }
            }
          }
        }

        # Frontend
        path {
          path      = "/"
          path_type = "Prefix"
          backend {
            service {
              name = "frontend"
              port { number = 80 }
            }
          }
        }
      }
    }
  }
}