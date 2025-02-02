<?php

/** @var \App\Model\Post $post */
/** @var \App\Service\Router $router */

$title = "{$post->getBrand()} {$post->getModel()} ({$post->getYear()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= htmlspecialchars($post->getBrand()) ?> <?= htmlspecialchars($post->getModel()) ?></h1>
    <ul>
        <li>Rok: <?= htmlspecialchars($post->getYear()) ?></li>
        <li>Cena: <?= htmlspecialchars($post->getPrice()) ?> PLN</li>
    </ul>

    <ul class="action-list">
        <li><a href="<?= $router->generatePath('post-index') ?>">Powrót do listy</a></li>
        <li><a href="<?= $router->generatePath('post-edit', ['id' => $post->getId()]) ?>">Edytuj</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';