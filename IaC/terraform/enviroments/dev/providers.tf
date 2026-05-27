terraform {
  required_version = ">= 1.7.0"

  required_providers {
    minikube = {
      source  = "scott-the-programmer/minikube"
      version = "~> 0.6"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
    time = {
      source  = "hashicorp/time"
      version = "~> 0.12"
    }
  }
}

provider "minikube" {
  kubernetes_version = "v1.30.0"
}

provider "kubernetes" {
  host                   = minikube_cluster.devopspractice.host
  client_certificate     = minikube_cluster.devopspractice.client_certificate
  client_key             = minikube_cluster.devopspractice.client_key
  cluster_ca_certificate = minikube_cluster.devopspractice.cluster_ca_certificate
}

provider "time" {}