<?php
$currentUrl = "https://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
$targetDomain = "https://creativity.by";

$newUrl = $targetDomain . $_SERVER['REQUEST_URI'];

header("Location: $newUrl", true, 301);

exit;
