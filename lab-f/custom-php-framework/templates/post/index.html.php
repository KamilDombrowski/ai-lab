<?php

/** @var \App\Model\Post[] $posts */
/** @var \App\Service\Router $router */

$title = 'Post List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Posts List</h1>

    <a href="<?= $router->generatePath('post-create') ?>">Create new</a>

    <ul class="index-list">
        <?php foreach ($posts as $post): ?>
            <li>
                <h3><?= $post->getBrand() ?> <?= $post->getModel() ?> (<?= $post->getYear() ?>)</h3>
                <p>Cena: <?= $post->getPrice() ?> PLN</p>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('post-show', ['id' => $post->getId()]) ?>">Szczegóły</a></li>
                    <li><a href="<?= $router->generatePath('post-edit', ['id' => $post->getId()]) ?>">Edytuj</a></li>
                    <li><a href="<?= $router->generatePath('post-delete', ['id' => $post->getId()]) ?>" onclick="return confirm('Na pewno usunąć?')">Usuń</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
