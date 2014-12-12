#!/usr/bin/env bash

apt-get update
apt-get install --yes nodejs npm gcc-multilib g++-multilib
ln -s /usr/bin/nodejs /usr/bin/node
