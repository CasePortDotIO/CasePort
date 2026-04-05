<?php
// SPA Router - Serve index.html for all non-existent files/directories
$requested_file = $_SERVER['REQUEST_URI'];
$requested_file = str_replace('/index.php', '', $requested_file);

// Remove query string
if (strpos($requested_file, '?') !== false) {
    $requested_file = substr($requested_file, 0, strpos($requested_file, '?'));
}

// Remove trailing slash
$requested_file = rtrim($requested_file, '/');

// List of actual files/directories to serve directly
$real_files = [
    '/assets',
    '/robots.txt',
    '/sitemap.xml',
    '/favicon.ico',
    '/__manus__',
];

// Check if it's a real file or directory
$is_real = false;
foreach ($real_files as $real_file) {
    if (strpos($requested_file, $real_file) === 0) {
        $is_real = true;
        break;
    }
}

// If it's a real file/directory, let the server handle it
if ($is_real || file_exists($_SERVER['DOCUMENT_ROOT'] . $requested_file)) {
    return false;
}

// Otherwise, serve index.html for SPA routing
require_once $_SERVER['DOCUMENT_ROOT'] . '/index.html';
?>
