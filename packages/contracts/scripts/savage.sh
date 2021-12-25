#!/bin/bash

# install 300,000 npm libraries & create verbose sceripts with 40k library dependencies or
# on any linux server anywhere or any macbook:

# cat whitelist.csv
# copy paste output
# vim save paste into whitelist.txt
# format per line =
# # "0xa1c80355e5633d5d6c50345bc362de6320e8ad7a","2180913677.03582","No"
awk NR\>1 white.txt | sed s/\"//g | sed 's/,/ /g' | cut -d' ' -f 1 -f 2
