Vagrant.configure(2) do |config|
    config.vm.define "linux-old" do |linux|
        linux.vm.box = "ubuntu/precise32"
        linux.vm.provision :shell, path: "dev/ubuntu12.04_bootstrap.sh"
    end

    config.vm.define "linux" do |linux|
        linux.vm.box = "ubuntu/trusty64"
        linux.vm.provision :shell, path: "dev/ubuntu_bootstrap.sh"
    end

    config.vm.define "win" do |win|
        win.vm.box = "png-img-win"
        win.vm.box_url = "./win.box"

        win.ssh.insert_key = false

        win.vm.guest = :windows
        win.vm.communicator = "winrm"
        win.winrm.username = "vagrant"
        win.winrm.password = "vagrant"
    end
end
