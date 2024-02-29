resource "azurerm_resource_group" "vafan" {
  name     = var.app_name
  location = var.location
}
