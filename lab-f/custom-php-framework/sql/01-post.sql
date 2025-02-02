create table post
(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    price REAL NOT NULL
);

INSERT INTO post (brand, model, year, price) VALUES ('Toyota', 'Corolla', 2020, 75000);
INSERT INTO post (brand, model, year, price) VALUES ('Ford', 'Focus', 2018, 62000);
INSERT INTO post (brand, model, year, price) VALUES ('Volkswagen', 'Golf', 2019, 80000);
INSERT INTO post (brand, model, year, price) VALUES ('BMW', '320i', 2021, 125000);
INSERT INTO post (brand, model, year, price) VALUES ('Audi', 'A4', 2022, 135000);