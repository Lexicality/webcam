#!/bin/bash
cd /var/www/webcam/
now=$1
cd ./$now
pwd
mkdir tlapse
pwd
cd tlapse
pwd
cp ../../run.phps ./run.php
cp ../*.jpg ./
find . -empty | xargs rm
php run.php
pwd
ffmpeg -i %d.jpg -r 30 ../../$now.webm
cd ..
rm -rf tlapse

