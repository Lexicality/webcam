<?php
$a = 0;
foreach (glob("*.jpg") as $filename) {
    rename($filename,$a . ".jpg"); $a++;
}
