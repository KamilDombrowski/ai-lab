<?php
    /** @var $post ?\App\Model\Post */
?>

<div class="form-group">
    <label for="brand">Marka:</label>
    <input type="text" id="brand" name="post[brand]" value="<?= $post ? htmlspecialchars($post->getBrand()) : '' ?>" required>
</div>

<div class="form-group">
    <label for="model">Model:</label>
    <input type="text" id="model" name="post[model]" value="<?= $post ? htmlspecialchars($post->getModel()) : '' ?>" required>
</div>

<div class="form-group">
    <label for="year">Rok:</label>
    <input type="number" id="year" name="post[year]" value="<?= $post ? htmlspecialchars($post->getYear()) : '' ?>" required>
</div>

<div class="form-group">
    <label for="price">Cena:</label>
    <input type="number" step="0.01" id="price" name="post[price]" value="<?= $post ? htmlspecialchars($post->getPrice()) : '' ?>" required>
</div>

