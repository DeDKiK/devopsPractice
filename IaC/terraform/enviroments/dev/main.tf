resource "minikube_cluster" "devopspractice" {
  cluster_name  = "devopspractice"
  driver        = "docker"
  cpus          = 4
  memory        = "8192mb"
  disk_size     = "30g"
  
  # Використовуємо саме apiserver_ips для локального обходу бага certSANs
  apiserver_ips = ["127.0.0.1"]

  addons = [
    "ingress",
    "storage-provisioner"
  ]
}

resource "time_sleep" "wait_for_cluster" {
  depends_on      = [minikube_cluster.devopspractice]
  create_duration = "90s"
}

module "app" {
  source     = "../../modules/app"
  depends_on = [time_sleep.wait_for_cluster]
}