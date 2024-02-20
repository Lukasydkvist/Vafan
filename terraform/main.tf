# main.tf
provider "azurerm" {
  features {}
  skip_provider_registration = true
}

data "azurerm_resource_group" "scalable" {
  name     = "scalable"
}

resource "azurerm_container_registry" "scalable" {
  name = "scalable"
  location            = data.azurerm_resource_group.scalable.location
  resource_group_name = data.azurerm_resource_group.scalable.name
  sku                 = "Basic"
}


resource "azurerm_kubernetes_cluster" "scalable" {
  name                = "scalable-aks"
  resource_group_name = data.azurerm_resource_group.scalable.name
  location            = data.azurerm_resource_group.scalable.location
  dns_prefix          = "scalable-aks"

  node_resource_group = "scalable-rg"  # Specify the resource group of the existing VM

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_B2s"
  }

  identity {
    type = "SystemAssigned"
  }
}


resource "azurerm_role_assignment" "scalable" {
  principal_id                     = azurerm_kubernetes_cluster.scalable.kubelet_identity[0].object_id
  role_definition_name             = "AcrPull"
  scope                            = azurerm_container_registry.scalable.id
  skip_service_principal_aad_check = true
}

# Virtual Machine
resource "azurerm_linux_virtual_machine" "scalable" {
  name                  = "scalable-vm"
  resource_group_name   = data.azurerm_resource_group.scalable.name
  location              = data.azurerm_resource_group.scalable.location
  size                  = "Standard_B1s"
  admin_username        = "duden"
  admin_password        = "!VpTVXLsUJMND"
  disable_password_authentication = false

  network_interface_ids = [azurerm_network_interface.scalable.id]

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "18.04-LTS"
    version   = "latest"
  }

  computer_name = "scalable"
}


resource "azurerm_public_ip" "scalable" {
    name = "scalable-aks-public-ip"
    resource_group_name = data.azurerm_resource_group.scalable.name
    location = data.azurerm_resource_group.scalable.location
    allocation_method = "Dynamic"
}

resource "azurerm_network_security_group" "scalable" {
  name                = "scalable-nsg"
  resource_group_name = data.azurerm_resource_group.scalable.name
  location            = data.azurerm_resource_group.scalable.location
}

# Network Interface 
resource "azurerm_network_interface" "scalable" {
  name                = "scalable-nic"
  location            = data.azurerm_resource_group.scalable.location
  resource_group_name = data.azurerm_resource_group.scalable.name

  ip_configuration {
    name                          = "scalable-ip"
    subnet_id                     = azurerm_subnet.scalable.id
    private_ip_address_allocation = "Dynamic"
  }
}

# Subnet
resource "azurerm_subnet" "scalable" {
  name                 = "subnet1"
  resource_group_name  = data.azurerm_resource_group.scalable.name
  virtual_network_name = azurerm_virtual_network.scalable.name
  address_prefixes     = ["10.0.1.0/24"]
}

# Virtual Network
resource "azurerm_virtual_network" "scalable" {
  name                = "scalable-vnet"
  resource_group_name = data.azurerm_resource_group.scalable.name
  location            = data.azurerm_resource_group.scalable.location
  address_space       = ["10.0.0.0/16"]
}

resource "azurerm_lb" "scalable" {
  name                = "scalable-lb"
  resource_group_name = data.azurerm_resource_group.scalable.name
  location            = data.azurerm_resource_group.scalable.location

  frontend_ip_configuration {
    name                 = "scalable-frontend-ip"
    public_ip_address_id = azurerm_public_ip.scalable.id
  }
}

resource "azurerm_lb_backend_address_pool" "scalable" {
  name                = "scalable-be-pool"
  loadbalancer_id     = azurerm_lb.scalable.id
}

resource "azurerm_network_interface_backend_address_pool_association" "scalable" {
  count                        = 1
  network_interface_id         = azurerm_network_interface.scalable.id
  ip_configuration_name        = azurerm_network_interface.scalable.ip_configuration[0].name
  backend_address_pool_id      = azurerm_lb_backend_address_pool.scalable.id
}

