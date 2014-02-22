#!/bin/bash
cd /var/www/webcam/
now=$(date +"%d_%m_%Y")
mkdir $now
mv *.jpg ./$now
./maketlapse.sh $now
