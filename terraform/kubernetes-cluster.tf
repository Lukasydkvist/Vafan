resource "azurerm_kubernetes_cluster" "vafan" {
  name                = var.app_name
  resource_group_name = azurerm_resource_group.vafan.name
  location            = var.location
  dns_prefix          = var.app_name

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_B2s"
  }

  identity {
    type = "SystemAssigned"
  }
}

resource "azurerm_role_assignment" "vafan" {
  principal_id                     = azurerm_kubernetes_cluster.vafan.kubelet_identity[0].object_id
  role_definition_name             = "AcrPull"
  scope                            = azurerm_container_registry.vafan.id
  skip_service_principal_aad_check = true
}