<?php

// Configuración más detallada para OpenSSL
$config = array(
    "config" => "C:/xampp/php/extras/ssl/openssl.cnf", // Ruta al archivo de configuración de OpenSSL
    "private_key_bits" => 4096,
    "private_key_type" => OPENSSL_KEYTYPE_RSA,
    "digest_alg" => "sha256",
    "encrypt_key" => false
);

// Verificar si la extensión OpenSSL está habilitada
if (!extension_loaded('openssl')) {
    die("La extensión OpenSSL no está habilitada en PHP.\n");
}

// Verificar si el directorio existe
$jwtDir = __DIR__ . '/config/jwt';
if (!is_dir($jwtDir)) {
    if (!mkdir($jwtDir, 0777, true)) {
        die("No se pudo crear el directorio: $jwtDir\n");
    }
}

// Generar el par de claves
$res = openssl_pkey_new($config);
if ($res === false) {
    die("Error al generar las claves: " . openssl_error_string() . "\n");
}

// Extraer la clave privada
if (!openssl_pkey_export($res, $privateKey, null, $config)) {
    die("Error al exportar la clave privada: " . openssl_error_string() . "\n");
}

// Extraer la clave pública
$publicKey = openssl_pkey_get_details($res);
if ($publicKey === false) {
    die("Error al obtener la clave pública: " . openssl_error_string() . "\n");
}
$publicKey = $publicKey["key"];

// Guardar la clave privada
if (file_put_contents($jwtDir . '/private.pem', $privateKey) === false) {
    die("Error al guardar la clave privada\n");
}

// Guardar la clave pública
if (file_put_contents($jwtDir . '/public.pem', $publicKey) === false) {
    die("Error al guardar la clave pública\n");
}

echo "Claves generadas exitosamente.\n";
echo "Clave privada guardada en: $jwtDir/private.pem\n";
echo "Clave pública guardada en: $jwtDir/public.pem\n";

// Mostrar información de las claves
echo "\nInformación de las claves:\n";
echo "Tamaño de la clave: 4096 bits\n";
echo "Algoritmo: RSA\n";
echo "Hash: SHA256\n"; 