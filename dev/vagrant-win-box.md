## How to create windows vagrant box
1. In `Virtual Box` create new Win7 machine, name it `Win7x32` for exmple, install Windows.
2. Run `Win7x32` virtual machine
3. Choose Work Network in network configuration dialog window
4. Create new user `vagrant` with password `vagrant` with administrator privileges
5. Login as a `vagrant` user
6. Disable complex passwords
  - `Start` -> type `GPEDIT.MSC` in the search box command and press Enter
  - `Computer Configuration` -> `Local Group Policy Editor` -> `Windows Settings` -> `Security Settings` -> `Account Policies` -> `Password Policy`
  - `Password must meet complexity requirements` should be `Disabled`. If not - double-click on it and choose `Disalbed`
7. Disable `UAC`
  - `Start` -> `Control Panel`
  - type `uac` in the search field in the top right corner
  - `Change User Account Control settings` -> move slider down (`Never notify`)
8. Install `cygwin`
9. Install and configure `openssh` (see [howto](#vagrant-win-ssh-howto))
10. Configure ssh access using key

  ```
  $ mkdir ~/.ssh
  $ echo 'ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEA6NF8iallvQVp22WDkTkyrtvp9eWW6A8YVr+kz4TjGYe7gHzIw+niNltGEFHzD8+v1I2YJ6oXevct1YeS0o9HZyN1Q9qgCgzUFtdOKLv6IedplqoPkcmF0aYet2PkEDo3MlTBckFXPITAMzF8dJSIFo9D8HfdOV0IAdx4O7PtixWKn5y2hMNG0zQPyUecp4pzC6kivAIhyfHilFR61RGL+GPXQ2MWZWFYbAGjyiYJnAmCP3NOTd0jMZEnDkbUvxhMmBYSdETk1rRgm+R4LOzFUGaHqHDLKLX+FIPKcF96hrucXzcWyLbIbEgE98OHlnVYCzRdK8jlqm8tehUc9c9WhQ== vagrant insecure public key' > ~/.ssh/authorized_keys
  ```
11. Create firewall rule for port `22`:
  - `Start` -> `Control Panel` -> `System and Security` -> `Windows Firewall` -> `Advanced Settings` -> `Inbound Rules` -> `New Rule ...`
  - For new rule choose `Port` -> `TCP` and a `Specified local port` of `22` -> `Allow the connection` -> check `Domain` and `Private` (uncheck `Public`) -> give the rule a name like `SSH`.
12. Configure winrm: run `cmd` as Administrator and run next commands

  ```
  $ winrm quickconfig -q
  $ winrm set winrm/config/winrs @{MaxMemoryPerShellMB="512"}
  $ winrm set winrm/config @{MaxTimeoutms="1800000"}
  $ winrm set winrm/config/service @{AllowUnencrypted="true"}
  $ winrm set winrm/config/service/auth @{Basic="true"}
  $ sc config WinRM start= auto
  ```
13. Install nodejs using corresponding package from http://nodejs.org/download/
14. Edit `C:\Program Files (x86)\nodejs\node_modules\npm\npmrc`.

  ```
  prefix=C:\Program Files (x86)\nodejs\node_modules\npm
  ```
  If there is no `Program Files (x86)` directory, then it should be just `Program Files`.
  If you will not fix this file, then during `npm install` in `ssh` session you'll get error: `Error: Failed to replace env in config: ${APPDATA}`
15. Install `python 2.x` (required for `node-gyp`)
16. Install Visual Studio 2013 Express for Windows Desktop (english version, or there can be problems with encoding in ssh session)
17. Shut down `Win7x32` virtual machine
18. In terminal go to `png-img` root directory
19. Run `vagrant package --base Win7x32 --output win.box`

## How to configure openssh in windows<a name="vagrant-win-ssh-howto"></a>
1. In `cygwin` install `openssh` and some editor (`vim` for example)
2. Run `cygwin` command prompt as Admininstrator
3. Run

    ```bash
    # Sync cygwin users and groups and local users and groups
    $ mkpasswd -l > /etc/passwd
    $ mkgroup -l > /etc/group

    # Run configurator
    $ ssh-host-config
    Overwrite existing /etc/ssh_config file? (yes/no) yes
    Overwrite existing /etc/sshd_config file? (yes/no) yes
    Should StrictModes be used? (yes/no) no
    Should privilege separation be used? (yes/no) yes
    Should this script attempt to create a new local account 'sshd'? (yes/no) yes
    Do you want to install sshd as a service? (yes/no) yes
    Enter the value of CYGWIN for the daemon: [] ntsec
    Do you want to use a different name? (yes/no) no
    Create new privileged user account '<machine_name>\cyg_server' (Cygwin name: 'cyg_server')? (yes/no) yes
    Please enter the password: ssh

    # Start service
    $ net start sshd
    The CYGWIN sshd service was started successfully!
    ```
4. If there some errors or warnings see [troubleshooting](#vagrant-win-ssh-troubleshooting)

### Troubleshooting<a name="vagrant-win-ssh-troubleshooting"></a>
#### Error `The specified local group does not exist`:
```bash
$ ssh-host-config
...
*** Error: The specified local group does not exist
# Here is something about root group
...
```
```bash
$ mkgroup -l > /etc/group

# Remove sshd service
$ cygrunsrv --stop sshd
$ cygrunsrv --remove sshd
# Delete any sshd or related users (such as cyg_server) from /etc/passwd (use your favorite editor)
# Delete any sshd or relaged users (such as cyg_server) from the system
$ net user sshd /delete
$ net user cyg_server /delete

$ ssh-host-config
```

#### Warning `Expected privileged user 'cyg_server' does not exist`:
```bash
$ ssh-host-config
...
*** Warning: Expected privileged user 'cyg_server' does not exist
*** Warning: Defaulting to 'SYSTEM'
```
And after that ssh doesn't work.

```bash
# remove service
$ cygrunsrv --stop sshd
$ cygrunsrv --remove sshd

# install service with cyg_server user manually
$ cygrunsrv -I sshd -d "CYGWIN sshd" -p /usr/sbin/sshd -a "-D" -y tcpip -e "CYGWIN=ntsec" -u "cyg_server" -w "ssh"
$ net start sshd
```

#### Error `The CYGWIN sshd service could not be started`:
```bash
$ net start sshd
The CYGWIN sshd service could not be started

The service did not report an error
...
```

```bash
$ tail -10 /var/log/sshd.log
/var/empty must be owned by root and not group or world-writable

$ chown cyg_server /var/empty
$ net start sshd
```

#### Error `invalid user cyg_server`:
```bash
$ chown cyg_server /var/empty
invalid user cyg_server
```
```bash
# Assuming ssh-host-config already performed and user cyg_server created
$ mkpasswd -l > /etc/passwd
$ chown cyg_server /var/empty
```
