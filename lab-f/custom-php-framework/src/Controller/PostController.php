<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Post;
use App\Service\Router;
use App\Service\Templating;

class PostController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $posts = Post::findAll();
        if (empty($posts)) {
            $html = $templating->render('post/index.html.php', [
                'posts' => $posts,
                'router' => $router,
                'message' => 'Brak samochodów w bazie danych.',
            ]);
        } else {
            $html = $templating->render('post/index.html.php', [
                'posts' => $posts,
                'router' => $router,
            ]);
        }
        return $html;
    }

    public function createAction(?array $requestPost, Templating $templating, Router $router): ?string
    {
        $errors = [];

        if ($requestPost) {
            if (empty($requestPost['brand'])) {
                $errors[] = 'Marka jest wymagana.';
            }
            if (empty($requestPost['model'])) {
                $errors[] = 'Model jest wymagany.';
            }
            if (empty($requestPost['year']) || !is_numeric($requestPost['year']) || $requestPost['year'] < 1886 || $requestPost['year'] > date('Y')) {
                $errors[] = 'Rok musi być liczbą od 1886 do ' . date('Y') . '.';
            }
            if (empty($requestPost['price']) || !is_numeric($requestPost['price']) || $requestPost['price'] <= 0) {
                $errors[] = 'Cena musi być liczbą większą od zera.';
            }

            if (empty($errors)) {
                $post = Post::fromArray($requestPost);
                $post->save();

                $path = $router->generatePath('post-index');
                $router->redirect($path);
                return null;
            }
        } else {
            $post = new Post();
        }

        $html = $templating->render('post/create.html.php', [
            'post' => $post ?? new Post(),
            'router' => $router,
            'errors' => $errors,
        ]);
        return $html;
    }

    public function editAction(int $postId, ?array $requestPost, Templating $templating, Router $router): ?string
    {
        $post = Post::find($postId);
        if (!$post) {
            throw new NotFoundException("Brak samochodu o ID $postId");
        }

        if ($requestPost) {
            $errors = [];

            if (empty($requestPost['brand'])) {
                $errors[] = 'Marka jest wymagana.';
            }
            if (empty($requestPost['model'])) {
                $errors[] = 'Model jest wymagany.';
            }
            if (empty($requestPost['year']) || !is_numeric($requestPost['year']) || $requestPost['year'] < 1886 || $requestPost['year'] > 2024) {
                $errors[] = 'Rok musi być liczbą z zakresu od 1886 do 2024.';
            }
            if (empty($requestPost['price']) || !is_numeric($requestPost['price']) || $requestPost['price'] <= 0) {
                $errors[] = 'Cena musi być liczbą większą od zera.';
            }

            if (!empty($errors)) {
                $html = $templating->render('post/edit.html.php', [
                    'post' => $post,
                    'router' => $router,
                    'errors' => $errors,
                ]);
                return $html;
            }

            $post->fill($requestPost);
            $post->save();

            $path = $router->generatePath('post-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('post/edit.html.php', [
            'post' => $post,
            'router' => $router,
            'errors' => [],
        ]);
        return $html;
    }

    public function showAction(int $postId, Templating $templating, Router $router): ?string
    {
        if ($postId <= 0) {
            throw new NotFoundException("ID samochodu musi być liczbą większą od 0.");
        }

        $post = Post::find($postId);$post = Post::find($postId);
        if (!$post) {
            throw new NotFoundException("Samochód o ID $postId nie istnieje.");
        }

        $html = $templating->render('post/show.html.php', [
            'post' => $post,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $postId, Router $router): ?string
    {
        $post = Post::find($postId);
        if (! $post) {
            throw new NotFoundException("Samochód o ID $postId nie istnieje");
        }
        $post->delete();
        $path = $router->generatePath('post-index');
        $router->redirect($path);
        return null;
    }
}
