Vagrant.configure("2") do |config|


  config.vm.boot_timeout = 600

  config.vm.define "jenkins" do |jenkins|
    jenkins.vm.box = "ubuntu/jammy64"
    jenkins.vm.hostname = "jenkins"

    jenkins.vm.network "private_network",
      ip: "192.168.56.10"

    jenkins.vm.provider "virtualbox" do |vb|
      vb.memory = 2048
      vb.cpus = 1
    end
  end

  config.vm.define "app" do |app|
    app.vm.box = "ubuntu/jammy64"
    app.vm.hostname = "app"

    app.vm.network "private_network",
      ip: "192.168.56.11"

    app.vm.provider "virtualbox" do |vb|
      vb.memory = 2048
      vb.cpus = 1
    end
  end

end