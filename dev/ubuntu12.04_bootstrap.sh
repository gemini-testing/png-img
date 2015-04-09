#!/usr/bin/env bash

apt-get update
sudo apt-get install build-essential --yes
wget http://nodejs.org/dist/v0.10.33/node-v0.10.33.tar.gz
tar -xvf node-v0.10.33.tar.gz
cd node-v0.10.33
./configure
make
sudo make install
