<?php
namespace App\Model;

use App\Service\Config;

class Post
{
    private ?int $id = null;
    private ?string $brand = null;
    private ?string $model = null;
    private ?int $year = null;
    private ?float $price = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Post
    {
        $this->id = $id;
        return $this;
    }

    public function getBrand(): ?string
    {
        return $this->brand;
    }

    public function setBrand(?string $brand): Post
    {
        $this->brand = $brand;
        return $this;
    }

    public function getModel(): ?string
    {
        return $this->model;
    }

    public function setModel(?string $model): Post
    {
        $this->model = $model;
        return $this;
    }

    public function getYear(): ?int
    {
        return $this->year;
    }

    public function setYear(?int $year): Post
    {
        $this->year = $year;
        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(?float $price): Post
    {
        $this->price = $price;
        return $this;
    }

    public static function fromArray($array): Post
    {
        $post = new self();
        $post->fill($array);

        return $post;
    }

    public function fill($array): Post
    {
        if (isset($array['id']) && !$this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['brand'])) {
            $this->setBrand($array['brand']);
        }
        if (isset($array['model'])) {
            $this->setModel($array['model']);
        }
        if (isset($array['year'])) {
            $this->setYear($array['year']);
        }
        if (isset($array['price'])) {
            $this->setPrice($array['price']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM post';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $posts = [];
        $postsArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($postsArray as $postArray) {
            $posts[] = self::fromArray($postArray);
        }

        return $posts;
    }

    public static function find($id): ?Post
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM post WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $postArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (!$postArray) {
            return null;
        }
        $post = Post::fromArray($postArray);

        return $post;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (!$this->getId()) {
            $sql = "INSERT INTO post (brand, model, year, price) VALUES (:brand, :model, :year, :price)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'brand' => $this->getBrand(),
                'model' => $this->getModel(),
                'year' => $this->getYear(),
                'price' => $this->getPrice(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE post SET brand = :brand, model = :model, year = :year, price = :price WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':brand' => $this->getBrand(),
                ':model' => $this->getModel(),
                ':year' => $this->getYear(),
                ':price' => $this->getPrice(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM post WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setBrand(null);
        $this->setModel(null);
        $this->setYear(null);
        $this->setPrice(null);
    }
}
