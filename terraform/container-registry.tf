
resource "azurerm_container_registry" "vafan" {
  name                = var.app_name
  location            = var.location
  resource_group_name = azurerm_resource_group.vafan.name
  sku                 = "Basic"
  admin_enabled       = true
}
