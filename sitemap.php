<?php

header('Content-Type: application/xml; charset=UTF-8');

$pages = [
    '/'              => [__DIR__ . '/index.php',       'daily',  '1.0'],
    '/new-yono-games' => [__DIR__ . '/new-yono-games.php',       'daily',  '0.9'],
    '/yono-rummy'    => [__DIR__ . '/yono-rummy.php',  'weekly', '0.8'],
    '/rummy-91'      => [__DIR__ . '/rummy-91.php',    'weekly', '0.8'],
    '/777-game'      => [__DIR__ . '/777-game.php',    'weekly', '0.8'],
    '/yono-777'      => [__DIR__ . '/yono-777.php',    'weekly', '0.8'],
    '/boss-rummy'    => [__DIR__ . '/boss-rummy.php',  'weekly', '0.8'],
    '/joy-rummy'     => [__DIR__ . '/joy-rummy.php',   'weekly', '0.8'],
    '/ok-rummy'      => [__DIR__ . '/ok-rummy.php',    'weekly', '0.8'],
    '/spin-winner'   => [__DIR__ . '/spin-winner.php', 'weekly', '0.8'],
    '/spin-777'      => [__DIR__ . '/spin-777.php',    'weekly', '0.8'],
    '/yono-slots'    => [__DIR__ . '/yono-slots.php',  'weekly', '0.8'],
    '/game-rummy'    => [__DIR__ . '/game-rummy.php',  'weekly', '0.8'],
    '/jaiho-91'      => [__DIR__ . '/jaiho-91.php',    'weekly', '0.8'],
    '/club-inr'      => [__DIR__ . '/club-inr.php',    'weekly', '0.8'],
    '/inr-rummy'     => [__DIR__ . '/inr-rummy.php',   'weekly', '0.8'],
    '/win-rummy'     => [__DIR__ . '/win-rummy.php',   'weekly', '0.8'],
    '/bingo-101'     => [__DIR__ . '/bingo-101.php',   'weekly', '0.8'],
    '/jaiho-slots'   => [__DIR__ . '/jaiho-slots.php', 'weekly', '0.8'],
    '/max-rummy'     => [__DIR__ . '/max-rummy.php',   'weekly', '0.8'],
    '/jaiho-rummy'   => [__DIR__ . '/jaiho-rummy.php', 'weekly', '0.8'],
    '/spin-gold'     => [__DIR__ . '/spin-gold.php',   'weekly', '0.8'],
    '/slots-winner'  => [__DIR__ . '/slots-winner.php','weekly', '0.8'],
    '/ever-777'      => [__DIR__ . '/ever-777.php',    'weekly', '0.8'],
    '/rummy-888'     => [__DIR__ . '/rummy-888.php',   'weekly', '0.8'],
    '/rummy-77'      => [__DIR__ . '/rummy-77.php',    'weekly', '0.8'],
    '/rummy-ludo'    => [__DIR__ . '/rummy-ludo.php',  'weekly', '0.8'],
    '/rummy-gold'    => [__DIR__ . '/rummy-gold.php',  'weekly', '0.8'],
    '/rummy-game'    => [__DIR__ . '/rummy-game.php',  'weekly', '0.8'],
    '/yono-game'    => [__DIR__ . '/yono-game.php',  'weekly', '0.8'],
    '/yono-all-games'    => [__DIR__ . '/yono-all-games.php',  'weekly', '0.8'],
    '/yono-vip'    => [__DIR__ . '/yono-vip.php',  'weekly', '0.8'],
    '/disclaimer'     => [__DIR__ . '/disclaimer.php',   'monthly', '0.6'],
    '/privacy-policy'     => [__DIR__ . '/privacy-policy.php',   'monthly', '0.6'],
    
];

$baseUrl = 'https://goldrummy.me';

echo '<?xml version="1.0" encoding="UTF-8"?>';
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<?php foreach ($pages as $path => [$file, $changefreq, $priority]): ?>

    <?php
    $timestamp = file_exists($file)
        ? filemtime($file)
        : time();

    $lastmod = date('c', $timestamp);
    ?>

    <url>
        <loc><?= htmlspecialchars($baseUrl . $path, ENT_XML1, 'UTF-8') ?></loc>
        <lastmod><?= $lastmod ?></lastmod>
        <changefreq><?= $changefreq ?></changefreq>
        <priority><?= $priority ?></priority>
    </url>

<?php endforeach; ?>
</urlset>