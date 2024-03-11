resource "azurerm_kubernetes_cluster" "vafan" {
  name                = var.app_name
  resource_group_name = azurerm_resource_group.vafan.name
  location            = var.location
  dns_prefix          = var.app_name

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_B2s"
    type            = "VirtualMachineScaleSets" 
    enable_auto_scaling = true                  
    min_count       = 1                         
    max_count       = 5                        
  }

  identity {
    type = "SystemAssigned"
  }

  auto_scaler_profile {
    balance_similar_node_groups      = "true"
    max_graceful_termination_sec     = "600"
    scale_down_unneeded              = "20m"
    scale_down_unready               = "20m"
    scale_down_utilization_threshold = "0.5"
    scan_interval                    = "10s"
  }
}

resource "azurerm_role_assignment" "vafan" {
  principal_id                     = azurerm_kubernetes_cluster.vafan.kubelet_identity[0].object_id
  role_definition_name             = "AcrPull"
  scope                            = azurerm_container_registry.vafan.id
  skip_service_principal_aad_check = true
}
