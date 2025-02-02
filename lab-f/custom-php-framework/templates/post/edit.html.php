<?php

/** @var \App\Model\Post $post */
/** @var \App\Service\Router $router */
/** @var array $errors */

$title = "Edytuj samochód: {$post->getBrand()} {$post->getModel()} ({$post->getId()})";
$bodyClass = "edit";

ob_start(); ?>

    <h1><?= htmlspecialchars($title) ?></h1>

<?php if (!empty($errors)): ?>
    <div class="errors">
        <ul>
            <?php foreach ($errors as $error): ?>
                <li><?= htmlspecialchars($error) ?></li>
            <?php endforeach; ?>
        </ul>
    </div>
<?php endif; ?>

    <form action="<?= $router->generatePath('post-edit', ['id' => $post->getId()]) ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="post-edit">
        <input type="hidden" name="id" value="<?= $post->getId() ?>">
        <button type="submit">Zapisz zmiany</button>
    </form>

    <ul class="action-list">
        <li>
            <a href="<?= $router->generatePath('post-index') ?>">Powrót do listy</a>
        </li>
        <li>
            <form action="<?= $router->generatePath('post-delete', ['id' => $post->getId()]) ?>" method="post">
                <input type="submit" value="Usuń" onclick="return confirm('Czy na pewno chcesz usunąć ten samochód?')">
                <input type="hidden" name="action" value="post-delete">
            </form>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
