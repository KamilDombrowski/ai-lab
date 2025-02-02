<?php

/** @var \App\Model\Post $post */
/** @var \App\Service\Router $router */
/** @var array $errors */

$title = 'Dodaj samochód';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Dodaj nowy samochód</h1>

<?php if (!empty($errors)): ?>
    <ul class="errors">
        <?php foreach ($errors as $error): ?>
            <li><?= htmlspecialchars($error) ?></li>
        <?php endforeach; ?>
    </ul>
<?php endif; ?>

    <form action="<?= $router->generatePath('post-create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="post-create">
        <button type="submit">Dodaj</button>
    </form>

    <a href="<?= $router->generatePath('post-index') ?>">Powrót do listy</a>
<?php $main = ob_get_clean();


include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
